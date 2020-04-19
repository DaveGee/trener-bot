
process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT = 'https://localhost/graphql'
process.env.REGION = 'us-east-1'

const aws = require('../../amplify/backend/function/sendChallengeToUser/src/node_modules/aws-sdk')
const getNextChallenge = require('../../amplify/backend/function/getNextChallenge/src/index')

const { set1, set2, set3 } = require('../__mocks__/cardset')

describe('GetNextChallenge should', () => {

  const user1 = 'user1'
  const getCardsMock = jest.spyOn(getNextChallenge, 'getCards')
  const argumentWithUser = {
    arguments: { userId: user1 }
  }
  const noCardResult = { card: null }

  test('throw an error if called without specifying the owner', async () => {
    expect.assertions(1)
    try {
      await getNextChallenge.handler()
    } catch (e) {
      expect(e).toEqual(new Error('No owner specified for getNextChallenge'))
    }
  })

  test('get cards of the user, with a practice date up to tomorrow', async () => {
    getCardsMock.mockImplementation(() => set1.mockResult)

    const result = await getNextChallenge.handler(argumentWithUser)

    expect(getCardsMock).toHaveBeenCalledWith('user1')
    expect(result.card).toBe(set1.nextChallenge)
  })
  
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

})