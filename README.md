DEV:
 - run PHP dev server (php -S localhost:3000 or via vscode PHP server extension)
 - run ngrok via: ngrok http https://localhost:3000
     => EDIT: 
 - modify test.json to accomodate forwarding url given by ngrok
 - ensure config files (outside doc root) are in dev mode
 - still use site in localhost => ngrok only for receipt page after donating