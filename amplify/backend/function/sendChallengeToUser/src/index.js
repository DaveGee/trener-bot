
/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiTrenerBotApiGraphQLAPIIdOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIIDOUTPUT
var apiTrenerBotApiGraphQLAPIEndpointOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT
var authTrenerbot81ae6a93UserPoolId = process.env.AUTH_TRENERBOT81AE6A93_USERPOOLID

Amplify Params - DO NOT EDIT */

/**
 * event.typeName: name of the Type (e.g Mutation)
 * event.fieldName: name of the function (e.g. askQuestion)
 * event.identity: data about the identy (see below)
 * event.arguments: arguments passed to the function (from the GraphQL Mutation type)
 *   if it's an input type, it's nested : { card: { ... } } 
 * 
 * identity {
 *    username: id of the user (same as .sub) or email
 *   'cognito:username'
 *   email
 *   phone_number
 *   claims: {}
 * }
 * 
 * A cognito user found :
 * { Username: '8f2013b6-8eda-4024-8e58-23be161ca74a',
  Attributes:
   [ { Name: 'sub', Value: '8f2013b6-8eda-4024-8e58-23be161ca74a' },
     { Name: 'email_verified', Value: 'true' },
     { Name: 'name', Value: 'David' },
     { Name: 'email', Value: 'david.geretti@gmail.com' } ],
  UserCreateDate: 2020-02-08T20:21:01.241Z,
  UserLastModifiedDate: 2020-02-08T20:21:39.543Z,
  Enabled: true,
  UserStatus: 'CONFIRMED' }
 */

const region = process.env.REGION

const aws = require('aws-sdk')

const getEmailFromCognito = async userId => {
  const cognito = new aws.CognitoIdentityServiceProvider({ region })

  const listUsersResponse = await cognito
    .listUsers({
      UserPoolId: process.env.AUTH_TRENERBOT81AE6A93_USERPOOLID,
      Filter: `sub = "${userId}"`,
      Limit: 1,
    })
    .promise()
  const user = listUsersResponse.Users[0]
  console.log('Found user: ', user)

  const emailAttr = user.Attributes.find(a => a.Name === 'email')
  if (!emailAttr) {
    throw new Error('No destination email found in Cognito')
  } 
  return emailAttr.Value
}

const sendEmailTo = async (destEmail, card) => {
  const ses = new aws.SES({ region })

  const params = {
    Destination: {
      ToAddresses: [destEmail]
    },
    Message: {
      Body: {
        Text: { Data: `
          Question: ${card.question}
          Answer: ${card.answer}
        ` }
      },
      Subject: { Data: "Your next challenge!" }
    },
    Source: "david.geretti@gmail.com"
  }

  await ses.sendEmail(params).promise()
}

exports.sendEmailTo = sendEmailTo
exports.getEmailFromCognito = getEmailFromCognito

exports.handler = async (event) => {
  let userId
  if (!event.arguments || !event.arguments.userId) {
    throw new Error('No userId specified')
  }
  userId = event.arguments.userId

  let identityUserId 
  if (event.identity) {
    identityUserId = event.identity.sub
    console.log('Found userId in identity: ', identityUserId)
  }
  
  if (identityUserId && identityUserId !== event.arguments.userId) {
    throw new Error('userId and provided identity do not match. Unauthorized')
  }

  const destEmail = await getEmailFromCognito(userId)

  await sendEmailTo(destEmail, event.arguments.card)
  
  return true
}