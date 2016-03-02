import requests
import json
import random
import math
from urllib import quote_plus

data_files = ['actor']
ACCESS_TOKEN = 'W7SPBNN4HSU5G4PQJQHSTYM2TDEQ7OZZ'
FULL_URL = 'https://api.wit.ai/entities?v=20141022'
UPDATE_URL = 'https://api.wit.ai/entities/%s/values/%s/expressions?v=20141022'
UPDATE_ENTITIES_URL = 'https://api.wit.ai/entities/%s?v=20141022'
templates = {
    'actor': '%(instr)s %(number)s movies by %(actor)s',
    'genre': '%(instr)s %(number)s %(genre)s movies',
    'movie': '%(instr)s %(movie)s'
}

exprs = []

def generate_expr(entity_type, value):
    instr = ['find me', 'show me']
    number = random.randrange(1, 20)
    options = {
        'instr': random.choice(instr),
        'number': number,
    }
    options[entity_type] = value
    return templates[entity_type] % options

def make_request(entity_type):
    with open('data/%s.json' % entity_type, 'r') as f:
        data = json.load(f)

    values = [{'value': v, 'expressions': [v, v.lower()]} for v in data]
    for v in data:
        for _ in xrange(3):
            exprs.append({'body': generate_expr(entity_type, v)})

    payload = {
        'id': entity_type,
        'doc': entity_type,
        'values': values
    }
    headers = {'Authorization': 'Bearer %s' % ACCESS_TOKEN,
               'Content-Type': 'application/json'}
    r = requests.post(FULL_URL, data=json.dumps(payload), headers=headers)
    # r = requests.put(UPDATE_ENTITIES_URL % entity_type, data=json.dumps(payload), headers=headers)

    return r.json()

for entity_type in data_files:
    print make_request(entity_type)
    print '%s: Done' % entity_type
#
# INTENT_URL = 'https://api.wit.ai/intents/Movies/expressions?v=20141022'
# headers = {'Authorization': 'Bearer %s' % ACCESS_TOKEN,
#            'Content-Type': 'application/json'}
#
# l = len(exprs)
# count = int(math.ceil(l/100))
# for i in xrange(count):
#     r = requests.post(INTENT_URL, data=json.dumps(exprs[i:i+100]), headers=headers)
#     print i
