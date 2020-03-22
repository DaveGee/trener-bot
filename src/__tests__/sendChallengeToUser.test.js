const aws = require('../../amplify/backend/function/sendChallengeToUser/src/node_modules/aws-sdk')
let ChallengeSender = require('../../amplify/backend/function/sendChallengeToUser/src/index')

const USERATTR_WITH_EMAIL = {
  Name: 'email',
  Value: 'test@test.com'
}

function mockCognitoListUsers(...userAttr) {
  const listUsersPromise = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Users: [{
        Attributes: userAttr
      }]
    })
  })
  aws.CognitoIdentityServiceProvider = jest.fn().mockImplementation(() => ({
    listUsers: listUsersPromise
  }))
  return listUsersPromise
}

function mockSESSendEmail() {
  const sendSesEmailPromise = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue()
  })
  aws.SES = jest.fn().mockImplementation(() => ({
    sendEmail: sendSesEmailPromise
  }))
  return sendSesEmailPromise
}

describe('AWS utils should', () => {
  beforeEach(() => {
    console.log = jest.fn()
  })

  test('find the email in the Cognito user', async () => {    
    const userId = 'whatever'
    const listUserArgument = {
      UserPoolId: process.env.AUTH_TRENERBOT81AE6A93_USERPOOLID,
      Filter: `sub = "${userId}"`,
      Limit: 1,
    }

    const listUsersPromise = mockCognitoListUsers(USERATTR_WITH_EMAIL)
    
    const email = await ChallengeSender.getEmailFromCognito(userId)

    expect(listUsersPromise).toHaveBeenCalledWith(listUserArgument)
    expect(email).toBe(USERATTR_WITH_EMAIL.Value)
  })

  test('throw an exception is no email is found', async () => {
    const listUsersPromise = mockCognitoListUsers()
    
    expect.assertions(2)
    try {
      await ChallengeSender.getEmailFromCognito()
    } catch (e) {
      expect(e).toEqual(new Error('No destination email found in Cognito'))
      expect(listUsersPromise).toHaveBeenCalledTimes(1)
    }
  })

  test('allow to call the SES sendmail function', async () => {
    const destEmail = 'test@test.com'
    const card = { question: 'question', answer: 'answer' }
    const sendSesEmailPromise = mockSESSendEmail()

    await ChallengeSender.sendEmailTo(destEmail, card)

    expect(sendSesEmailPromise).toHaveBeenCalledTimes(1)
  })
})

describe('Sending challenge to a user should', () => {
  
  test('throw an error when no user is specified', async () => {
    const event = {}

    expect.assertions(1)
    try {
      await ChallengeSender.handler(event)
    } catch (e) {
      expect(e).toEqual(new Error('No userId specified'))
    }
  })

  test('throw an error when the userId and identity don\'t match', async () => {
    const USER_ID = '1'
    const event = {
      identity: {
        sub: USER_ID
      },
      arguments: {
        userId: '2'
      }
    }

    expect.assertions(1)
    try {
      await ChallengeSender.handler(event)
    } catch (e) {
      expect(e).toEqual(new Error('userId and provided identity do not match. Unauthorized'))
    }
  })

  test('work even without a Cognito identity known', async () => {
    const USER_ID = '1'
    const validEvent = {
      arguments: {
        userId: USER_ID,
        card: { question: 'question', answer: 'answer' }
      }
    }

    const listUsersPromise = mockCognitoListUsers(USERATTR_WITH_EMAIL)
    const sendSesEmailPromise = mockSESSendEmail()

    await ChallengeSender.handler(validEvent)

    expect(listUsersPromise).toHaveBeenCalledTimes(1)
    expect(sendSesEmailPromise).toHaveBeenCalledTimes(1)
    //expect(sendSesEmailPromise).toHaveBeenCalledWith()
  })

  test('send an email', async () => {
    const USER_ID = '1'
    const validEvent = {
      identity: {
        sub: USER_ID
      },
      arguments: {
        userId: USER_ID,
        card: { question: 'question', answer: 'answer' }
      }
    }

    const listUsersPromise = mockCognitoListUsers(USERATTR_WITH_EMAIL)
    const sendSesEmailPromise = mockSESSendEmail()

    await ChallengeSender.handler(validEvent)

    expect(listUsersPromise).toHaveBeenCalledTimes(1)
    expect(sendSesEmailPromise).toHaveBeenCalledTimes(1)
  })
})

