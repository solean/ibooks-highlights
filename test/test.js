const ibooks = require('../index');
const fs = require('fs');

(async function main() {
  try {
    const annotations = await ibooks.getAnnotations();
    console.log(annotations);

    const fileName = 'export.json'
    fs.writeFileSync(fileName, JSON.stringify(annotations));
    console.log(`Annotations written in file: ${fileName}`);
  } catch(e) {
    if (e) {
      console.error(e);
    } else {
      console.log('Sorry, something went wrong...');
    }
  }
})();
