from sklearn.linear_model import SGDClassifier
from sklearn.multiclass import fit_ovo
import numpy

class ClassifierOvOFeaturesReduction:
  """
  A transformation that esentially implement a form of dimensionality
  reduction.
  This class uses a fast SGDClassifier configured like a linear SVM to produce
  a vector of decision functions separating target classes in a
  one-versus-rest fashion.
  It's useful to reduce the dimension bag-of-words feature-set into features
  that are richer in information.
  """

  def fit(self, X, y):
    """
    `X` is expected to be an array-like or a sparse matrix.
    `y` is expected to be an array-like containing the classes to learn.
    """
    self.classifiers = fit_ovo(SGDClassifier(), X, numpy.array(y), n_jobs=-1)[0]
    return self

  def transform(self, X, y=None):
    """
    `X` is expected to be an array-like or a sparse matrix.
    It returns a dense matrix of shape (n_samples, m_features) where
        m_features = (n_classes * (n_classes - 1)) / 2
    """
    xs = [clf.decision_function(X).reshape(-1, 1) for clf in self.classifiers]
    return numpy.hstack(xs)

  def get_params(self, deep=False):
    return {}