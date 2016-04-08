from common import load_non_preprocessed_data, load_preprocessed_data, load_preprocessed_2_data
from classifiers import ClassifierOvOFeaturesReduction
from preprocess_2 import filter_feature_sets
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from sklearn.cross_validation import StratifiedKFold
from sklearn.ensemble import GradientBoostingClassifier
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
from sklearn.pipeline import Pipeline
from sklearn.grid_search import GridSearchCV
from sklearn.svm import LinearSVC
from sklearn.svm import SVC
import nltk
import numpy
import os
import json

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

valid_classifiers = {
    "linearsvc": LinearSVC,
    "sgd": SGDClassifier,
    "svc": SVC,
    "voting": VotingClassifier,
}

def main(classifier_name,
         classifier_args=None,
         ngram=2
         ):
  X, y = load_preprocessed_data()

  ###############################
  # Training and testing models #
  ###############################

  print()
  print('training classifier')
  if classifier_args is None:
    classifier_args = {}
  classifier = valid_classifiers[classifier_name](**classifier_args)

  ml_pipeline = Pipeline([
                    ('tfidf', TfidfVectorizer(sublinear_tf=True, ngram_range=(1,ngram))),
                    ('Classifier', classifier),
                    ])
  ml_pipeline.fit(X, y)
  
  print('labeling data')
  with open('data/tomato_db.json') as data_file:
    data = json.load(data_file);    
    reviews = data["reviews"];

    for review in reviews:
      review['sentiment'] = numpy.asscalar(ml_pipeline.predict([review['review']])[0])

    f = open('data/tomato_db_labeled.json', 'w', encoding='UTF-8')
    f.write(json.dumps(data, indent = 4))
    f.close()

if __name__ == '__main__':
  classifier_name = "sgd"
  classifier_args = { 'loss': 'log', 'penalty': 'elasticnet' } 

  if 'classifier_name' not in locals() or 'classifier_args' not in locals():
    print('Please uncomment a classifier')
    import sys
    sys.exit()

  print('=======================================')
  print(classifier_name)
  print('=======================================')

  main(classifier_name, classifier_args, ngram=2)

