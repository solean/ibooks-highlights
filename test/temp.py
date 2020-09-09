
filepath = 'kindle.txt'

highlights = []

with open(filepath) as f:
    current_highlight = ''
    for i, line in enumerate(f):
        if line.startswith('=========='):
            highlights.append(current_highlight)
            current_highlight = ''
        else:
            current_highlight += line


print(highlights[0])
