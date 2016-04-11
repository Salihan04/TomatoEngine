from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
from nltk.tokenize import word_tokenize
import json

with open('data/tomato_db.json') as data_file:
	data = json.load(data_file);    
	reviews = data["reviews"];
	new_reviews = [];
	no_of_types = set();
	count = 0;

	for review in reviews:
		tokens = word_tokenize(review["review"])
		no_of_words = len(tokens)

		try:
			if review["lang"] == 'en' and 80 <= no_of_words <= 170:
				new_reviews.append(review);
				no_of_types = no_of_types.union(tokens);
				
				count += no_of_words
		except KeyError:
			continue;

	data["reviews"] = new_reviews;

	f = open('data/tomato_db_filtered.json', 'w', encoding='UTF-8');
	f.write(json.dumps(data, indent = 4));
	f.close();

	print("No of documents: %d" % (len(new_reviews)));
	print("No of words: %d" % (count));
	print("No of type: %d" % (len(no_of_types)));