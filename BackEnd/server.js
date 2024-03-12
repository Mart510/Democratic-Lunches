// import block
import express from 'express';
import router from './router.js';
import { WebSocketServer } from 'ws';
import serverSocketVoteHander from './WEBSOCKET/wsVoteHandler.js';
import lunchOptions from './lunchOptions.js';

// Express Server set up
export const app = express();
export const port = 3000;

// middleware block
app.use(express.json());

// use the router
app.use('/', router);

app.listen(port, () => {
    console.log(`Server is live and listening on port ${port}`);
});


// Websocket set up
const wsServer = new WebSocketServer({port: '8080'});
// set to hold clients
const clients = new Set();

wsServer.on('connection', socket => {
    // Add new client to set
    clients.add(socket);
    console.log('new client connected');

    // send message to new client
    socket.send('connection established');

    // remove client on close
    socket.on('close', ()=> {
        clients.delete(socket);
        console.log('client disconnected');
    });

    // Broadcast to all connected clients
    function broadcastUpdatedScore(mesage) {
        for (const client of clients) {
            if (client.readyState === socket.OPEN) {
                client.send(JSON.stringify(mesage));
            }
        }
    };

    // VOTE message
    socket.on('message', (message) => {
        // convery buffer to string then parse the JSON
        let clientMessage = message.toString();
        clientMessage = JSON.parse(clientMessage);

        // console.log(`Client message: ${clientMessage}`) // debug logger

        // Returns true if the choice exists in the array
        const choiceExists = !!lunchOptions.find(object => object.choice === clientMessage)
        // console.log(`choiceExists: ${choiceExists}`) // debug logger

        // If choice exists pass the vote on and send the updated scores out
        if (choiceExists) {
            console.log(`vote recieved for ${clientMessage}`);
            const newTotal = serverSocketVoteHander(clientMessage);
            broadcastUpdatedScore(newTotal)
        }
    })
})