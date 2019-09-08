const os = require('os');
const sqlite3 = require('sqlite3').verbose();

const homedir = os.homedir();
// TODO: find these files automatically?
const BOOKS_DB_PATH = homedir + '/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite';
const ANNOTATION_DB_PATH = homedir + '/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite';


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

function formatBook(rawTableData) {
  return {
    title: rawTableData.ZTITLE,
    author: rawTableData.ZAUTHOR,
    filePath: rawTableData.ZPATH
  };
}

function formatAnnotation(rawTableData, bookData) {
  if (rawTableData && (rawTableData.ZANNOTATIONREPRESENTATIVETEXT || rawTableData.ZANNOTATIONSELECTEDTEXT)) {
    return {
      representativeText: rawTableData.ZANNOTATIONREPRESENTATIVETEXT,
      selectedText: rawTableData.ZANNOTATIONSELECTEDTEXT,
      bookId: rawTableData.ZANNOTATIONASSETID
    };
  }
}

function getBooks(dbPath) {
  const book_db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, handleConnect);
  return new Promise((resolve, reject) => {
    let books = {};

    book_db.all('SELECT * from ZBKLIBRARYASSET', (err, bookRows) => {
      if (err) {
        reject(err);
      } else {
        bookRows.forEach(row => {
          books[row.ZASSETID] = formatBook(row);
        });

        resolve(books);
      }

      book_db.close(handleClose);
    });
  });
}

function getAnnotations(dbPath) {
  const ann_db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, handleConnect);
  return new Promise((resolve, reject) => {
    ann_db.all('SELECT zannotationassetid, zannotationrepresentativetext, zannotationselectedtext FROM zaeannotation', (err, annRows) => {
      if (err) {
        reject(err);
      } else {
        let annotations = annRows.map(formatAnnotation);
        // TODO: removing nulls... is this slow?
        annotations = annotations.filter(ann => !!ann);
        resolve(annotations);
      }

      ann_db.close(handleClose);
    });
  });
}


(async function main() {
  try {
    const books = await getBooks(BOOKS_DB_PATH);
    console.log(books);
    const annotations = await getAnnotations(ANNOTATION_DB_PATH, books);
    console.log(annotations);

  } catch(e) {
    if (e && e.message) {
      console.error(e.message);
    } else {
      console.log('Sorry, something went wrong...');
    }
  }
})();
