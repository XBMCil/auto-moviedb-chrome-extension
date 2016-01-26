'use strict';
/*global $*/

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

$(document).ready(function() {
  $.ajaxSetup({ cache: false });
});

var api = 'http://api.thewiz.info/autotmdb.php';

var Helper = (function () {
  function Helper(url) {
    this.url = url;
  }

  Helper.prototype.getMovie = function (cb) {
    var _this = this;
    if (this.movie) {
      cb(this.movie);
    }
    else {
      $.getJSON(this.url).then(function (movie) {
        _this.movie = movie;
        cb(movie);
      });
    }
  };

  Helper.prototype.markAsDone = function (cb) {
    if (this.movie) {
      $.get(this.url + '?id=' + this.movie.ID);
      this.movie = null;
    }

    cb();
  };
  return Helper;
})();

var helper = new Helper(api);

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  helper[request.action](sendResponse);
});