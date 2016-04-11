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
from sklearn.metrics import f1_score, make_scorer, confusion_matrix, precision_score, recall_score
from sklearn import cross_validation
from sklearn.cross_validation import KFold
import numpy
import nltk
import numpy
import os
import json

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

def runTest(
        classifier_name,
        classifier_args=None,
        ngram=2,
        folds=5):

  print()
  print('running test')
  if classifier_args is None:
    classifier_args = {}
  classifier = valid_classifiers[classifier_name](**classifier_args)

  X, y = load_non_preprocessed_data()
  kfold = KFold(n=len(X), n_folds = folds)
  print(kfold)
  f1_scores = []
  precision_scores = []
  recall_scores = []
  confusion = numpy.array([[0,0,0],[0,0,0],[0,0,0]])
  # print(confusion)

  ml_pipeline = Pipeline([
                    ('tfidf', TfidfVectorizer(sublinear_tf=True, ngram_range=(1,ngram))),
                    ('Classifier', classifier),
                    ])

  for train_i, test_i in kfold:
    print(".")
    X_train = []
    y_train = []
    X_test = []
    y_test = []
    for i in train_i:
      X_train.append(X[i])
      y_train.append(y[i])
    for i in test_i:
      X_test.append(X[i])
      y_test.append(y[i])
    ml_pipeline.fit(X_train, y_train)
    predictions = ml_pipeline.predict(X_test)
    # print(confusion_matrix(y_test, predictions))
    confusion += confusion_matrix(y_test, predictions)

    f1_scores.append(f1_score(y_test, predictions, pos_label=None, average = 'micro'))
    precision_scores.append(precision_score(y_test, predictions, pos_label=None, average = 'micro'))
    recall_scores.append(recall_score(y_test, predictions, pos_label=None, average = 'micro'))

  average_f1_score=sum(f1_scores)/len(f1_scores)
  average_precision_score=sum(precision_scores)/len(precision_scores) 
  average_recall_score=sum(recall_scores)/len(recall_scores)

  print(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  print("F1 score: " + str(average_f1_score))
  print("precision score: " + str(average_precision_score)) 
  print("recall score: " + str(average_recall_score)) 
  print(confusion)
  numpy.savetxt("data/test_results_confusion_matrix.csv", confusion, delimiter=",")
  return ((average_f1_score, average_precision_score, average_recall_score))

def runCrossValidationTest(classifier_name,
        classifier_args=None,
        ngram=2,
        folds=5):

  if classifier_args is None:
    classifier_args = {}
  classifier = valid_classifiers[classifier_name](**classifier_args)
  X, y = load_non_preprocessed_data()
  # confusion = numpy.array([[0,0,0],[0,0,0],[0,0,0]])
  ml_pipeline = Pipeline([
                      ('tfidf', TfidfVectorizer(sublinear_tf=True, ngram_range=(1,ngram))),
                      ('Classifier', classifier),
                      ])
  X_train, X_test, y_train, y_test = cross_validation.train_test_split(X,y, test_size = 0.25, random_state=0)
  ml_pipeline.fit(X_train, y_train)
  predictions = ml_pipeline.predict(X_test)
  confusion = confusion_matrix(y_test, predictions)
  f1 = f1_score(y_test, predictions, pos_label=None, average = 'micro')
  precision = precision_score(y_test, predictions, pos_label=None, average = 'micro')
  recall = recall_score(y_test, predictions, pos_label=None, average = 'micro')
  print(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  print("F1 score: " + str(f1))
  print("precision score: " + str(precision)) 
  print("recall score: " + str(recall)) 
  print(confusion)
  numpy.savetxt("data/test_results_confusion_matrix_" + classifier_name+".csv", confusion, delimiter=",")
  return ((f1, precision, recall))




  
if __name__ == '__main__':
  classifier_name = "voting"
  classifier_args = {
    "estimators": [
        ('sgd', valid_classifiers['sgd'](loss='log', penalty='elasticnet')),
        ('BernoulliNB', valid_classifiers['BernoulliNB']()),
        # ('knn', valid_classifiers['knn']()),
        ('linearsvc', valid_classifiers['linearsvc'](C=0.1)),
        ('svc', valid_classifiers['svc'](C=1, kernel='linear')),
      ]
  }

  # classifier_name = "BernoulliNB"
  # classifier_args = {}

  # classifier_name = "knn"
  # classifier_args = {}

  # classifier_name = "svc"
  # classifier_args = {'C': 1, 'kernel': 'linear'}

  # classifier_name = "sgd"
  # classifier_args = { 'loss': 'log', 'penalty': 'elasticnet' } 

  # classifier_name = "linearsvc"
  # classifier_args = { 'C': 1 } #{ "class_weight": { 0: 1, 1: 100, 2: 1} }

  if 'classifier_name' not in locals() or 'classifier_args' not in locals():
    print('Please uncomment a classifier')
    import sys
    sys.exit()

  print('=======================================')
  print(classifier_name)
  print('=======================================')

  runCrossValidationTest(classifier_name, classifier_args, ngram=2)
