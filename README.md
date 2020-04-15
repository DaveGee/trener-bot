# TenerBot

The drill sergeant to help you learn your polish vocabulary!

## Web app commands

* `npm start` - runs the app in dev mode on [http://localhost:3000](http://localhost:3000)
* `npm test` - runs tests
* `npm run build` - builds for production in the `build` folder

## Amplify commands

* `amplify status` - what's up with the current state
* `amplify mock` - to start mocking (see below there's some tricks)
* `amplify push` - to push in dev
* `amplify function build` builds all functions currently in the project
* `amplify function invoke <?askQuestion>` enables you to test a function locally

## Functions

* [sendChallengeToUser](./amplify/backend/function/sendChallengeToUser/README.md)

## GraphQL stuff

To have mutations and queries linked to `@functions`, you need to put them in `Query` and `Mutation` types...

To test a `@function` with localhost:20002 :

```graphql
mutation test {
  askQuestion(card: {
    question: "test"
    answer: "answer"
    owner: "ownerrrr"
    id: "2342342"
  })
}
```

---

## Mock stuff (with tricks)

### The Cognito access from the lambda

* To be able to run `amplify mock`, you need to setup `function-parameters.json` with the paramters you're expecting in the lambda
  * If the lambda has access to a cognito user pool, it won't be mocked. You need to give it the right to the real AWS user pool (it's in the form `us-east-1_xxxxxxx`)
  * `function-parameters.json` is not automatically reloaded : you need to restart `amplify mock`

Example of a `function-parameters.json` :

```json
{ 
  "authtrenerbot81ae6a93UserPoolId": "us-east-1_xxxxxx",
  "apitrenerBotApiGraphQLAPIIdOutput": "apitrenerBotApiGraphQLAPIIdOutput",
  "apitrenerBotApiGraphQLAPIEndpointOutput": "apitrenerBotApiGraphQLAPIEndpointOutput"
}
```

## Default values in the database

* found in VTL templates how to setup defaults values in template
* However, how to set a computed value on update is more complex (wrongness = (wrong - correct) / showed) --> there's no access to other properties on update apparently
* Will do the computation in the client, with some risk of missing some items

## Multiple auth, and graphql from another lambda

* Need to add @auth private with both cognito and iam
* lambda connects with IAM, gets SECRETS when it has the right permissions
* super helpful: https://medium.com/@jan.hesters/how-to-use-aws-appsync-in-lambda-functions-e593a9cef1d5
* add all 4 update, read, create, delete to get access to your API from your lambda