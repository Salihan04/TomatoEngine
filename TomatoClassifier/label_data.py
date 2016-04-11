from common import load_non_preprocessed_data
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from sklearn.ensemble import VotingClassifier
from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.multiclass import fit_ovo
from sklearn.pipeline import Pipeline
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import BernoulliNB
from sklearn.svm import LinearSVC
from sklearn.svm import SVC
import nltk
import numpy
import os
import json
import time

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

valid_classifiers = {
  "knn": KNeighborsClassifier,
  "linearsvc": LinearSVC,
  "sgd": SGDClassifier,
  "svc": SVC,
  "voting": VotingClassifier,
  "BernoulliNB": BernoulliNB,
}

def main(classifier_name,
         classifier_args=None,
         ngram=2
         ):
  X, y = load_non_preprocessed_data()

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
    total_time = 0;

    for review in reviews:
      start_time = time.clock();
      review['sentiment'] = numpy.asscalar(ml_pipeline.predict([review['review']])[0])
      total_time += time.clock() - start_time;

    f = open('data/tomato_db_labeled.json', 'w', encoding='UTF-8')
    f.write(json.dumps(data, indent = 4))
    f.close()

    print("Time taken per record: %f" % (total_time / len(reviews)));

if __name__ == '__main__':
  classifier_name = "voting"
  classifier_args = {
    "estimators": [
        ('sgd', valid_classifiers['sgd'](loss='log', penalty='elasticnet')),
        ('BernoulliNB', valid_classifiers['BernoulliNB']()),
        ('knn', valid_classifiers['knn']()),
        ('linearsvc', valid_classifiers['linearsvc'](C=0.1)),
        ('svc', valid_classifiers['svc'](C=1, kernel='linear')),
      ]
  }

  if 'classifier_name' not in locals() or 'classifier_args' not in locals():
    print('Please uncomment a classifier')
    import sys
    sys.exit()

  print('=======================================')
  print(classifier_name)
  print('=======================================')

  main(classifier_name, classifier_args, ngram=2)

