import json
from langid import classify

with open('../../TomatoClassifier/data/tomato_db_labeled.json', 'r') as f:
    db = json.load(f)

with open('../../TomatoCrawler/metadata_db.json', 'r') as f:
    metadata_list = json.load(f)
    metadata = {i['url_id']: i for i in metadata_list['metadata']}

for i in db['reviews']:
    meta = metadata[i['movie']]
    i['metadata'] = {
        'title': meta['title'],
        'poster': meta['imdb']['Poster'],
        'genre': meta['imdb']['Genre'].split(', ')
    }
    if 'rating' in i and i['rating'].isdigit():
        pass
    else:
        sentiment = i['sentiment']
        rating = 10
        if sentiment == 0:
            rating = 10
        elif sentiment == 1:
            rating = 30
        else:
            rating = 40
        i['rating'] = rating
        # lang = classify(i['review'])
        # i['lang'] = {
        #     'type': lang[0],
        #     'conf': lang[1]
        # }
    print json.dumps({'review': i})
