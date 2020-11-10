var unirest = require("unirest");
function sendSMS(mobile){
  msg="This is user verification SMS"
  var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");

req.query({
  "authorization": "PRvhNA7qTk5E4ZCD8icoHlUWIMgu3zYenVtaGwr0pSKFXOJdQ19YoPF3TDndz5RVtf2yXGOKCsrwhQZv",
  "sender_id": "FSTSMS",
  "message": msg,
  "language": "english",
  "route": "p",
  "numbers": mobile,
});

req.headers({
  "cache-control": "no-cache"
});

req.end(function (res) {
  if (res.error) throw new Error(res.error);
  console.log(res.body);
});
}
module.exports = sendSMS 