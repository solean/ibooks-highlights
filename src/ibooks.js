const os = require('os');
const sqlite3 = require('sqlite3').verbose();
const utils = require('./utils');

const homedir = os.homedir();
const BOOKS_START_PATH = homedir + '/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary';
const ANNOTATIONS_START_PATH = homedir + '/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation';

let ibooks = {};


function findBooksDbPath() {
  return utils.findFiles(BOOKS_START_PATH, '/**/*.sqlite');
}

function findAnnotationsDbPath() {
  return utils.findFiles(ANNOTATIONS_START_PATH, '/**/*.sqlite');
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

ibooks.getBooks = async function getBooks() {
  const booksPath = await findBooksDbPath();
  const book_db = new sqlite3.Database(booksPath, sqlite3.OPEN_READONLY, utils.handleConnect);
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

      book_db.close(utils.handleClose);
    });
  });
}

ibooks.getAnnotations = async function getAnnotations() {
  const booksPath = await findBooksDbPath();
  const annotationsPath = await findAnnotationsDbPath();
  const books = await this.getBooks(booksPath)
  const ann_db = new sqlite3.Database(annotationsPath, sqlite3.OPEN_READONLY, utils.handleConnect);
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

      ann_db.close(utils.handleClose);
    });
  });
}

module.exports = ibooks;
