
/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {

    console.log('event', event)
    console.log('event.typeName', event.typeName)
    console.log('event.fieldName', event.fieldName)
    console.log('event.identity', event.identity)
    console.log('event.arguments', event.arguments)
    console.log('event.source', event.source)

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    }
    return true
}