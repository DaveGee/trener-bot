
process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT = 'https://localhost/graphql'
process.env.FUNCTION_SENDCHALLENGETOUSER_NAME = 'sendChallengeToUserLambda'
process.env.FUNCTION_UPDATECARDSTATS_NAME = 'updateCardStatsLambda'
process.env.REGION = 'us-east-1'

const aws = require('../../amplify/backend/function/getNextChallenge/src/node_modules/aws-sdk')
const getNextChallenge = require('../../amplify/backend/function/getNextChallenge/src/index')

const { set1, set2, set3 } = require('../__mocks__/cardset')

describe('GetNextChallenge should', () => {

  const user1 = 'user1'
  const getCardsMock = jest.spyOn(getNextChallenge, 'getCards')
  const argumentWithUser = {
    arguments: { userId: user1 }
  }
  const noCardResult = { card: null }
  let lambdaInvoke

  const mockLambdaInvokeAsync = () => {
    const invokeAsync = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })
    aws.Lambda = jest.fn().mockImplementation(() => ({
      invokeAsync
    }))
    return invokeAsync
  }

  beforeEach(() => {
    lambdaInvoke = mockLambdaInvokeAsync()
  })

  test('throw an error if called without specifying the owner', async () => {
    expect.assertions(1)
    try {
      await getNextChallenge.handler()
    } catch (e) {
      expect(e).toEqual(new Error('No owner specified for getNextChallenge'))
    }
  })

  test('get cards of the user', async () => {
    getCardsMock.mockImplementation(() => set1.mockResult)

    const result = await getNextChallenge.handler(argumentWithUser)

    expect(getCardsMock).toHaveBeenCalledWith('user1')
    expect(result.card).toBe(set1.nextChallenge)
  })

  // will need mocking of client.query!
  test.todo('get cards of the user, passing today as the limit')
  
  test('return no card, but logs something if there is no card available', async () => {
    getCardsMock.mockImplementation(() => null)
    console.log = jest.fn()
    
    let result = await getNextChallenge.handler(argumentWithUser)
    
    expect(console.log).toHaveBeenCalledWith(`User ${user1} has no card in deck, or all cards are sufficiently trained`)
    expect(result).toEqual(noCardResult)
    
    getCardsMock.mockImplementation(() => ({ cardsByOldestPractice: { items: [] } }))
    console.log = jest.fn()
    
    result = await getNextChallenge.handler(argumentWithUser)
    
    expect(console.log).toHaveBeenCalledWith(`User ${user1} has no card in deck, or all cards are sufficiently trained`)
    expect(result).toEqual(noCardResult)
  })

  test('get the card with the oldest practice date', async () => {
    getCardsMock.mockImplementation(() => set2.mockResult)

    const result = await getNextChallenge.handler(argumentWithUser)

    expect(result.card).toEqual(set2.nextChallenge)
  })

  test('return the card with maximum wrongness, given multiple result for oldest practice date', async () => {
    getCardsMock.mockImplementation(() => set3.mockResult)

    const result = await getNextChallenge.handler(argumentWithUser)

    expect(result.card).toEqual(set3.nextChallenge)
  })

  test('send next challenge to the user, asynchronously', async () => {
    getCardsMock.mockImplementation(() => set1.mockResult)

    await getNextChallenge.handler(argumentWithUser)

    const expectedArguments = {
      FunctionName: process.env.FUNCTION_SENDCHALLENGETOUSER_NAME,
      InvokeArgs: JSON.stringify({
        arguments: {
          userId: user1,
          card: set1.nextChallenge
        }
      })
    }

    expect(lambdaInvoke).toHaveBeenCalledWith(expectedArguments)
  })

  test('only send challenges when a card is returned', async () => {
    getCardsMock.mockImplementation(() => null)
    console.log = jest.fn()

    await getNextChallenge.handler(argumentWithUser)

    const expectedArguments = {
      FunctionName: process.env.FUNCTION_SENDCHALLENGETOUSER_NAME,
      InvokeArgs: JSON.stringify({
        userId: user1,
        card: set1.nextChallenge
      })
    }

    expect(lambdaInvoke).not.toHaveBeenCalled()
  })

  test('update the showed statistic, asynchronously', async () => {
    getCardsMock.mockImplementation(() => set1.mockResult)

    await getNextChallenge.handler(argumentWithUser)

    const expectedArguments = {
      FunctionName: process.env.FUNCTION_UPDATECARDSTATS_NAME,
      InvokeArgs: JSON.stringify({
        arguments: {
          userId: user1,
          card: set1.nextChallenge,
          showed: set1.nextChallenge.showed + 1
        }
      })
    }

    expect(lambdaInvoke).toHaveBeenNthCalledWith(2, expectedArguments)
  })

})  