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

let htmlDetail = "";
let textDetail = "";

htmlDetail += "<div style=\"margin:0 auto; font-family:'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, 'sans-serif'\">";
htmlDetail += "<table width=\"320\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">"
htmlDetail += "<thead><tr>";
htmlDetail += "<th colspan=\"2\" style=\"background-color:#114b79; color:white; font-weight: normal; padding: 25;\" valign=\"bottom\">";
htmlDetail += "<table width=\"300px\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\"><tr>";
htmlDetail += "<td width=\"100%\" style=\"padding:5px\" align=\"center\"><img src=\"https://yardaroo.com/wp-content/uploads/2019/02/logo-500x500.png\" width=\"25%\" /></td>";
htmlDetail += "</tr><tr><td width=\"100%\" align=\"center\" style=\"color:whitesmoke\">Hi, {{firstname}}</td></tr>";
htmlDetail += "</table></th></tr></thead>";
htmlDetail += "<tbody style=\"color:gray; background:#114b79;\"><tr>";
htmlDetail += "<td valign=\"top\" align=\"center\"><p style=\"color:whitesmoke\">Your friend, {{friendfirstname}}, just posted new activity on <a href=\"{{url}}\" style=\"color:orange; text-decoration: none; font-weight: bold\">Yardaroo</a>!</p><p style=\"color:whitesmoke\"><img width=\"100\" style=\"border-radius: 50%;\" src=\"{{friendimage}}\" alt=\"{{friendfirstname}}\" /><br /><span>@{{nickname}}</span></p><p style=\"color:whitesmoke\">Come see what they're up to! <a href=\"{{url}}\" style=\"color:orange; text-decoration: none; font-weight: bold\">Launch App</a></p></td>";
htmlDetail += "</tr><tr><td align=\"center\"><p style=\"color:whitesmoke\">#GetUpAndYardaroo</p></td></tr></tbody>";
htmlDetail += "<tfoot><tr><td colspan=\"2\" style=\"background-color:#114b79; color:white\" align=\"center\"><table><tr>";
htmlDetail += "<td><a href=\"https://play.google.com/store/apps/details?id=com.yardaroo.app\"><img src=\"https://yardaroo.com/wp-content/uploads/2019/07/kisspng-android-google-play-iphone-app-store-5afbf4c01f8a48.5443852915264616321292.png\" height=\"50px\" alt=\"Download the Yardaroo app on Google Play\" /></a></td>";
htmlDetail += "<td><a href=\"https://apps.apple.com/us/app/yardaroo/id1470465631\"><img src=\"https://yardaroo.com/wp-content/uploads/2019/07/kisspng-app-store-mobile-app-itunes-ios-znaČky-apple-história-a-súčasnosť-it-legend-5b6a5373d2bc92.0486683215336948358632.png\" height=\"50px\" alt=\"Download the Yardaroo app on the  App Store\" /></a></td>";
htmlDetail += "</tr></table></td></tr></tfoot></table></div>";

textDetail += "Your friend, {{friendfirstname}}, just posted new activity on Yardaroo!";
textDetail += "Find out what's new here: {{url}}";

// Create createTemplate params
var params = {
  Template: {
    TemplateName: "YardarooSocialActivityEmail-enUS" /* required */,
    SubjectPart: "Come see what your friends are doing on Yardaroo",
    HtmlPart: htmlDetail,
    TextPart: textDetail
  }
};

// Create the promise and SES service object
var templatePromise = new AWS.SES({ apiVersion: "2010-12-01" })
  .createTemplate(params)
  .promise();

// Handle promise's fulfilled/rejected states
templatePromise
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.error(err, err.stack);
  });
