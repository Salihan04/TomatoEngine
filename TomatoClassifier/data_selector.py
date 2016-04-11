from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
import json

def convertFromRatingToSentiment(rating):
	if rating < 25:
		return 0;
	elif rating <35:
		return 1;
	else:
		return 2;

total_class_limit = 334;

negative_count = 0;
neutral_count = 0;
positive_count = 0;

output_file = open("data/reviews.tsv", "w");
# Write header
output_file.write("id\treview\tsentiment\n");

with open('data/tomato_db.json') as data_file:
	data = json.load(data_file);    
	reviews = data["reviews"];

	for review in reviews:
		try:
			if("rating" in review.keys()):
				rating = int(review["rating"]);
				sentiment = convertFromRatingToSentiment(rating);

				if(sentiment == 0):
					if(negative_count >= total_class_limit):
						continue;
					negative_count += 1;
				elif(sentiment == 1):
					if(neutral_count >= total_class_limit):
						continue;
					neutral_count += 1;
				else:
					if(positive_count >= total_class_limit):
						continue;
					positive_count += 1;
				output_file.write('%s\t%s\t%i\n'%(review["id"], review["review"], sentiment));

				if(negative_count >= total_class_limit and neutral_count >= total_class_limit and positive_count >= total_class_limit):
					break;
		except LangDetectException:
			continue;
		except ValueError:
			continue;

print("Negative: %i" % (negative_count));
print("Neutral: %i" % (neutral_count));
print("Positive: %i" % (positive_count));