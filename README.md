# Tokens as a service

This application provides an abstraction to do some basic things with tokens.

## Features
This application provides the ability to do the following things.

### Registration and login

Before doing anything you need an api key.

Make a post request to `/auth/register` and provide a username and password as follows:
```json
{
	"username" : "username you want",
	"password" : "password you want"
}
```

Next login by sending a post request to `/auth/login` and provide the username and password used to register, in the same way as for registering.

The server should respond with something like : 

```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2MjgwMTM2MjYsImV4cCI6MTY2NDAxMzYyNn0.Iq3ByrSiIv1CT-Ypx0fHKVMBWQdvFTMOqdfdfIBoMIU"
}
```

This token should be used when making request by adding it to the Authorization header as follows : `Authorization : Bearer YOUR_TOKEN`

### Issue new tokens

By making a `post` request to the `/tokens/new` endpoint, a new token can be created.
the following should be provided in the request body:
```json
{
	"tokenId" : "token identifier"
	"amount" : "initial amount to mint"
}
```

### minting new tokens

After a token has been created more can be minted by making a post request to the `/token/mint` endpoint.
the following should be provided in the request body:
```json
{
	"tokenId" : "token identifier"
	"amount" : "amount to mint"
}
```

### Paying accounts with created tokesns

After creating tokens, they can be used to pay/reward users.

This can be done in two ways. 

First, users can be paid by making post request to the `/token/paywithclaimable` endpoint. In this case, a claimable balance will be created instead of just using a payment operation. This can be usefull for when users don't allready have a trustline to the asset.

Second, if users allready have a trustline to the asset they can be paid with a payment operation by making a post request to the `/token/pay` endpoint.
In both cases, following should be provided in the request body:
```json
{
	"tokenId" : "test",
	"recipients": 
	[
		{
		 "address":"address to pay",
		 "amount" : "10" 
		}
	]
}
```
One request can be used to multiple users by adding more objects in the recipients array.