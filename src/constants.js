const BOOKS_PATH = '/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary';
const ANNOTATIONS_PATH = '/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation';
const BOOKS_QUERY = 'SELECT * FROM zbklibraryasset';
const ANNOTATIONS_QUERY = 'SELECT zannotationassetid, zannotationrepresentativetext, zannotationselectedtext, datetime(zannotationcreationdate + strftime("%s", "2001-01-01"), "unixepoch") as CREATED_ON, datetime(zannotationmodificationdate + strftime("%s", "2001-01-01"), "unixepoch") as UPDATED_ON, zannotationnote, zfutureproofing5 FROM zaeannotation ORDER BY created_on DESC';

module.exports = {
  BOOKS_PATH,
  ANNOTATIONS_PATH,
  BOOKS_QUERY,
  ANNOTATIONS_QUERY
};
