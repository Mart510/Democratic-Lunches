// import block


// baseURL localhost for now can be changed later (dev or live switch for env ready)
const baseURL = 'http://localhost:3000';

// GET all poll options
async function pollOptions() {
    try {
        // await fetch
        const response = await fetch(`${baseURL}/options`);
        // Parse json
        const data = await response.json();
        // debug logger
        // console.log(data);
        return data;
        } catch (error) {
            console.error('Failed to fetch');
        }
};

// Vote handler
async function voteHandler(e) {
    // stop page from reloading on submit
    e.preventDefault();

    // access the form
    const form = e.target;

    // get which radio is checked
    const choiceHTMLElement = form.querySelector('input[name="choice"]:checked')

    // Vote for selected element
    if (choiceHTMLElement) {
        // get the value of selector
        const choice = choiceHTMLElement.value;
        // console.log(`You are trying to vote for: ${choice}`) // debug logger

        // POST result to database
        try {
            const payload = await fetch(`${baseURL}/vote`,  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({choice: choice})
            });

            // Check the server response
            if (!payload.ok) {
                console.error('Response Error');
            };

            // Log response from server
            const serverResponse = await payload.json();
            console.log(serverResponse.message)
        } catch (error) {
            console.error(`Failed to POST your vote`, error);
        };
    } else {
        console.log('No choice made');
    }
}


// get results handler
async function getResultsHandler(e) {
    console.log('fetching latest results') // debug logger

    // fetch request
    const currentResults = await pollOptions();

    // update each vote count on the DOM
    for (let i = 0; i < currentResults.length; i++) {
        // get the element about to be changed
        let resultID = `ResultsForOption${i+1}`;
        // find it in the tabe
        let resultToChange = document.getElementById(resultID);
        // update it
        resultToChange.textContent = `${currentResults[i].voteCount}`;
    };
};

// websocket deinfed here so it can be used in any function
let ws = null;

// Websocket client set up
function connectWebSocket() {
    // init ONLY IF websocket is not open
    if (!ws || ws.readState === WebSocket.CLOSED) {

        ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            console.log('New websocket connetion established');
            // Listener for incoming messages
            webSocketLiveUpdateListener();
        }
    };

    // on error log message
    ws.onerror = (error) => {
        console.log(`WebSocket connection error`, error);
    };

    // on unclean close retry
    ws.onclose = (event) => {
        if (!event.wasClean) {
            console.log('Socket closed unexpectedly, retrying in 3 seconds');
            setTimeout(connectWebSocket, 3000);
        }
    }
};

// Websocket send vote
async function webSocketVoteButtonHandler(e) {
    // stop page from reloading
    e.preventDefault();

    // access the form
    const form = document.getElementById("lunchForm");

    // check if the socket is ready
    if (ws.readyState !== WebSocket.OPEN) {
        console.log(`WebSocket is not open. Current State`, ws.readyState);
        return;
    }

    // get which radio is checked
    const choiceHTMLElement = form.querySelector('input[name="choice"]:checked')

    // vote for the current choice
    if (choiceHTMLElement) {
        // get the value of the current choice
        const choice = choiceHTMLElement.value;
        // convert choice into JSON
        const messageJSON = JSON.stringify(choice);
        // send message to websocket
        ws.send(messageJSON);
        // log to console
        console.log(`Vote for ${choice} sent to server`);
    } else {
        console.log('no choice made');
    }

};

// websocket recieve updated vote mesage
async function webSocketLiveUpdateListener() {
    ws.onmessage = (e) => {
        try {
            // parse the buffer into a JSON
            const data = JSON.parse(e.data);
            console.log(`Live update recived for: ${data.choice}, new total: ${data.voteCount}`)
            // find ID of the input tag
            let inputID = null;
            document.querySelectorAll('input[name="choice"]').forEach((input) => {
                if (input.value === data.choice) {
                    inputID = input.id;
                };
            });
            console.log(inputID)// debug logger
            // grab the right table cell and update the score
            if (inputID) {
                const resultID = `ResultsFor${inputID}`;
                console.log(resultID)
                let resultToUpdate = document.getElementById(resultID);
                if (resultToUpdate) {
                    resultToUpdate.textContent = data.voteCount;
                }
            }
        } catch (error) {
            // silently ignore anything that is not a valid JSON
        }
    }
};


// build table in form to show the choices and results
function lunchOptiosnTableConstructor(optionsList) {
    // select the div
    const voteAndResultsHolder = document.getElementById('voteAndResultsHolder');

    // Create a table
    const table = document.createElement('table');

    // set table headers
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const optionNameHeader = document.createElement('th');
    optionNameHeader.textContent = 'Lunch Options';
    const resultsHeader = document.createElement('th');
    resultsHeader.textContent = 'Total votes';
    headerRow.appendChild(optionNameHeader);
    headerRow.appendChild(resultsHeader);
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    // set table body
    const tableBody = document.createElement('tbody');

    // loop thru and fill table with data
    for (let i = 0; i < optionsList.length; i++) {

        // new row
            const row = document.createElement('tr');
        // cell for choice
            const choiceCell = document.createElement('td');
        // add choice radio button
            let radioButton = document.createElement('input');
            radioButton.setAttribute('type', 'radio');
            radioButton.setAttribute('id', `Option${i+1}`);
            radioButton.setAttribute('name', 'choice');
            radioButton.setAttribute('value', optionsList[i].choice);
        // label radio button
            let label = document.createElement('label');
            label.setAttribute('for', optionsList[i].choice);
            label.textContent = optionsList[i].choice;
        // append to option cell
            choiceCell.appendChild(radioButton);
            choiceCell.appendChild(label);
        // append to row
            row.appendChild(choiceCell);
        // create result cell
            const resultCell = document.createElement('td');
            resultCell.setAttribute('id', `ResultsForOption${i+1}`);
            resultCell.textContent = optionsList[i].voteCount;
        // append to row
            row.appendChild(resultCell);
        // add row to the table
        tableBody.appendChild(row);
    }
    // append body to table
    table.appendChild(tableBody);

    // append table to the DIV
    voteAndResultsHolder.appendChild(table);
}


// On load
window.onload = async function() {

    // fetch poll options
    const todaysOptions = await pollOptions()

    //  create table and fill it
    lunchOptiosnTableConstructor(todaysOptions);

    // add functions to the buttons
    document.getElementById("lunchForm").addEventListener('submit', voteHandler);
    document.getElementById('getResultsButton').addEventListener('click', getResultsHandler);
    document.getElementById('socketVoteButton').addEventListener('click', webSocketVoteButtonHandler);

    // connect websocket
    connectWebSocket();
}