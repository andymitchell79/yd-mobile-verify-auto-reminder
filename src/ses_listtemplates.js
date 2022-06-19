if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
  console.log("DEBUG MODE");
}

var AWS = require("aws-sdk");

const region = process.env.AWS_DEFAULT_REGION;
const identityPoolId = process.env.AWS_COGNITO_IDPOOL_ID;

console.log("Region: " + region);
console.log("IdentityPoolId: " + identityPoolId);

AWS.config.update({
  region: region,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  })
});

console.log("AWS Configured!");

// Create the promise and SES service object
var templatePromise = new AWS.SES({ apiVersion: "2010-12-01" })
  .listTemplates({ MaxItems: 10 })
  .promise();

// Handle promise's fulfilled/rejected states
templatePromise
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.error(err, err.stack);
  });
