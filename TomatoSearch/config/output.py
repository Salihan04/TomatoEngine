import json

with open('../../TomatoCrawler/tomato_db.json', 'r') as f:
    db = json.load(f)

for i in db['reviews']:
    if 'rating' in i and i['rating'].isdigit():
        print json.dumps({'review': i})
