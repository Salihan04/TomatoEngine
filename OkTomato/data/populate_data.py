import json
import requests

INDEX = "tomato"
USER = "elasticsearch"
PASS = "soelynnlovestomatoes"
URL = "https://%s:%s@tomato.ga:9999" % (USER, PASS)
FULL_URL = '%s/%s/_search' % (URL, INDEX)

def make_request(field):
    payload = {
        "size": 0,
        "aggs": {
            "count": {
                "terms" :{
                    "field": field,
                    "size": 0
                }
            }
        }
    }

    r = requests.post(FULL_URL, data=json.dumps(payload))
    return r.json()

def process_result(result):
    buckets = result['aggregations']['count']['buckets']
    return [i['key'] for i in buckets]

mapping = {
    'genre': 'movie.imdb.Genre',
    'movies': 'movie.title.raw',
    'actors': 'movie.abridged_cast.name',
    'characters': 'movie.abridged_cast.characters'
}

for (file_name, field) in mapping.iteritems():
    result = make_request(field)
    values = process_result(result)
    with open('%s.json' % file_name, 'w') as f:
        json.dump(values, f)
