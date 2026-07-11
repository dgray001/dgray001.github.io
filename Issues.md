# Known Issues (CUF) / Requirements for SJF

Findings from the code review. Each notes what's wrong on CUF and what SJF should do
instead. Severity is rough, top to bottom.

## Security

### 1. reCAPTCHA is never verified server-side
`recaptcha.php` exists but no endpoint calls it. `login`, `contact`, `donate_email`,
`verify_email`, and `reset_password` all trust that the frontend ran the captcha, so a
direct POST bypasses it entirely. There's also no rate limiting or lockout on login, so
this is an open door for mail spam and unlimited password brute-force.
SJF: verify the captcha token inside each protected endpoint and add basic per-IP login
throttling.

### 2. `download_faith_fact.php` has no auth and no input sanitization
The endpoint has no `loggedIn()` check, so the "members only" gate is purely client-side
and anyone can POST to it and get any faith fact. Worse, `category` and `filename` are
concatenated into a filesystem path unsanitized (`validateData` only checks the keys
exist), so a crafted body allows path traversal to read any `.pdf` on the server.
SJF: enforce the permission check server-side and resolve the file against a fixed
whitelist/basename rather than raw client strings.

### 3. `echo $name;` in `download_faith_fact.php` leaks the absolute server path
Line 20 echoes the full filesystem path into the response body before the PDF bytes.
It does not break the download (the frontend names the file and PDF viewers tolerate
leading junk), but the raw response discloses the server's directory structure. This is
leftover debug and should just be deleted.

### 4. `data_control.php` is an unauthenticated arbitrary write
It `json_encode`s the raw POST body straight into `docs/data/data_control.json` with no
auth check. The frontend legitimately calls it (in `fetchJson` when a path is missing),
but as written any visitor can overwrite or poison that file and break content freshness
sitewide. SJF: remove the public write path, or gate it, or use a cache-busting scheme
that doesn't rely on a client-writable file.

### 5. Session cookie is `httponly=false` by design
`refreshCookies()` sets the session cookie non-httponly so `session.ts::loggedInSync` can
read it from JS. That means any XSS on the site yields full session theft. The frontend
only needs to know that it's logged in, not the session id itself.
SJF: keep the session cookie httponly and expose a separate non-sensitive flag for UI
state.

### 6. curl disables TLS verification everywhere
`donate.php`, `recaptcha.php`, and `internal_post.php` all set `CURLOPT_SSL_VERIFYPEER=0`
and `CURLOPT_SSL_VERIFYHOST=0`. There's no reason to disable cert verification in prod,
and it opens the outbound authorize.net credential exchange to MITM. SJF: leave TLS
verification on.

### 7. `logout.php` open redirect
`header("location: " . $_GET['hard_redirect'])` redirects to an unvalidated user-supplied
URL. Low impact on its own but a classic phishing aid. SJF: validate the redirect target
against a same-origin allowlist.

### 8. Upload/delete endpoints trust the filename
`lay_witness_file*.php` and `position_papers_file*.php` use `X-File-Name` / `filename`
directly in the write/delete path, allowing traversal. These require auth and a trusted
role so the risk is low, but SJF should still `basename()` the input before touching disk.

## Bugs / correctness

### 9. Contact and donate emails likely send an "Array" body
`contact.php` and `donate_email.php` pass the decoded array straight into `mail()`, which
expects a string, so the body probably renders as `"Array"`. `admin_dashboard/send_email.php`
does it right by passing `$received_data["body"]`. Needs verifying against a real inbox;
if broken, format the submitted fields into a string before sending. SJF: build the email
body explicitly.

### 10. `mime_content_type($in)` is called on a stream resource
In `lay_witness_file.php` the PDF type check passes a `fopen` handle, but the function
expects a filename. Verify the check actually works and isn't a silent no-op that lets
non-PDFs through. SJF: validate the uploaded type against real file bytes.

## Consistency / cleanup

### 11. Frontend and backend permission roles don't match
`session.ts::hasPermission` uses roles `member`/`employee`, while server `permissions.php`
uses `admin_assistant`/`employee`. The server is the source of truth so it's cosmetic, but
the mismatch is confusing. SJF: define the role/permission map once in shared code.

### 12. Dead code and fragile deploy
`session.ts::loggedIn(check_backend=true)` logs "Not implemented", and deploy relies on
manually flipping `DEV`/`STAGING` flags in source and renaming `contact.php`. Not urgent,
but the shared library should centralize env config and drop the dead branch.
