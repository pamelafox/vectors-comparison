var VectorDemo = (function() {
  'use strict';

  /**********
   * config */
  var NUM_TO_SHOW = 10;
 
  /*************
   * globals */
  var WORD_VECTORS = {};

  /******************
   * work functions */
  function initWordToVecDemo() {

    loadWordVectors('openai');
    loadWordVectors('word2vec');

    const resultsNode = $s('#model-results');
    $s('#find-word-form').addEventListener('submit', function(e) {
      e.preventDefault();
      resultsNode.innerHTML = '';
      var word = $s('#target-word').value.toLowerCase(); 
      var model = $s('#target-model').value;
      if (model == "both") {
        renderWordForModel(word, "word2vec", resultsNode);
        renderWordForModel(word, "openai", resultsNode);
      } else {
        renderWordForModel(word, model, resultsNode);
      }
    });
  }

  function renderWordForModel(word, model, resultsNode) {
    const wordVector = WORD_VECTORS[model][word];
      if (!wordVector) {
        resultsNode.innerHTML = 'No vector for that word. Try another.';
      } else {
        var simWords = VectorUtils.findSimilarWords(WORD_VECTORS[model], NUM_TO_SHOW, word);
        
        const resultTemplate = $s('#template-model-result');
        const resultTemplateClone = resultTemplate.content.cloneNode(true);
        resultTemplateClone.querySelector(".model-name").innerHTML = model;
        resultTemplateClone.querySelector(".vector").innerHTML = wordVector.toString().replaceAll(",", ", ");
        resultTemplateClone.querySelector(".vector-length").innerHTML = wordVector.length + " dimensions";
        renderSimilarities(resultTemplateClone.querySelector(".similar-vectors"), simWords);
        resultsNode.appendChild(resultTemplateClone);
      }
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
        $s('#target-word').value = sim[0];
        $s('#find-word-form').dispatchEvent(new Event('submit'));
      });
      wordCell.appendChild(wordLink);
      tr.appendChild(wordCell);
      const similarityCell = document.createElement('td');
      similarityCell.innerHTML = sim[1];
      tr.appendChild(similarityCell);
      domNode.appendChild(tr);
    });
  }

  function loadWordVectors(model) {
    // Fetch JSON files and store them in memory
    fetch(`data/${model}_1000.json`).then(function(response) {
      return response.json();
    }).then(function(json) {
      WORD_VECTORS[model] = json;
    }).catch(function(ex) {
      alert('Word list did not load! Please tell your local friendly developer.', ex);
    });
  }

  /********************
   * helper functions */
  function $s(id) { //for convenience
    if (id.charAt(0) !== '#') return false;
    return document.getElementById(id.substring(1));
  }

  return {
    init: initWordToVecDemo
  };
})();
    
window.addEventListener('load', VectorDemo.init);
