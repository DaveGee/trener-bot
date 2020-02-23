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