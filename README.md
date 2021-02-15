# Cryptocurrency Monitor API with Node.js

Wrapper of CoinGecko (https://www.coingecko.com/en/api) API REST.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites

What things you need to install the software and how to install them

* Download [Node](https://nodejs.org/en/) and npm
* `npm install` to install all our node dependencies
* Download and install MongoDB for local use

**You can create use a mongodb server at mongodb Atlas service for free. Create an account and follow the instructions**

* Change in /helpers/connections.js `db_path` variable.
* `const db_path = mongodb+srv://username>:<password>@cluster0.ncdk5.mongodb.net/<dbname>?retryWrites=true&w=majority`



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

Provide name of Account to be created. All fields required. Currency could be `ars`, `usd`, `eur`.

```json
{
    "firstName": "User",
    "lastName": "UserLast",
    "username": "myusername",
    "password": "mypassword",
    "currency": "ars | usd | eur"
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


# Login to Account

Login user endpoint

**URL** : `/api/users/login`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

Provide username and password to login. All fields required.

```json
{
        "username": "xxxxx",
        "password": "xxxx",
}
```

## Success Response

**Condition** : If Account exists and Authorized User has required permissions.

**Code** : `200 OK`

**Content example**

```json
{
    "data": {
        "token": <token_data>
    }
}
```

## Error Responses

**Condition** : If Account exists but Authorized User does not have required
permissions.

**Code** : `403 FORBIDDEN`

**Content** :

```json
{
    "error": "User login fail"
}
```

# Show Single Account

Show a single Account if current User has access permissions to it.

**URL** : `/api/users/:username`

**URL Parameters** : `username=[string]` where `username` is the username of the Account on the
server.

**Method** : `GET`

**Auth required** : YES

**Permissions required** :

User is at least one of the following in relation to the Account requested:

* Header: Authorization Bearer <token_data>

**Data**: `{}`

## Success Response

**Condition** : If Account exists and Authorized User has required permissions.

**Code** : `200 OK`

**Content example**

```json
{
    "data": {
        "currency": "ars",
        "_id": "602adc95f17a544b287147e7",
        "username": "xxxxxxxx",
        "password": "$2b$10$22mQh3dBX8dxssxs.rx2KmoxNd.U.WeYRy1jeuaqop4lRxene4mfTWR9Yq",
        "createdAt": "2021-02-15T20:41:57.074Z",
        "updatedAt": "2021-02-15T20:41:57.074Z",
        "__v": 0
    }
}
```

## Error Responses

**Condition** : If Account does not exist with `username` of provided `username` parameter.

**Code** : `400 NOT FOUND`

**Content** : `
{
    "error": "User not found"
}`

### Or

**Condition** : If Account exists but Authorized User does not have required
permissions or valid token. 

**Code** : `403 FORBIDDEN`

**Content** :

```json
{
    "error": "invalid signature"
}
```

# Add cryptocurrencies to User's Account

Add a cryptocurrency to the user account. The coins are unique

**URL** : `/api/users/register`

**Method** : `POST`

**Auth required** : YES

**Permissions required** :

User is at least one of the following in relation to the Account requested:

* Header: Authorization Bearer <token_data>

**Data constraints**

Provide name of Account to be created. All fields required.

```json
{
    "crypto": "0chain",
    "symbol": "zcn",
    "name": "0chain"
}
```

## Success Response

**Condition** : If everything is OK and a new currency is added to users account

**Code** : `200 CREATED`

**Content example**

```json
{
    "data": {
        "currency": "ars",
        "_id": "602adc95f17a544b287147e7",
        "username": "usernamexxxxx",
        "password": "$2b$10$22mQh3dBX8d.rx2KmoxNd.U.WeYRy1jeuaqop4lRxene4mfTWR9Yq",
        "createdAt": "2021-02-15T20:41:57.074Z",
        "updatedAt": "2021-02-15T20:41:57.074Z",
        "__v": 0
    }
}
```

## Error Responses

**Condition** : If currency already exists for User.

**Code** : `400 BAD REQUEST`

**Content** : 
`{
    "error": "Crypto already exists"
}
`

### Or

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "error": "\"[field]\" is required"
}
```

# Show user top N crypto currencies

It must be possible to obtain the top N of cryptocurrencies of a user

**URL** : `/api/coins/topN/:username`

**URL Parameters (optional) :**
`username=[string]` where `username` is the username of the Account on the server.
`n=[number]` where `n` is the amount of cryptocurrencies to show.
`desc=[boolean]` where `desc` true/false to order data depending on users default currency. Descending by default.

**Method** : `GET`

**Auth required** : YES

**Permissions required** :

User is at least one of the following in relation to the Account requested:

* Header: Authorization Bearer <token_data>

**Data**: `{}`

## Success Response

**Condition** : If user has coins added to its account it will sort descendent by default on currency defined.

**Code** : `200 OK`

**Content example**

```json
[
    {
        "symbol": "zcn",
        "name": "0chain",
        "image": {
            "thumb": "https://assets.coingecko.com/coins/images/4934/thumb/0_Black-svg.png?1600757954",
            "small": "https://assets.coingecko.com/coins/images/4934/small/0_Black-svg.png?1600757954",
            "large": "https://assets.coingecko.com/coins/images/4934/large/0_Black-svg.png?1600757954"
        },
        "last_updated": "2021-02-15T22:14:16.442Z",
        "currency": {
            "ars": 58.36,
            "usd": 0.659741,
            "eur": 0.543878
        }
    },
    ...
]
```

## Error Responses

**Condition** : If Account does not exist with `username` of provided `username` parameter.

**Code** : `400 NOT FOUND`

**Content** : `
{
    "error": "User not found"
}`

### Or

**Condition** : If Account exists but Authorized User does not have required
permissions or valid token. 

**Code** : `403 FORBIDDEN`

**Content** :

```json
{
    "error": "invalid signature"
}
```

