from numpy import genfromtxt

def load_data(file_url):
  records = genfromtxt(file_url, 
                skip_header=1,
                names='id,review,sentiment',
                delimiter='\t',
                comments='\\\\',
                dtype='S36,S1000000,i8')
  return records

def load_preprocessed_data():
  records = load_data('data/preprocessed_reviews.tsv')
  return records['review'], records['sentiment']

def load_non_preprocessed_data():
  records = load_data('data/reviews.tsv')
  return records['review'], records['sentiment']