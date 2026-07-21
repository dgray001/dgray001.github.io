# Known Issues (CUF) / Requirements for SJF

Findings from the code review. Each notes what's wrong on CUF and what SJF should do
instead. Severity is rough, top to bottom.

## Security

### 1. `data_control.php` is an unauthenticated arbitrary write
It `json_encode`s the raw POST body straight into `docs/data/data_control.json` with no
auth check. The frontend legitimately calls it (in `fetchJson` when a path is missing),
but as written any visitor can overwrite or poison that file and break content freshness
sitewide. SJF: remove the public write path, or gate it, or use a cache-busting scheme
that doesn't rely on a client-writable file.

### 2. Session cookie is `httponly=false` by design
`refreshCookies()` sets the session cookie non-httponly so `session.ts::loggedInSync` can
read it from JS. That means any XSS on the site yields full session theft. The frontend
only needs to know that it's logged in, not the session id itself.
SJF: keep the session cookie httponly and expose a separate non-sensitive flag for UI
state.

### 3. Upload/delete endpoints trust the filename
`lay_witness_file*.php` and `position_papers_file*.php` use `X-File-Name` / `filename`
directly in the write/delete path, allowing traversal. These require auth and a trusted
role so the risk is low, but SJF should still `basename()` the input before touching disk.

## Bugs / correctness

### 4. Contact and donate emails likely send an "Array" body
`contact.php` and `donate_email.php` pass the decoded array straight into `mail()`, which
expects a string, so the body probably renders as `"Array"`. `admin_dashboard/send_email.php`
does it right by passing `$received_data["body"]`. Needs verifying against a real inbox;
if broken, format the submitted fields into a string before sending. SJF: build the email
body explicitly.

### 5. `mime_content_type($in)` is called on a stream resource
In `lay_witness_file.php` the PDF type check passes a `fopen` handle, but the function
expects a filename. Verify the check actually works and isn't a silent no-op that lets
non-PDFs through. SJF: validate the uploaded type against real file bytes.

## Consistency / cleanup

### 6. Dead code and fragile deploy
`session.ts::loggedIn(check_backend=true)` logs "Not implemented", and deploy relies on
manually flipping `DEV`/`STAGING` flags in source and renaming `contact.php`. Not urgent,
but the shared library should centralize env config and drop the dead branch.
