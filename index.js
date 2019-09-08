const fs = require('fs');
const glob = require('glob');
const os = require('os');
const sqlite3 = require('sqlite3').verbose();

const homedir = os.homedir();
const BOOKS_START_PATH = homedir + '/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary';
const ANNOTATIONS_START_PATH = homedir + '/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation';


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

function findBooksDbPath() {
  return findFiles(BOOKS_START_PATH, '/**/*.sqlite');
}

function findAnnotationsDbPath() {
  return findFiles(ANNOTATIONS_START_PATH, '/**/*.sqlite');
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

function formatBook(rawTableData) {
  return {
    title: rawTableData.ZTITLE,
    author: rawTableData.ZAUTHOR,
    filePath: rawTableData.ZPATH
  };
}

function formatAnnotation(bookData, rawAnnData) {
  if (rawAnnData && (rawAnnData.ZANNOTATIONREPRESENTATIVETEXT || rawAnnData.ZANNOTATIONSELECTEDTEXT)) {
    var annotation = {
      representativeText: rawAnnData.ZANNOTATIONREPRESENTATIVETEXT,
      selectedText: rawAnnData.ZANNOTATIONSELECTEDTEXT,
      bookId: rawAnnData.ZANNOTATIONASSETID
    };

    if (bookData && bookData[rawAnnData.ZANNOTATIONASSETID]) {
      annotation.book = bookData[rawAnnData.ZANNOTATIONASSETID];
    }

    return annotation;
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

function getAnnotations(dbPath, books) {
  const ann_db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, handleConnect);
  return new Promise((resolve, reject) => {
    ann_db.all('SELECT zannotationassetid, zannotationrepresentativetext, zannotationselectedtext FROM zaeannotation', (err, annRows) => {
      if (err) {
        reject(err);
      } else {
        let annotations = annRows.map(formatAnnotation.bind(this, books));
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
    const booksPath = await findBooksDbPath();
    const annotationsPath = await findAnnotationsDbPath();
    const books = await getBooks(booksPath);
    const annotations = await getAnnotations(annotationsPath, books);
    console.log(annotations);
  } catch(e) {
    if (e && e.message) {
      console.error(e.message);
    } else {
      console.log('Sorry, something went wrong...');
    }
  }
})();
