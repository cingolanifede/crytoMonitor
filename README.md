# cryto Monitor API with Node.js

Wrapper of CoinGecko (https://www.coingecko.com/en/api) API REST.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites

What things you need to install the software and how to install them

* Download [Node](https://nodejs.org/en/) and npm
* `npm install` to install all our node dependencies
* Download and install MongoDB

## Running the server
* run `npm start` to start the server.


## Built With
* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.]


# REST API

The REST API to the example app is described below.

# Create User's Account

Create an Account for the authenticated User if an Account for that User does not already exist. Each User can only have one Account.

**URL** : `/api/users/register`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Provide name of Account to be created. All fields required.

```json
{
        "first_name": "My name", 
        "last_name": "My Lastname",
        "username": "xxxxx",
        "password": "xxxx",
        "currency":"ars"
}
```

## Success Response

**Condition** : If everything is OK and an Account didn't exist for this User.

**Code** : `200 CREATED`

**Content example**

```json
{
    "response": {
        "message": "Signup successful",
        "user": {
            "currency": "ars",
            "_id": "602adc95f17a544b287147e7",
            "username": "cingolanifede2",
            "password": "$2b$10$22mQh3dBX8d.rx2KmoxNd.U.WeYRy1jeuaqop4lRxene4mfTWR9Yq",
            "createdAt": "2021-02-15T20:41:57.074Z",
            "updatedAt": "2021-02-15T20:41:57.074Z",
            "__v": 0
        }
    }
```

## Error Responses

**Condition** : If Account already exists for User.

**Code** : `400 BAD REQUEST`

**Content** : 
  `{
    "error": "Username already exists"
}`

### Or

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "\"[field]\" is required"
}
```

