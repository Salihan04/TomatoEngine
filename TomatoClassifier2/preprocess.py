from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import json
import re
import nltk

from sklearn.feature_extraction.text import CountVectorizer
from sklearn import svm
from sklearn import tree
from sklearn import cross_validation
from sklearn import metrics
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.feature_extraction.text import TfidfTransformer
from sknn.mlp import Classifier, Layer
import math


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

def preprocess_json_dataset_file(jsonData):
  reviews = jsonData
  tempData = []
  data = []
  data_class = []
  for review in reviews:
    try:
      int(review["rating"])
      data.append(preprocess_document(review["review"]))
      data_class.append(isPositive(review["rating"]))
    except KeyError:
      print("KeyError: in review id " + review["id"])
      continue
    except ValueError:
      print("ValueError: Cannot turn to rating int ")

  return (data, data_class)


def get_feature_keys(word, feature_keys):
  for f, sim_words in feature_keys.iteritems:
    if word in sim_words:
      return f
  return word


def isPositive(rating):
  rate = int(rating)
  if rate < 20:
    return 0
  elif rate <30:
    return 1
  else:
    return 2

def is_english(word):
  word = word.lower()
  # word = re.sub(r'[^\w]', ' ', word)

  if word in english_vocab or word == "" or word == " " or re.match(r'\d', word):
    return True
  else:
    return False



def preprocess_document(document):
  processed_document = ""
  lemmatiser = WordNetLemmatizer()

  document = re.sub("\.\.+", ".", document)
  document = document.replace(".", ". ")

  for sentence in sent_tokenize(document):
    processed_sentence = []

    text = word_tokenize(sentence)

    for (word, pos_tag) in nltk.pos_tag(text):
      word = word.lower()

      word = transform_apostrophe(word, pos_tag)

      # Skip if word length is less than 1
      if len(word) < 2:
        continue

      # Skip if it is stopwords
      if word in stopwords:
        continue;
      elif pos_tag != None:
        if pos_tag in [".", "TO", "IN", "DT", "UH", "WDT", "WP", "WP$", "WRB"]:
          continue

      if wordnet_pos_code(pos_tag) != "":
        word = lemmatiser.lemmatize(word, wordnet_pos_code(pos_tag))
      
      if is_english(word):
        processed_sentence.append(word)
      else:
        break

    processed_document += ' '.join(processed_sentence) + '. '

  return processed_document






