const https = require('https');

https.get('https://silent-talk-api.herokuapp.com/', (res) => {
  console.log(`Status: ${res.statusCode}`);
}).on('error', (e) => {
  console.error(e.message);
});