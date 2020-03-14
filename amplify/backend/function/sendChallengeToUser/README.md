# sendChallengeToUser

## SES policy

Added this policy to `sendChallengeToUser-cloudformation-template.json`

```
"lambdaexecutionpolicy": {
    ...
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        },
        ...(logs)
```