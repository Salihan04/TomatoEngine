import json
from langid import classify

with open('../../TomatoCrawler/tomato_db.json', 'r') as f:
    db = json.load(f)

with open('../../TomatoCrawler/metadata_db.json', 'r') as f:
    metadata_list = json.load(f)
    metadata = {i['url_id']: i for i in metadata_list['metadata']}

for i in db['reviews']:
    if 'rating' in i and i['rating'].isdigit():
        meta = metadata[i['movie']]
        i['metadata'] = {
            'title': meta['title'],
            'poster': meta['imdb']['Poster'],
            'genre': meta['imdb']['Genre'].split(', ')
        }
        lang = classify(i['review'])
        i['lang'] = {
            'type': lang[0],
            'conf': lang[1]
        }
        print json.dumps({'review': i})
