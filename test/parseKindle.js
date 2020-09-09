const fs = require('fs');
const readline = require('readline');

const filepath = 'short_kindle.txt';


const file = readline.createInterface({
  input: fs.createReadStream(filepath),
  output: process.stdout,
  terminal: false
});

file.on('line', line => {
  
});