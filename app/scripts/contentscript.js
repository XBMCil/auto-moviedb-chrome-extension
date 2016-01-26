'use strict';
/*global $*/

var triggerKey = 90; //ASCII key code for the letter 'Z'
var contentScriptMessage = 'Skinner Said the teachers will crack any minute';

function doKeyPress(e) {
  if (e.shiftKey && e.ctrlKey && e.keyCode === triggerKey) {
    chrome.extension.sendRequest({message: contentScriptMessage});
  }
}

if (window === top) {
  window.addEventListener('keyup', doKeyPress, false);
}

function getMovie(callback) {
  console.log('calling getMovie');
  chrome.extension.sendRequest({action: 'getMovie'}, callback);
}

function markAsDone(callback) {
  console.log('calling markAsDone');
  chrome.extension.sendRequest({action: 'markAsDone'}, callback);
}



function handleUrl(movie) {
  if (location.pathname.match(new RegExp('/movie/' + movie.ID + '$'))) {
    $('button.new.translate.green').click();
  }
  else if (!location.pathname.match(new RegExp('movie/' + movie.ID + '[^/]*/edit'))) {
    location.href = movie.URL + '#primary_facts_form';
  }

  return $.when();
}

function htmlDecode(value) {
  return $('<div/>').html(value).text();
}

function handleForm(movie) {
  if ($('#primary_facts_form').length) {
    var title = htmlDecode(movie.TITLE);
    var plot = htmlDecode(movie.PLOT);
    var storyline = htmlDecode(movie.STORYLINE);
    $('#he_translated_title').val($('#he_translated_title').val() || title).css('direction', 'rtl');
    $('#he_overview').val($('#he_overview').val() || plot).css('direction', 'rtl');
    $('#he_tagline').val($('#he_tagline').val() || storyline).css('direction', 'rtl');
    var markAsDoneButton = $('<button type="button" id="mark-as-done" style="float:right;margin-top: 20px;margin-right: 10px;">Mark as Done</button>')
      .on('click', function () {
        markAsDone(init);
      });

    if (!$('#mark-as-done').length) {
      $('input#submit')
        .after(markAsDoneButton);
    }
  }
}

function init() {
  getMovie(function (movie) {
    handleUrl(movie)
      .then(handleForm(movie));
  });
}

$(document).ready(function () {
  init();
});
