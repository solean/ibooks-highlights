const BOOKS_PATH = '/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary';
const ANNOTATIONS_PATH = '/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation';
const BOOKS_QUERY = 'SELECT * FROM zbklibraryasset';
const ANNOTATIONS_QUERY = 'SELECT zannotationassetid, zannotationrepresentativetext, zannotationselectedtext, zannotationnote FROM zaeannotation'

module.exports = {
  BOOKS_PATH,
  ANNOTATIONS_PATH,
  BOOKS_QUERY,
  ANNOTATIONS_QUERY
};
