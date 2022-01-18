const fs = require('fs')
const readline = require('readline')
const moment = require('moment')


function parseLocation(str) {
  let location = ''
  let locationRegex = /Location (\d+)-(\d+)/
  let locationMatch = str.match(locationRegex)
  if (locationMatch) {
    location += locationMatch[1] + '-' + locationMatch[2]
  }
  return location
}

function parseDateTime(str) {
  let momentDate
  let dateTime = {}
  let date = null

  let dateRegex = /(January|February|March|April|May|June|July|August|September|October|November|December) (\d+), (\d+)/
  let dateMatch = str.match(dateRegex)
  if (dateMatch) {
    dateTime.dateStr = dateMatch[0]
  }

  let timeRegex = /(\d+):(\d+):(\d+) (AM|PM)/
  let timeMatch = str.match(timeRegex)
  if (timeMatch) {
    dateTime.timeStr = timeMatch[0]
  }

  if (dateTime.dateStr && dateTime.timeStr) {
    momentDate = moment(`${dateTime.dateStr} ${dateTime.timeStr}`, 'MMMM D, YYYY h:mm:ss a')
    date = momentDate.toDate()
  }

  return date
}

function parseHighlight(str) {
  let highlight = {}

  let lines = str.split('\n')
  let titleAndAuthor = lines[0]
  let authorIndex = titleAndAuthor.lastIndexOf('(')
  let author = titleAndAuthor.slice(authorIndex + 1, titleAndAuthor.length - 1)
  highlight.author = author
  let title = titleAndAuthor.slice(0, authorIndex)
  highlight.title = title.trim()

  let locAndDate = lines[1]
  highlight.location = parseLocation(locAndDate)
  highlight.date = parseDateTime(locAndDate)

  highlight.content = lines[3]

  return highlight
}


const filepath = 'kindle.txt'
const file = readline.createInterface({
  input: fs.createReadStream(filepath),
  output: process.stdout,
  terminal: false
})

let highlights = []
let currentHighlight = ''
file.on('line', line => {
  if (line.startsWith('==========')) {
    highlights.push(parseHighlight(currentHighlight))
    currentHighlight = ''
  } else {
    currentHighlight += line + '\n'
  }
})

file.on('close', () => {
  const outputFileName = 'kindle_export.json'
  fs.writeFileSync(outputFileName, JSON.stringify(highlights))
  console.log(`Kindle annotations written in file: ${outputFileName}`)
})
