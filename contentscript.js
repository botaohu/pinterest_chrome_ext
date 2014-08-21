function replacePlayerWithAPI() {
  var comment = $('.closeupContentSection .addCommentForm textarea');
  var domain = $('.closeupContentSection div.pinDomain.pinCloseupSeoText').text();
  if (domain == 'vimeo.com') {     
    var player_iframe = $('.vimeo iframe');
    var player_url = player_iframe.attr('src');
    if (player_url && !player_url.match(/api=/)) {
      player_iframe.attr('src', player_url + '&api=1');
    }
  } else if (domain == 'youtube.com') {
    var player_iframe = $('.youtube iframe');
    var player_url = player_iframe.attr('src');
    if (player_url && !player_url.match(/enablejsapi=/)) {
      player_iframe.attr('src', player_url.replace('http://', 'https://') + '&enablejsapi=1');
    }
  }
}
function convertSecondsToTime(n) {
  var minutes = Math.floor(n / 60); 
  var seconds = Math.floor(n % 60);
  return minutes + ":" + (seconds <= 9 ? '0' + seconds : seconds);
}

function youtubeAction(ytplayer, comment) {
  var value = ytplayer.getCurrentTime();
  ytplayer.pauseVideo();
  comment.val('[' + convertSecondsToTime(value) + '] ');
}
var ytplayer = null;
var changing = false;

function docChanged(e) {
  if (changing)
    return;
  changing = true;
  if (document.URL.match(/\/pin\/\d+/)) {
    replacePlayerWithAPI();

    //Resort the comments
    console.log('call');

    var userComments = $('.closeupContentSection .PinCommentList');
    var commentBox = $('.pinUserCommentBox', userComments);
    var container = $('.commentsContainer', userComments);
    commentBox.insertBefore(container);
    $('ul li', container).sort(function(a,b){
       return - parseInt(a.dataset.index) + parseInt(b.dataset.index);
    }).appendTo($('ul', container));

    var comment = $('.closeupContentSection .addCommentForm textarea');
    comment.focus(function () {
      if (comment.val() != '') {
        return;
      }
      var domain = $('.closeupContentSection div.pinDomain.pinCloseupSeoText').text();
      if (domain == 'vimeo.com') {     
        var player_iframe = $('.vimeo iframe');
        if (player_iframe.length > 0) {
          var player = $f(player_iframe[0]);
          player.api('pause');
          player.api('getCurrentTime', function(value) {
            comment.val('[' + convertSecondsToTime(value) + '] ');
          });
        }
      } else if (domain == 'youtube.com') {
        var player_iframe = $('.youtube iframe');
        
        if (!ytplayer) {
          var aa = new YT.Player(player_iframe.get(0), 
            { events: { 
              'onReady': function (e) {
                  ytplayer = e.target;
                  youtubeAction(ytplayer, comment);
                }
              }
            }
          );
        } else {
          youtubeAction(ytplayer, comment);
        }
       
      } else {
      }
   //   var msg = $('.addCommentForm textarea').val();
//      if (msg == '') {

//      }
    });
  }
  changing = false;
}


document.addEventListener("DOMNodeInserted", docChanged, false);