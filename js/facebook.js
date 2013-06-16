window.fbAsyncInit = function() {
  FB.init({
    appId      : AUTH.facebookAppID, // App ID
    channelUrl : '//minutes-android.dev/channel.html',
    status     : true,               // check login status
    cookie     : true,               // enable cookies to allow the server to access the session
    xfbml      : true                // parse page for xfbml or html5 social plugins like login button below
  });

  FB.Event.subscribe('auth.authResponseChange', function(response) {
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/all.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function publishOnFacebook(url) {
  FB.api(
    'https://graph.facebook.com/me/og.likes',
    'post',
    { object: url },
    function(response) {
      console.log(response);
    }
  );
}

$(document).on('reader:load', function(e, data) {
  publishOnFacebook(data.url);
});
