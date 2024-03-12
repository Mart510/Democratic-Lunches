// import block
import express from 'express';
import cors from 'cors';
// import API funcs block
import { getPollOptions } from './GET/getOptions.js';

// using express router for ease of scalilbility. If this stays small this extra boilerplate will have been overkill

// new router instance
const router = express.Router();

// enable cors middleware
router.use(cors());

// GET all poll options
router.get('/options', getPollOptions);

// Post a vote
// router.post('/vote', postMyVote);

// GET realtime results
router.get('/results', getPollOptions);

// Export router
export default router;
