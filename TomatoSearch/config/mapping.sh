index="tomato"
user="elasticsearch"
pass="soelynnlovestomatoes"
url="https://$user:$pass@tomato.ga:9999"

curl -k -XPUT "$url/$index" -d'
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 1
  }
}'

curl -k -XPUT "$url/$index/_mapping/review" -d'
{
  "dynamic_templates": [
    {
      "notanalyzed": {
        "match": "*",
        "match_mapping_type": "string",
        "mapping": {
          "type": "string",
          "index": "not_analyzed"
        }
      }
    }
  ],
	"properties": {
		"review": {
			"properties": {
				"reviewer": {
          "type": "string",
          "index": "not_analyzed"
				},
				"reviewer_url": {
          "type": "string",
          "index": "not_analyzed"
				},
				"review": {
					"type": "string"
				},
				"rating": {
					"type": "integer"
				},
        "sentiment": {
          "type": "integer"
        },
				"date": {
          "type": "date",
          "format": "MMMM dd, yyyy"
        },
        "id": {
          "type": "string",
          "index": "not_analyzed"
				},
        "movie": {
          "type": "string",
          "index": "not_analyzed"
				},
        "lang": {
          "type": "object",
          "dynamic": true
        },
        "metadata": {
          "type": "object",
          "dynamic": true
        }
			}
		}
	}
}'

curl -k -XPUT "$url/$index/_mapping/movie" -d'
{
  "dynamic_templates": [
    {
      "notanalyzed": {
        "match": "*",
        "match_mapping_type": "string",
        "mapping": {
          "type": "string",
          "index": "not_analyzed"
        }
      }
    }
  ],
	"properties": {
		"movie": {
			"properties": {
				"title": {
          "type": "string",
          "analyzer": "standard",
          "fields": {
            "raw": {
              "type":  "string",
              "index": "not_analyzed"
            }
          }
				}
			}
		}
	}
}'
