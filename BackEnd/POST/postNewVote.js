// import block
import lunchOptions from "../lunchOptions.js";

// POST a vote option
export const postNewVote = (req, res) => {
    // check if the choice is present
    if (!req.body.choice) {
        return res.status(400).json({
            error: 'Choice is not present'
        });
    }
    // get the choice from the body
    const {choice} = req.body;
    // log it to console
    console.log(`Logging vote for ${choice}`);
    // match it to the options array
    const lunchChoice = lunchOptions.find(object => object.choice === choice);
    // increment the vote
    lunchChoice.voteCount++

    // let the front end know the vote was logged
    res.status(200).json({
        message: `Vote for ${choice} registed and counted.`
    })
}