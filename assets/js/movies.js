var MoviesDemo = (function() {
  'use strict';

  /*************
   * globals */
  var MOVIE_VECTORS = {};

  /******************
   * work functions */
  function init() {

      // Fetch JSON files and store them in memory
      fetch('data/openai_movies.json').then(function(response) {
        return response.json();
      }).then(function(json) {
        MOVIE_VECTORS = json;
        for (var movie in MOVIE_VECTORS) {
          var option = document.createElement('option');
          option.value = movie;
          $s('#movie-title-options').appendChild(option);
        }
        $s('#see-embedding-btn').disabled = false;
        $s('#model-results').innerHTML = "";
      }).catch(function(ex) {
        console.error(ex);
        alert('Movies JSON did not load! Please tell your local friendly developer.', ex);
      });

    const resultsNode = $s('#model-results');
    $s('#see-embedding-form').addEventListener('submit', function(e) {
      e.preventDefault();
      resultsNode.innerHTML = '';
      var movieTitle = $s('#movie-title').value;
      renderEmbedding(movieTitle, resultsNode);
    });
  }

  function renderEmbedding(movieTitle, resultsNode) {
    const embedding = MOVIE_VECTORS[movieTitle];
    var simWords = VectorUtils.findSimilarWords(MOVIE_VECTORS, 10, movieTitle);
        
    const resultTemplate = $s('#template-model-result');
    const resultTemplateClone = resultTemplate.content.cloneNode(true);
    resultTemplateClone.querySelector(".movie-title").innerHTML = movieTitle;
    resultTemplateClone.querySelector(".vector").innerHTML = embedding.toString().replaceAll(",", ", ");
    resultTemplateClone.querySelector(".vector-length").innerHTML = embedding.length + " dimensions";
    renderSimilarities(resultTemplateClone.querySelector(".similar-vectors"), simWords);
    resultsNode.appendChild(resultTemplateClone);
  }

  function renderSimilarities(domNode, sims) {
    domNode.innerHTML = '';
    sims.forEach(function(sim) {
      var tr = document.createElement('tr');
      const wordCell = document.createElement('td');
      const wordLink = document.createElement('a');
      wordLink.href = "#";
      wordLink.innerHTML = sim[0];
      wordLink.addEventListener('click', (e) => {
        e.preventDefault();
        $s('#movie-title').value = sim[0];
        $s('#see-embedding-form').dispatchEvent(new Event('submit'));
      });
      wordCell.appendChild(wordLink);
      tr.appendChild(wordCell);
      const similarityCell = document.createElement('td');
      similarityCell.innerHTML = sim[1];
      tr.appendChild(similarityCell);
      domNode.appendChild(tr);
    });
  }

  function $s(id) { //for convenience
    if (id.charAt(0) !== '#') return false;
    return document.getElementById(id.substring(1));
  }

  return {
    init: init
  };
})();
    
window.addEventListener('load', MoviesDemo.init);
