import json

with open('../../TomatoCrawler/metadata_db.json', 'r') as f:
    db = json.load(f)

for i in db['metadata']:
    i['imdb']['Genre'] = i['imdb']['Genre'].split(', ')
    print json.dumps({'movie': i})
