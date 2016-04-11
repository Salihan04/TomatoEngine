# TomatoEngine
An application to crawl a text corpus of Rotten Tomatoes movie reviews, act as a search engine to query over the corpus and perform text classification and clustering.

This repo is structured into four main folders:
* TomatoCrawler
* TomatoClassifier
* TomatoSearch
* OkTomato

## TomatoCrawler
It is a crawling module implemented in Node.js.

To install the dependency,
```Shell
$ npm install
```

To run the crawling,
```Shell
$ node TomatoCrawler/main.js
```

## TomatoClassifier
First, we need to install the following dependencies manually because the installation process is not consistent across platform:

1. Install [Mathplotlib](http://matplotlib.org/users/installing.html)
2. Install [Scipy](http://www.scipy.org/install.html)
3. Install [Numpy](http://docs.scipy.org/doc/numpy-1.10.1/user/install.html)
4. Install [Scikit-learn](http://scikit-learn.org/stable/install.html)

To run the classifier,
```Shell
$ python3 main.py
```
It will try different classifiers and show precision. We tweaks parameters in main.py for different classifier.

To label all the data using the classifier,
```Shell
$ python3 label_data.py
```

## TomatoSearch
There are two folders `config` and `website` which are contains the code for indexing and the website respectively.
The instructions can be found as follows:
- [Indexing](/TomatoSearch/config/README.md)
- [Website](/TomatoSearch/website/README.md)

## OkTomato
This folder is mainly used to download the entities from Elasticsearch and upload them to Wit.ai.

In the `OkTomato` directory:
- To download the entities, run
```Shell
$ python data/populate_data.py
```

- To upload to Wit.ai, run
```Shell
$ python upload_entities.py
```
