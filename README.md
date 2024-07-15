# Node.js Number Processing API for demo assignment

## Requirements
A client is using a dashboard. He inputs a number from 1 to 25 {For eg - 5}. That number automatically gets multiplied by 7. 
1) If final number after multiplied by 7, is greater than 140, then its goes to file A. 
2) If final number after multiplied by 7, is greater than 100, then its goes to file B
3) If final number after multiplied by 7, is greater than 60 then its goes to file C. 
4) And all other numbers goes to file D

Once a number is stored in all files (A to D), the user can’t enter any new number and the process gets complete 


## Features

- Uses `morgan` for logging requests with rotating file streams.
- Limits incoming requests to prevent abuse.
- Provides an endpoint to view stored numbers.

## Setup

```bash
git clone nodejs-assignment
cd nodejs-assignment
npm install
mkdir logs output
npm run dev
```

## API Endpoints

1. GET /
- Description: Check if the server is running.
- Response:
`
Server is up & working!!
`

2. POST /input

- Description: Process an input number, multiply by 7, and store the result in the appropriate file.
- Request Body:
```json
{
  "number": <integer between 1 and 25>
}
```
- Responses:
```
400 Bad Request: If the number is not between 1 and 25.
200 OK: Number processed and saved, or process is complete if all files are filled
```

3. GET /files

- Description: Retrieve all stored numbers from the files.
- Response:
```json
{
  "A": [<number1>, <number2>, ...],
  "B": [<number1>, <number2>, ...],
  "C": [<number1>, <number2>, ...],
  "D": [<number1>, <number2>, ...]
}
```

## Example usage

* Send a number to be processed
```curl
curl -X POST http://localhost:3000/input -H "Content-Type: application/json" -d '{"number": 5}'
```

* Get stored numbers:

```
curl http://localhost:3000/files
```

