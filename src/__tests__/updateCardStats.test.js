
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
  const mutateResultMock = {
    data: {
      updateCard: cardMock
    }
  }
  let mutationFunc

  afterEach(() => {    
    jest.clearAllMocks()
  })

  beforeEach(() => {
    appsyncMock.__setResults(mutateResultMock)
    mutationFunc = appsyncMock.__getMutateFn()
  })

  test('throw an error if called without specifying the owner', async () => {
    expect.assertions(1)
    try {
      await updateCardStats.handler()
    } catch (e) {
      expect(e).toEqual(new Error('No owner specified for updateCardStats'))
    }
  })

  test('throw if no new stat is provided in input', async () => {
    expect.assertions(1)
    try {
      await updateCardStats.handler(argumentWithUser)
    } catch (e) {
      expect(e).toEqual(new Error('No stat input provided to updateCardStats'))
    }
  })

  test('mutate card with provided id', async () => {
    const cardMutator = {
      id: cardMock.id
    }
    const result = await updateCardStats.handler({ 
      arguments: {
        card: cardMutator,
        userId: user1
      }
    })

    expect(result).toEqual({
      updatedCard: cardMock
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: cardMutator
      }
    })
  })

  test('mutate all stats when they are provided', async () => {
    const cardMutator = cardMock
    await updateCardStats.handler({ 
      arguments: {
        card: cardMutator,
        userId: user1
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: cardMock.id,
          showed: cardMock.showed,
          correct: cardMock.correct,
          wrong: cardMock.wrong
        }
      }
    })
  })

  test('mutate only stats', async () => {
    const cardMutator = cardMock
    await updateCardStats.handler({ 
      arguments: {
        card: cardMutator,
        userId: user1
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: cardMock.id,
          showed: cardMock.showed,
          correct: cardMock.correct,
          wrong: cardMock.wrong
        }
      }
    })
  })

  test('not update superMemo values when quality is invalid', async () => {
    const cardMutator = cardMock
    await updateCardStats.handler({ 
      arguments: {
        card: cardMutator,
        userId: user1,
        quality: []
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: cardMock.id,
          showed: cardMock.showed,
          correct: cardMock.correct,
          wrong: cardMock.wrong
        }
      }
    })
  })

  test('not mutate if "showed" stats are not a valid number', async () => {
    const invalidCardMutator = {
      id: cardMock.id,
      showed: 'not valid',
    }
    await updateCardStats.handler({ 
      arguments: {
        card: invalidCardMutator,
        userId: user1
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: invalidCardMutator.id
        }
      }
    })
  })

  test('not mutate if "correct" stats are not a valid number', async () => {
    const invalidCardMutator = {
      id: cardMock.id,
      correct: [],
      wrong: 1,
    }
    await updateCardStats.handler({ 
      arguments: {
        card: invalidCardMutator,
        userId: user1
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: invalidCardMutator.id,
          wrong: 1,
        }
      }
    })
  })

  test('not mutate if "wrong" stats are not a valid number', async () => {
    const invalidCardMutator = {
      id: cardMock.id,
      wrong: {},
    }
    await updateCardStats.handler({ 
      arguments: {
        card: invalidCardMutator,
        userId: user1
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: invalidCardMutator.id
        }
      }
    })
  })

  test('has default superMemo values if passed quality', async () => {
    const cardMutator = {
      id: cardMock.id
    }
    await updateCardStats.handler({ 
      arguments: {
        card: cardMutator,
        userId: user1,
        quality: 0
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: cardMock.id,
          easiness: expect.any(Number),
          repetitions: expect.any(Number),
          interval: expect.any(Number),
          nextPractice: expect.any(String)
        }
      }
    })
  })

  test('updates super memo parameters when passed quality of assesment', async () => {
    const cardMutator = {
      ...cardMock,
      easiness: 2.6,
      repetitions: 1,
      interval: 1
    }
    await updateCardStats.handler({ 
      arguments: {
        card: cardMutator,
        userId: user1,
        quality: 5
      }
    })
    
    expect(mutationFunc).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        card: {
          id: cardMock.id,
          showed: cardMock.showed,
          wrong: cardMock.wrong,
          correct: cardMock.correct,
          easiness: 2.7,
          repetitions: 2,
          interval: 6,
          nextPractice: expect.any(String)
        }
      }
    })
  })

  test('throw when quality is out of the 0..5 range', async () => {
    expect.assertions(1)

    const card = {
      id: cardMock.id
    }

    try {
      await updateCardStats.handler({
        arguments: {
          card,
          userId: user1,
          quality: 10
        }
      })
    } catch (e) {
      expect(e).toEqual(new Error('Incorrect "quality", should be within 0..5'))
    }
  })
})