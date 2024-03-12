// import block
import lunchOptions from "../lunchOptions.js";

// function to hande websocket request
export default function serverSocketVoteHander (vote) {
    // WHEN a new post comes in
    // debug logger
    // console.log(`recieved vote for: ${vote}`)

    // match choice to options
    const optionVotedFor = lunchOptions.find(object => object.choice === vote);
    // increment the vote
    optionVotedFor.voteCount++;

    // console.log(optionVotedFor); // debug logger

    // get current total for that option and send it back
    return optionVotedFor;
}