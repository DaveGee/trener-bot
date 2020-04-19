/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiTrenerBotApiGraphQLAPIIdOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIIDOUTPUT
var apiTrenerBotApiGraphQLAPIEndpointOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT
var authTrenerbot81ae6a93UserPoolId = process.env.AUTH_TRENERBOT81AE6A93_USERPOOLID

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const AWSAppSyncClient = require('aws-appsync').default
const graphqlQuery = require('./graphql.js').mutation
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
  }
)

const mutation = gql(graphqlQuery)

exports.handler = async (event) => {
  if (!event || !event.arguments || !event.arguments.userId)
    throw new Error('No owner specified for updateCardStats')

  const userId = event.arguments.userId
  const card = event.arguments.card

  try {

    const variables = {
      card
    }
  
    const client = await appsyncClient.hydrated()
    const result = await client.mutate({ mutation, variables })

    console.log('result', result)
    
    return { 
      updatedCard: card
    }

  } catch (error) {
    console.log(error)
    throw error
  }
}
