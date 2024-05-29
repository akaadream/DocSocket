# Docket

Docket is a tool for testing and documenting your Web Socket projects.

Whether it's via Colyseus, SocketIO or pure web sockets, Docket comes with a set of services enabling you to adapt to your use cases.

What's more, Docket will soon be able to manage several projects simultaneously.
Switch from one project to another in just 1 click, and export documentation in Markdown format for easy inclusion in your README!

## The tool

You can access the tool by visiting the following link: https://docket.akadream.fr/

## Run a local version

If you want to run a local version of Docket, you can simply clone the repository, and install dependencies using NPM:
```
npm install
```
Then launch the app:
```
npm run dev
```
The app whill then be available at: http://localhost:5173/

A testing server for Colyseus is also available under the `docket-colyseus` folder:
```
cd docket-colyseus
npm start
```
This will start the NodeJS server and the colyseus server will be available at http://localhost:2567 on your browser and 
`ws://localhost:2567` for the web socket server address.

## Contribute

Contributions are welcome to make Docket even better.
The contribution guide will be posted as soon as possible but you can already fork the project and start working on an issue or relevant upgrade if you want.

## Export example

The documentation generated will have this form:

### ping
Type: `REQUEST`
```json
{
  "username": "string"
}
```

### pong
Type: `RESPONSE`
```json
{
  "username": "string"
}
```
