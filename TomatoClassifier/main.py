from common import load_non_preprocessed_data, load_preprocessed_data
from gensim.models import Doc2Vec
from gensim.models.doc2vec import LabeledSentence
from sklearn.cross_validation import StratifiedKFold
from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import VotingClassifier
from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import Perceptron
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score
from sklearn.multiclass import fit_ovo
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline, make_union
from sklearn.svm import LinearSVC
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sknn.mlp import Classifier, Layer
import nltk
import numpy
import os

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

valid_classifiers = {
    "adaboosting": AdaBoostClassifier,
    "decisiontree": DecisionTreeClassifier,
    "extratree": ExtraTreesClassifier,
    "gradientboosting": GradientBoostingClassifier,
    "knn": KNeighborsClassifier,
    "linearsvc": LinearSVC,
    "neuralnetwork": Classifier,
    "randomforest": RandomForestClassifier,
    "sgd": SGDClassifier,
    "svc": SVC,
    "voting": VotingClassifier,
}

def main(classifier_name,
         classifier_args=None,
         ngram=2,
         folds=3,
         preprocessed=True):
  if preprocessed:
    X, y = load_preprocessed_data()
  else:
    X, y = load_non_preprocessed_data()

  # StratifiedKFold makes sure that there's no unfortunate data split
  skf = StratifiedKFold(y, folds)

  ###############################
  # Training and testing models #
  ###############################
  avg_accuracy = 0
  for train_index, test_index in skf:
    X_train, X_test = X[train_index], X[test_index]
    y_train, y_test = y[train_index], y[test_index]

    count_vect = TfidfVectorizer(sublinear_tf=True, max_df=0.5, analyzer='word', 
           stop_words='english', ngram_range=(1, ngram))
    X_train = count_vect.fit_transform(X_train)

    print('training classifier')
    if classifier_args is None:
      classifier_args = {}
    classifier = valid_classifiers[classifier_name](**classifier_args)
    classifier.fit(X_train, y_train)

    print('predicting test data')
    X_test = count_vect.transform(X_test)
    y_pred = classifier.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    print("accuracy: %f" % accuracy)

    avg_accuracy += accuracy;

  avg_accuracy = avg_accuracy / folds
  print('Avg accuracy: %f' % (avg_accuracy))

if __name__ == '__main__':
  # classifier_name = "decisiontree"
  # classifier_args = {"max_depth": 10}

  # classifier_name = "knn"
  # classifier_args = {}

  classifier_name = "randomforest"
  classifier_args = {"n_jobs": -1}

  # classifier_name = "sgd"
  # classifier_args = {}

  # classifier_name = "svc"
  # classifier_args = {}

  if 'classifier_name' not in locals() or 'classifier_args' not in locals():
    print('Please uncomment a classifier')
    import sys
    sys.exit()

  print('=======================================')
  print(classifier_name)
  print(classifier_args)
  print('=======================================')

  main(classifier_name, classifier_args, preprocessed = False, ngram=5)
