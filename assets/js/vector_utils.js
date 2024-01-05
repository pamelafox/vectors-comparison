/******************\
|  Vector Utils    |
| @author Anthony  |
| @version 0.2.1   |
| @date 2016/01/08 |
\******************/

var VectorUtils = (function() {
  'use strict';

  function findRelatedTextVectors(vectors, n, targetText) {
    // Returns [nFarthestMatches, nClosestMatches]
    if (!vectors.hasOwnProperty(targetText)) {
      return [false, targetText];
    }
    var sims = getSims(vectors, targetText);
    return [getNClosestMatches(sims, n), getNFarthestMatches(sims, n), sims];
  }

  function getSims(vectors, targetText) {
    // Returns text:similarity map from vectors, sorted by similarity to vec
    var sims = [];
    var targetVector = vectors[targetText];
    // Loop through key,value in vectors object
    for (const [otherText, otherVector] of Object.entries(vectors)) {
      if (otherText == targetText) {
        continue;
      }
      sims.push([otherText, getCosSim(targetVector, otherVector)]);
    }
    sims.sort(function(a, b) {
      return b[1] - a[1]; 
    });
    return sims;
  }

  function getNClosestMatches(sims, n) {
    // Returns n vectors that are most similar to vec
    return sims.slice(0, n);
  }

  function getNFarthestMatches(sims, n) {
    // Returns n vectors that are least similar to vec
    return sims.slice(-n);
  }

  /********************
   * helper functions */
  function getCosSim(f1, f2) {
    var dotProduct = f1.reduce(function(sum, val, i) {
      return sum + val*f2[i];  
    }, 0);
    return dotProduct / (mag(f1) * mag(f2));
  }

  function mag(a) {
    return Math.sqrt(a.reduce(function(sum, val) {
      return sum + val*val;  
    }, 0));
  }

  return {
    findRelatedTextVectors: findRelatedTextVectors
  };
})();
