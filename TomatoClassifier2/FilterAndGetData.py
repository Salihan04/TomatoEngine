import json
import math
import nltk

def splitData(jsonFile):
  reviews = json.load(open(jsonFile))['reviews']
  totalReviews=  len(reviews)
  quantityForEachDataset = math.floor(totalReviews/3)
  unprocessed_datasets = []

  for i in range(0,3):
    unprocessed_datasets.append([])

  x = 0 
  for review in reviews:
    unprocessed_datasets[x].append(review)
    x = (x + 1)%3

  return unprocessed_datasets






def getData(main_dataset):
  unprocessed_datasets = splitData(main_dataset)
  

  return unprocessed_datasets