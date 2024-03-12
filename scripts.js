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
            radioButton.setAttribute('id', `Options${i+1}`);
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

}