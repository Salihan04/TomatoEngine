index="tomato"
index_type="review"
user="elasticsearch"
pass="qwerty123"
url="https://$user:$pass@tomato.ga:9999"

curl -k -XPUT "$url/$index" -d'
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 1
  }
}'

curl -k -XPUT "$url/$index/_mapping/$index_type" -d'
{
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
				}
			}
		}
	}
}'
