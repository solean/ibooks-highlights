const fs = require('fs')
const readline = require('readline')

const filepath = 'short_kindle.txt'


const file = readline.createInterface({
  input: fs.createReadStream(filepath),
  output: process.stdout,
  terminal: false
})

function parseHighlight(str) {
  // if (!str) return null

  let highlight = {}

  let lines = str.split('\n')
  let titleAndAuthor = lines[0]
  let authorIndex = titleAndAuthor.lastIndexOf('(')
  let author = titleAndAuthor.slice(authorIndex + 1, titleAndAuthor.length - 1)
  highlight.author = author
  let title = titleAndAuthor.slice(0, authorIndex)
  highlight.title = title.trim()

  let locAndDate = lines[1]
  // TODO:

  highlight.content = lines[3]

  return highlight
}


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
  console.log(highlights)
})
