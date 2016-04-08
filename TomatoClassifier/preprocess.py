from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tag.perceptron import PerceptronTagger
from sklearn.feature_extraction.text import CountVectorizer
from sklearn import svm
from sklearn import tree
from sklearn import cross_validation
from sklearn import metrics
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.feature_extraction.text import TfidfTransformer
from sknn.mlp import Classifier, Layer
from common import load_data
from bc_prog import bc_prog
import csv
import re
import nltk
import math

tagger = PerceptronTagger()
lemmatizer = WordNetLemmatizer()
basictizer = bc_prog()

stopwords = stopwords.words('english')
stopwords.remove("but")
stopwords.remove("not")
stopwords.remove("no")
stopwords.remove("very")

english_vocab = set(w.lower() for w in nltk.corpus.words.words())
abbrev_dict = ["'m", "n't", "'s", "'re", "'ve"]

def wordnet_pos_code(tag):
  if tag == None:
    return ''
  elif tag.startswith('NN'):
    return wordnet.NOUN
  elif tag.startswith('VB'):
    return wordnet.VERB
  elif tag.startswith('JJ'):
    return wordnet.ADJ
  elif tag.startswith('RB'):
    return wordnet.ADV
  else:
    return ''

def transform_apostrophe(word, pos_tag):

  if word == "n't":
    word = "not"
  elif word == "'ll":
    word = "will"
  elif word == "'re":
    word = "are"
  elif word == "'ve":
    word = "have"
  elif word == "'s" and pos_tag == "VBZ":
    word = "is"
  return word


def preprocess_word(word, pos_tag, stopword=False, filtered_post_tag=False, lemmatize=True, basic_word = False):
  word = word.lower()
  word = transform_apostrophe(word, pos_tag)
  word = word.replace('.', '')
  word = word.replace('\'', '')

  if len(word) < 1:
    return ""

  # Skip if word length is less than 2
  # Skip if it is stopwords
  if stopword and len(word) <= 2 or word in stopwords:
    return ""

  if filtered_post_tag and pos_tag != None and pos_tag in FILTERED_POS_TAG:
    return ""

  if basic_word and pos_tag.startswith("NN"):
    wordbf=  word
    basicWord = basictizer.check_basic(word)
    if basicWord:
      if basicWord != word:
        print(word + " >> " + basicWord)
      word = basicWord

  if lemmatize and wordnet_pos_code(pos_tag) == wordnet.NOUN:
    word = lemmatizer.lemmatize(word, wordnet_pos_code(pos_tag))

  if(word == 'w/a'):
    word = 'with a'

  if(re.search('w/[a-z][a-z]+', word) is not None):
    word = word.replace('w/', 'without ')

  if(re.search('[a-z]+/[a-z]+', word) is not None):
    word = word.replace('/', ' or ')

  # if word not in english_vocab and word not in stopwords:
  #   print(word)
  

  return word

def preprocess(record, stopword=False, filtered_post_tag=False, basic_word = False, lemmatize=True):
  review_str = record['review'].decode('UTF-8')
  review_str = review_str.replace('.', '. ')

  tokens = word_tokenize(review_str)
  
  preprocessed_string = [preprocess_word(word, pos_tag, stopword, filtered_post_tag, lemmatize, basic_word)
                         for (word, pos_tag) in nltk.tag._pos_tag(tokens, None, tagger)]
  preprocessed_string = [word for word in preprocessed_string if word != ""]

  record['review'] = u' '.join(preprocessed_string).encode('utf-8').strip()
  return record

if __name__ == '__main__':
  # Preprocess train data
  records = load_data('data/reviews.tsv')

  preprocess_records = [preprocess(record, stopword=False, basic_word = True, lemmatize=True) for record in records]

  with open('data/preprocessed_reviews.tsv', 'w') as preprocess_file:
    header = 'id\treview\tsentiment\n'
    preprocess_file.write(header)

    for record in records:
      try:
        preprocess_file.write('%s\t%s\t%i\n' %
                            (record['id'].decode('UTF-8'), record['review'].decode('UTF-8'), record['sentiment']))
      except UnicodeEncodeError:
        print("unicode encode error")
        continue