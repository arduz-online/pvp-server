# Arduz PvP server

## To run locally

1.  Create a copy of the file `config.base.json` named `config.json`
2.  Login and go to https://arduz.io/#/app/host-local
3.  Copy the `privateKey` value into the `config.json`
4.  Run `npm install && npm start` or using the Visual Studio Code debugger

You can now play your local server in https://arduz.io

## To debug both arduz-sdk and PvP-server

Make sure your folder structure looks like this

```
~/code/
~/code/arduz-sdk
~/code/pvp-server
```

Then, to build incrementaly (and not minified code) run in this folder:

```bash
make watch-with-sdk
```

After it emits the code you must restart the server with:

```
make run-debug-server
```
