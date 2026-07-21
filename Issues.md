# Known Issues (CUF) / Requirements for SJF

Findings from the code review. Each notes what's wrong on CUF and what SJF should do
instead. Severity is rough, top to bottom.

## Security

### 1. reCAPTCHA is never verified server-side
**Partially fixed** for `login`, `verify_email_code`, `verify_email`, and `reset_password`
(both CUF and SJF): each now calls `requireRecaptchaVerified()` (shared in
`core/server/includes/recaptcha_util.php`) before doing anything else, gated by a
one-time, session-linked flag set by the also-fixed `recaptcha.php` (which now checks the
v3 `score`/`action`, not just `success`). `contact` and `donate_email` are still
unprotected (not yet touched) and there's still no rate limiting or lockout on login, so
brute-force/spam via those two endpoints or via slow/low-rate credential stuffing is
still open.

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
**Fixed in `recaptcha.php`** (now `core/server/recaptcha.php`, shared by both sites) —
TLS verification is left on. `donate.php` and `internal_post.php` still set
`CURLOPT_SSL_VERIFYPEER=0` / `CURLOPT_SSL_VERIFYHOST=0` and still open the outbound
authorize.net credential exchange to MITM.

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
