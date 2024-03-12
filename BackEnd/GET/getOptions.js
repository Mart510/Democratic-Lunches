// import block
import lunchOptions from "../lunchOptions.js";

// GET all poll options
export const getPollOptions = (req, res) => {
    res.send(lunchOptions);
    console.log('Sending Array'); // debug logger
    console.log(lunchOptions); // debug logger
}