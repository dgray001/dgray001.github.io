Dev server:
 - run PHP dev server (php -S localhost:3000 or via vscode PHP server extension)
 - run ngrok via: ngrok http http://localhost:3000
     => EDIT: Need to have an https url for authorize.net to work but need http when actually going to localhost
 - modify scripts/util.js::base_url to accomodate forwarding url given by ngrok
 - ensure config files (outside doc root) are in dev mode
 - can still use site in localhost => ngrok only for receipt page after donating
 - run WAMP server to simulate db

Testing:
 - run dev server and navigate to ./tests
 - event listeners can become corrupt; so may need to refresh page