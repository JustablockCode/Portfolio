// Fetch GitHub star counts for repos marked with data-repo="owner/repo"
// Replaces the element's text with "★ N" once the fetch resolves.

(function () {
  'use strict';

  var OWNER = 'JustablockCode';

  function fetchStars(repoName) {
    return fetch('https://api.github.com/repos/' + OWNER + '/' + repoName, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && typeof d.stargazers_count === 'number') {
          return d.stargazers_count;
        }
        return null;
      })
      .catch(function () { return null; });
  }

  function fillStars() {
    var els = document.querySelectorAll('[data-repo]');
    els.forEach(function (el) {
      var repo = el.getAttribute('data-repo');
      if (!repo) return;
      fetchStars(repo).then(function (count) {
        if (count !== null) {
          el.textContent = '★ ' + count;
        } else {
          el.textContent = '★ 0';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillStars);
  } else {
    fillStars();
  }
})();
