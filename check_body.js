const https = require('https');

https.get('https://sign-kit-api.herokuapp.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data.substring(0, 200)); // Print first 200 chars
  });
}).on('error', (e) => {
  console.error(e);
});