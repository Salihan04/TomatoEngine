import preprocess
import FilterAndGetData
import json
from nltk.stem import WordNetLemmatizer


main_dataset = "../TomatoCrawler/tomato_db.json"
metaData = "../TomatoCrawler/metadata_db.json"

datasets = FilterAndGetData.getData(main_dataset)
preprocessed_datasets_with_dataclass = []

preprocessed_datasets_with_dataclass.append(preprocess.preprocess_json_dataset_file(datasets[0]))

with open("datasets.txt", 'w') as f:
	json.dumps(preprocessed_datasets_with_dataclass,f)
testDataset = preprocessed_datasets_with_dataclass[0][0]
testDataLabel = preprocessed_datasets_with_dataclass[0][1]

trainDataset = preprocessed_datasets_with_dataclass[1][0] + preprocessed_datasets_with_dataclass[2][0]
trainDataLabel = preprocessed_datasets_with_dataclass[1][1] + preprocessed_datasets_with_dataclass[2][1]

########extractFeatures#########
def generate_feature_key_capture(feature_sets):
  feature_keys = {}
  for f in feature_sets:
    similar_words = get_similar_words2(f)
    similar_words = set(similar_words) - set(feature_sets)
    feature_keys[f] = similar_words
  return feature_keys 

def extract_features_2(data, ngram = 2, no_of_features = 20):
  count = 0
  extracted_features = []

  count_vect = CountVectorizer(ngram_range=(1, ngram))
  X = count_vect.fit_transform(data)

  transformer = TfidfTransformer()
  transformer.fit_transform(X)
  indices = sorted(range(len(transformer.idf_)), key=lambda i:transformer.idf_[i])

  for i in indices:
    extracted_features.append(count_vect.get_feature_names()[i])

    count += 1
    if count == no_of_features:
      break;

  return extracted_features

def get_feature_keys(word, feature_keys):
  for f, sim_words in feature_keys.iteritems:
    if word in sim_words:
      return f
  return word

def get_similar_words2(word):
  word_list = []
  for s in wordnet.synsets(word):
    similar_word = s.name().split('.')[0]
    if similar_word in word:
      for hypo in s.hyponyms():
        word_list.append(hypo.name().split(".")[0])
  return word_list


def transformDataToFitExtractFeatures(dataset):
	resultDataset = []

	feature_sets = extract_features_2(dataset)
	feature_nets = generate_feature_key_capture(feature_sets)
	for data in dataset:
		# print(data)
		for token in data:
			print(token)
			newToken = get_feature_keys(token)


###########################################

##transform data into key features




# x=0
# for dataset in datasets:
# 	for data in dataset:
# 		try:
# 			print(data["review"])
# 		except UnicodeEncodeError:
# 			break


