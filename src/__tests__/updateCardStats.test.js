
process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT = 'https://localhost/graphql'
process.env.REGION = 'us-east-1'

const aws = require('../../amplify/backend/function/updateCardStats/src/node_modules/aws-sdk')
const AWSAppSyncClient = require('../../amplify/backend/function/updateCardStats/src/node_modules/aws-appsync').default
const updateCardStats = require('../../amplify/backend/function/updateCardStats/src/index')
const appsyncMock = require('../__mocks__/aws-appsync.js')

jest.mock('../../amplify/backend/function/updateCardStats/src/node_modules/aws-appsync', () => require('../__mocks__/aws-appsync.js'))

describe('updateCardStats should', () => {

  const user1 = 'user1'
  const argumentWithUser = {
    arguments: { userId: user1 }
  }

  test('throw an error if called without specifying the owner', async () => {
    expect.assertions(1)
    try {
      await updateCardStats.handler()
    } catch (e) {
      expect(e).toEqual(new Error('No owner specified for updateCardStats'))
    }
  })

  test('mutate the card in input', async () => {
    const cardMock = {
      id: '10974f4b-6110-4b74-918c-ef4531955a9c',
      question: 'x',
      answer: 'y',
      createdAt: '2020-04-15T20:38:40.042Z',
      owner: '8f2013b6-8eda-4024-8e58-23be161ca74a',
      showed: 2,
      correct: 0,
      wrong: 0,
      repetitions: 0,
      interval: 1,
      easiness: 2.5,
      nextPractice: '2020-04-16T20:38:40.042Z',
      __typename: 'Card'
    }

    const resultMock = {
      data: {
        updateCard: cardMock
      }
    }
    appsyncMock.__setResults(resultMock)
    const fn = appsyncMock.__getMutateFn()

    const result = await updateCardStats.handler(argumentWithUser)

    expect(result).toEqual({
      updatedCard: cardMock
    })
    expect(fn).toHaveBeenCalled()
  })

  test.todo('updates super memo parameters')
})