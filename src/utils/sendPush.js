const sendNotification = function (data, callback) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic NDg3ZDA1ZmUtODA5MC00ODdhLThjNmItYTUzM2MxYzJjMGMx"
  };

  const options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  const https = require('https');
  const req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log("Send push response:", JSON.parse(data));
      callback(null, JSON.parse(data))
    });
  });

  req.on('error', function (e) {
    console.log("ERROR:", e);
    callback(e, null)
  });

  req.write(JSON.stringify(data));
  req.end();
};

module.exports = sendNotification;