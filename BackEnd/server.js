// import block
import express from 'express';
import router from './router.js';

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