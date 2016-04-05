from langdetect import detect
import json

with open('data/tomato_db.json') as data_file:    
	data = json.load(data_file);
	reviews = data["reviews"];

	for review in reviews:
		try:

		catch LangDetectException:
		if(detect(review["review"]) == 'en'):
			print(review["review"]);