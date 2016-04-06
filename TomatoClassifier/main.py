from common import load_non_preprocessed_data, load_preprocessed_data
from classifiers import ClassifierOvOFeaturesReduction
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
    "BernoulliNB": BernoulliNB,
}

def main(classifier_name,
         classifier_args=None,
         ngram=2,
         folds=3,
         preprocessed=False):
  if preprocessed:
    X, y = load_preprocessed_data()
  else:
    X, y = load_non_preprocessed_data()

  # StratifiedKFold makes sure that there's no unfortunate data split
  skf = StratifiedKFold(y, folds)

  ###############################
  # Training and testing models #
  ###############################
 
  # vectorizer = TfidfVectorizer(sublinear_tf=True, max_df=0.5, analyzer='word', 
  #        stop_words='english', ngram_range=(1, ngram))
  vectorizer = CountVectorizer(ngram_range=(1, ngram))

  print()
  print('training classifier')
  if classifier_args is None:
    classifier_args = {}
  classifier = valid_classifiers[classifier_name](**classifier_args)

  params = {
            "tfidf__ngram_range": [(1, 2)],
            # "Classifier__class_weight": [{ 0: 1, 1: 100, 2: 1}, { 0: 1, 1: 1, 2: 1}],
            # "Classifier__C": [.01, .1, 1, 10, 100],
            # "Classifier__kernel": ['rbf', 'linear', 'poly', 'sigmoid'],
            # "Classifier__penalty": ['l1', 'l2', 'elasticnet'],
            # "Classifier__loss" : ['hinge', 'log', 'modified_huber', 'squared_hinge', 'perceptron'],
          }
  ml_pipeline = Pipeline([
                    ('tfidf', TfidfVectorizer(sublinear_tf=True)),
                    # ('Vectorization', CountVectorizer(binary='true')),
                    # ('Feature Refinement', TfidfTransformer(use_idf=False)),
                    # ('Feature Selection', SelectKBest(chi2, 100)),
                    # ('Feature Reduction', ClassifierOvOFeaturesReduction()),
                    ('Classifier', classifier),
                    ])

  gs = GridSearchCV(ml_pipeline, params, cv = folds, verbose=2, n_jobs=-1)
  gs.fit(X, y)
  print(gs.best_params_)
  print(gs.best_score_)

if __name__ == '__main__':
  # classifier_name = "decisiontree"
  # classifier_args = {"max_depth": 10}

  # classifier_name = "knn"
  # classifier_args = {}

  # classifier_name = "extratree"
  # classifier_args = {"n_jobs": -1}

  # classifier_name = "sgd"
  # classifier_args = {} 

  # classifier_name = "linearsvc"
  # classifier_args = {} #{ "class_weight": { 0: 1, 1: 100, 2: 1} }

  classifier_name = "BernoulliNB"
  classifier_args = {}

  if 'classifier_name' not in locals() or 'classifier_args' not in locals():
    print('Please uncomment a classifier')
    import sys
    sys.exit()

  print('=======================================')
  print(classifier_name)
  print(classifier_args)
  print('=======================================')

  main(classifier_name, classifier_args, preprocessed = False, ngram=2)
