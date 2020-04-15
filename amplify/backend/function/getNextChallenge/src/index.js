/* Amplify Params - DO NOT EDIT
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

const handler = async (event) => {
  if (!event || !event.arguments || !event.arguments.userId)
    throw new Error('No owner specified for getNextChallenge')

  try {

    const data = await exports.getCards(event.arguments.userId)
    let card = null
    if (!data 
      || !data.cardsByOldestPractice 
      || !data.cardsByOldestPractice.items 
      || !data.cardsByOldestPractice.items.length) 
    {
      console.log(`User ${event.arguments.userId} has no card in deck, or all cards are sufficiently trained`)
    } else {
      card = data.cardsByOldestPractice.items.reduce(nextChallengeReducer)
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