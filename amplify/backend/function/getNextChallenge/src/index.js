/* Amplify Params - DO NOT EDIT
	API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_TRENERBOTAPI_GRAPHQLAPIIDOUTPUT
	AUTH_TRENERBOT81AE6A93_USERPOOLID
	ENV
	FUNCTION_SENDCHALLENGETOUSER_NAME
	FUNCTION_UPDATECARDSTATS_NAME
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiTrenerBotApiGraphQLAPIIdOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIIDOUTPUT
var apiTrenerBotApiGraphQLAPIEndpointOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT
var authTrenerbot81ae6a93UserPoolId = process.env.AUTH_TRENERBOT81AE6A93_USERPOOLID
var functionSendChallengeToUserName = process.env.FUNCTION_SENDCHALLENGETOUSER_NAME

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const AWSAppSyncClient = require('aws-appsync').default
const graphqlQuery = require('./graphql.js').query
const gql = require('graphql-tag')
require('es6-promise').polyfill()
require('isomorphic-fetch')

const { DateTime } = require('luxon')

const url = process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT
const region = process.env.REGION
const sendToUserLambda = process.env.FUNCTION_SENDCHALLENGETOUSER_NAME
const updateStatsLambda = process.env.FUNCTION_UPDATECARDSTATS_NAME

AWS.config.update({
  region,
  credentials: new AWS.Credentials(
    process.env.AWS_ACCESS_KEY_ID,
    process.env.AWS_SECRET_ACCESS_KEY,
    process.env.AWS_SESSION_TOKEN
  ),
})
const credentials = AWS.config.credentials

const appsyncClient = new AWSAppSyncClient(
  {
    url,
    region,
    auth: {
      type: 'AWS_IAM',
      credentials,
    },
    disableOffline: true,
  },
  {
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  }
)

const query = gql(graphqlQuery)

const getCards = async (owner, maxDate) => {
  const variables = {
    owner,
    nextPracticeBefore: maxDate || new Date().toISOString()
  }

  const client = await appsyncClient.hydrated()
  return await client.query({ query, variables })
}

const wronger = (card1, card2) =>
  (card1.wrong - card1.correct) / card1.showed >
  (card2.wrong - card2.correct) / card2.showed ?
    card1 : card2

const nextChallengeReducer = (nextChallenge, card) => {
  const cardNextPracticeTime = DateTime.fromISO(card.nextPractice)
  const selectedChallengeTime = DateTime.fromISO(nextChallenge.nextPractice)
  
  if (!cardNextPracticeTime.isValid || selectedChallengeTime < cardNextPracticeTime)
    return nextChallenge
  else if (+selectedChallengeTime === +cardNextPracticeTime)
    return wronger(nextChallenge, card)
  else
    return card
}

const sendCardToUser = async (userId, card) => {
  const senderEvent = {
    FunctionName: sendToUserLambda,
    InvokeArgs: JSON.stringify({
      arguments: {
        userId,
        card
      }
    })
  }
  const lambda = new AWS.Lambda()
  await lambda.invokeAsync(senderEvent).promise()
}

const updateShowedStat = async (userId, card) => {
  const senderEvent = {
    FunctionName: updateStatsLambda,
    InvokeArgs: JSON.stringify({
      arguments: {
        userId,
        card: {
          ...card,
          showed: (card.showed || 0) + 1
        },
      }
    })
  }
  const lambda = new AWS.Lambda()
  await lambda.invokeAsync(senderEvent).promise()
}

const handler = async (event) => {
  if (!event || !event.arguments || !event.arguments.userId)
    throw new Error('No owner specified for getNextChallenge')

  const userId = event.arguments.userId

  try {

    const result = await exports.getCards(userId)
    let card = null
    if (!result
      || !result.data 
      || !result.data.cardsByOldestPractice 
      || !result.data.cardsByOldestPractice.items 
      || !result.data.cardsByOldestPractice.items.length) 
    {
      console.log(`User ${event.arguments.userId} has no card in deck, or all cards are sufficiently trained`)
      console.log('data returned: ', result)
    } else {
      card = result.data.cardsByOldestPractice.items.reduce(nextChallengeReducer)
      await sendCardToUser(userId, card)
      await updateShowedStat(userId, card)
    }

    return { 
      card 
    }

  } catch (error) {
    console.log(error)
    throw error
  }
}

exports.getCards = getCards
exports.handler = handler
