const https = require('https');

const urls = [
  'https://sign-kit-api.herokuapp.com/videos/all-videos',
  'https://sign-kit-api.herokuapp.com/sign-kit/videos/all-videos'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`URL: ${url} - Status: ${res.statusCode}`);
    res.resume(); // consume response data to free up memory
  }).on('error', (e) => {
    console.error(`URL: ${url} - Error: ${e.message}`);
  });
});