# TenerBot

The drill sergeant to help you learn your polish vocabulary!

## Web app commands

* `npm start` - runs the app in dev mode on [http://localhost:3000](http://localhost:3000)
* `npm test` - runs tests
* `npm run build` - builds for production in the `build` folder

## Amplify commands

* `amplify status` - what's up with the current state
* `amplify function build` builds all functions currently in the project
* `amplify function invoke <?askQuestion>` enables you to test a function locally

## GraphQL stuff

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
