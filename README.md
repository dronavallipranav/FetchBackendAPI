## Fetch Backend Assesment API

RESTAPI written in node using ExpressJS. This API records a single user's transactions.

### Built With

* [Node.js] [https://nodejs.org/en]
* [Express.js][https://expressjs.com/]
* [Sequelize][https://sequelize.org/]
* [sqllite3][https://www.sqlite.org/index.html]
* [Docker][https://www.docker.com/]


## Getting Started

### Prerequisites

Make sure you have nvm for easy node management.
* MacOS - Using HomeBrew
  ```sh
  brew install nvm
  ```
* Linux - 
  ```sh
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  ```

* Install Node Version
  ```sh
    nvm install 18.17.1
    nvm use 18.17.1
  ```

If you'd like to run the containerized version of the API, you will need to have the Docker CLI
* Linux - Instructions here https://docs.docker.com/engine/install/ubuntu/
* MacOS and Windows - Install Docker Desktop here https://docs.docker.com/desktop/install/mac-install/ which includes the daemon and the CLI.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/dronavallipranav/FetchBackendAPI.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the API server on port 8000
    ```sh
   node index.js
   ```
   or build the docker image and run the container on port 8000
   ```sh
   docker build -t fetch_api .
   docker run -p 8000:8000 -d fetch_api
   ```

## Usage

This API provides three endpoints 

   #### Endpoint: POST /add
   Request Body
   ```
   {
    payer: <String>
    points: <Integer>
    timestamp: <String>
   }
```
-Creates a user record in the database for the given payer, points, and timestamp.

-response:
* 200 OK: Points successfully added.
* 400 Bad Request: Request not formatted correctly.
* 500 Internal Server Error: Unexpected server error.

#### Endpoint: POST /spend
   Request Body
   ```
   {
    points: <Integer>
   }
```
-Spends user's points based on order that transactions were received

-response:
* 200 OK: Ledger table updated,response contains a list of points deducted per payer.
* 400 Bad Request: Can't spend zero or negative points, or user does not have enough points to spend.
* 500 Internal Server Error: Unexpected server error.

#### Endpoint: GET /balance

-Gets user's total points for each payer

-response:
* 200 OK: Successfully retrieved the list of payers and their point balance.
* 500 Internal Server Error: Unexpected server error.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Pranav Dronavalli - dronavallipranav@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
