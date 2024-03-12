
# Democratic Lunch Chooser

A basic polling application use REST and webhooks to allow a team to decide on what to get for lunch together.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Mart510/Democratic-Lunches
```



Install dependencies

```bash
  npm install
```

Start the server (rapid build only supports dev mode at the moment)

```bash
  npm run dev
```

With the server running on your local machine you can navigate to a browser window to see the front end for example

```bash
  http://127.0.0.1:5501/
```
## Features

- Voting - Simply select an option you want to vote for and click vote
- Results fetching - To see the current totals click the get results button
- Real time vote and results - If you want to see the results and votes in realtime please click vote with Websocket and your vote will be added to the system and all connected clients will get an updated score on their screen



## Notes

This was a timed challenge so the code has room for improvements. Before I started coding I created a diagram to help me understand how this project should be structured. If you have any questions please feel free to ping me on GitHub.

![democraticLunchesDiagram](https://github.com/Mart510/Democratic-Lunches/assets/62957166/718366c3-9e1a-4288-8cc8-e50a26a73e42)
