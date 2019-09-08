const fs = require('fs');
const glob = require('glob');


function findFiles(startPath, filter) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(startPath)) {
      reject('Path not found: ' + startPath);
      return;
    }

    glob(startPath + filter, {}, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      if (!files || !files.length) {
        reject('No such file found...');
        return;
      }

      resolve(files[0]);
    });
  });
}

function handleConnect(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Successfully connected to db...');
}

function handleClose(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed db connection.');
}


module.exports = {
  findFiles,
  handleConnect,
  handleClose
};
