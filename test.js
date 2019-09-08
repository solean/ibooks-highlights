const ibooks = require('./index');

(async function main() {
  try {
    const annotations = await ibooks.getAnnotations();
    console.log(annotations);
  } catch(e) {
    if (e) {
      console.error(e);
    } else {
      console.log('Sorry, something went wrong...');
    }
  }
})();
