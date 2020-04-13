/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiTrenerBotApiGraphQLAPIIdOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIIDOUTPUT
var apiTrenerBotApiGraphQLAPIEndpointOutput = process.env.API_TRENERBOTAPI_GRAPHQLAPIENDPOINTOUTPUT
var authTrenerbot81ae6a93UserPoolId = process.env.AUTH_TRENERBOT81AE6A93_USERPOOLID
var functionSendChallengeToUserName = process.env.FUNCTION_SENDCHALLENGETOUSER_NAME

Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!')
    }
    return response
}
