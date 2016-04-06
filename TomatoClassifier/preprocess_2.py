from common import load_non_preprocessed_data, load_preprocessed_data
from classifiers import ClassifierOvOFeaturesReduction
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from sklearn.cross_validation import StratifiedKFold
from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import VotingClassifier
from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2
from sklearn.linear_model import Perceptron
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.multiclass import fit_ovo
from sklearn.naive_bayes import GaussianNB
from sklearn.naive_bayes import BernoulliNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.grid_search import GridSearchCV
from sklearn.svm import LinearSVC
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
import nltk
import numpy
import os
########extractFeatures#########
def generate_feature_key_capture(feature_sets):
	feature_keys = {}
	for f in feature_sets:
		similar_words = []
		for word in f.split(" "):
			similar_word = get_similar_words2(word)
			similar_words.append(similar_word)
		feature_keys[f] = similar_words
	return feature_keys 


def get_feature_keys(word, feature_keys):
	for f, sim_words in feature_keys.items():
		words = word.split(" ")
		if len(sim_words) != len(words):
			continue
		for i in range(0, len(words)):
			check = 0
			if words[i] in sim_words[i]:
				check += 1
			if check == len(words):
				return f
	return None

def get_similar_words2(word):
	word_list = []
	for s in wordnet.synsets(word):
		similar_word = s.name().split('.')[0]
		if similar_word in word:
			for hypo in s.hyponyms():
				tempWord = hypo.name().split(".")[0]
				if "_" not in tempWord:
					word_list.append(tempWord)
	return word_list

###########################################


 ####can only do up to 2 bigrams for now
def filter_to_feature(data, feature_key_net, ngram = 1):
	tokens = word_tokenize(data)
	resultString  = ""
	for i in range(len(tokens) - ngram + 1):
		feature_key = ""
		tempString = tokens[i]
		for j in range(1, ngram):
			tempString = tempString + " " + tokens[i+j]
		feature_key = get_feature_keys(tempString, feature_key_net)
		if feature_key == None:
			feature_key = get_feature_keys(tokens[i], feature_key_net)
			if feature_key != None:
				resultString = resultString + " " +  feature_key
			else:
				resultString = resultString + " " +  tokens[i]
			if i == len(tokens) - ngram:
				resultString = resultString + " " + tempString
		else:
			resultString = resultString + " " + feature_key
			i += ngram - 1
	return resultString

def filter_to_feature_unigram(review, feature_key_net):
	tokens = word_tokenize(review)
	resultString  = ""
	for token in tokens:
		token = get_feature_key(token, feature_key_net)
		resultString = resultString + " " + token
	return resultString

def filter_feature_sets(X, y, ngram = 2, iteration = 1):
	for i in range(0,iteration):
		print("start of feature_key_net generation .......")
		vectorizer = CountVectorizer(ngram_range=(1, ngram))
		vectorizer.fit(X, y)
		feature_sets = vectorizer.get_feature_names()  
		feature_key_net = generate_feature_key_capture(feature_sets)
		newX = []
		for review in X:
				print("before")
				print(str(review))
				review = filter_to_feature(str(review), feature_key_net, ngram)
				print("After")
				print(review)
				newX.append(review)
		return newX

if __name__ == '__main__':
  # Preprocess train data
  X, y = load_preprocessed_data()

  preprocess_records = filter_feature_sets(X,y,2,1)

  with open('data/preprocessed_2_reviews.tsv', 'w') as preprocess_file:
    header = 'review\tsentiment\n'
    preprocess_file.write(header)

    for i in range(X):
      preprocess_file.write('\t%s\t%i\n' %
                            (X[i], y[i]))