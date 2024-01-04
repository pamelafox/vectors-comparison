/******************\
|  Vector Utils    |
| @author Anthony  |
| @version 0.2.1   |
| @date 2016/01/08 |
\******************/

var VectorUtils = (function() {
  'use strict';

  function findSimilarWords(vectors, n, word) {
    if (!vectors.hasOwnProperty(word)) {
      return [false, word];
    }

    return getNClosestMatches(
      vectors, n, vectors[word]
    );
  }

  function getNClosestMatches(vectors, n, vec) {
    var sims = [];
    for (var word in vectors) {
      var sim = getCosSim(vec, vectors[word]);
      sims.push([word, sim]);
    }
    sims.sort(function(a, b) {
      return b[1] - a[1]; 
    });
    return sims.slice(0, n);
  }

  /********************
   * helper functions */
  function getCosSim(f1, f2) {
    return Math.abs(f1.reduce(function(sum, a, idx) {
      return sum + a*f2[idx];
    }, 0)/(mag(f1)*mag(f2))); //magnitude is 1 for all feature vectors
  }

  function mag(a) {
    return Math.sqrt(a.reduce(function(sum, val) {
      return sum + val*val;  
    }, 0));
  }

  return {
    findSimilarWords: findSimilarWords
  };
})();
