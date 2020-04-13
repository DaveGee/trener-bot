const aws = require('../../amplify/backend/function/sendChallengeToUser/src/node_modules/aws-sdk')
let { handler, cardSelector } = require('../../amplify/backend/function/getNextChallenge/src/index')

describe('GetNextChallenge should', () => {
  test.todo('throw an error if no user was specified')
  test.todo('work without a cognito identity')
  test.todo('throw an error if user is not the same as the identity')
  test.todo('throw an error if this user has no card')
  test.todo('return the best card')
})

describe('Card selector algorithm should', () => {
  test.todo('throw an error if there is no card available')
  test.todo('always return a card if there is at least one')
  test.todo('return the appropriate card given the set')
})