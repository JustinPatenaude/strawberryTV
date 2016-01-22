// var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
// var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
// var SCOPE       =   'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive';
// var CLIENTID    =   '397849418785-4aqfsk8kpeuu36eapp0k5cqkk8di4u9o.apps.googleusercontent.com';
// var REDIRECT    =   'http://justinpatenaude.github.io/strawberryTV/'
// var LOGOUT      =   'http://accounts.google.com/Logout';
// var TYPE        =   'token';
// var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
// var acToken;
// var tokenType;
// var expiresIn;
// var user;
// var loggedIn    =   false;

(function($, window, document) {
    var url = 'https://api.themoviedb.org/3/',
        mode = 'search/multi',
        input,
        movieName,
        key = '&api_key=f9060b0815c54d485f9548181eef3918',
        img_url = "http://image.tmdb.org/t/p/w500",
        no_poster = "no-poster.png";

    $('.search-form').on('submit', function(e) {
        var input = $('input[name="q"]').val(),
            movieName = encodeURI(input);
        e.preventDefault();
        $('.movie-list').html('');
        $.ajax({
            type: 'GET',
            url: url + mode + '?query='+movieName + key,
            async: false,
            jsonpCallback: 'testing',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                console.log(json);
                $.each(json.results, function(show){
                    if(this.media_type == "tv" || this.media_type == "movie"){
                        if(this.poster_path != null){
                            var thePoster = img_url+this.poster_path
                        }
                        else {
                            var thePoster = no_poster;
                        }
                        if(this.media_type == 'tv'){
                            var theIcon = '<i class="fa fa-tv"></i>',
                                theTitle = this.name,
                                theDate = this.first_air_date.split('-'),
                                theDate = theDate[0];
                        }
                        else {
                            var theIcon = '<i class="fa fa-film"></i>',
                                theTitle = this.title,
                                theDate = this.release_date.split('-'),
                                theDate = theDate[0];
                        }
                        $('.movie-list').append('<div class="grid-item"><div class="movie" data-image="'+thePoster+'" data-title="'+theTitle+'" data-year="'+theDate+'">\
                            <div class="movie-icon">'+theIcon+'</div>\
                            <div class="movie-image" style="background-image: url('+thePoster+')"></div>\
                            <div class="movie-title"><h2>'+theTitle+'<span class="movie-date">'+theDate+'</span></h2></div>\
                            <div class="movie-description"><p>'+this.overview+'</p></div>\
                            </div></div>');
                    }
                });
            },
            error: function(e) {
                console.log(e.message);
            }
        });
    });

    $('body').on('click', '.movie', function(){
        var clickedTitle = $(this).attr('data-title'),
            clickedImage = $(this).attr('data-image'),
            clickedYear = $(this).attr('data-year');
        console.log('Title: '+clickedTitle+' | Year: '+clickedYear+' | Image: '+clickedImage);
    });

    $('#login').click(function(){
        login();
    });

    $('#logout').click(function(){
        myIFrame.location='https://www.google.com/accounts/Logout';
        startLogoutPolling();
        return false;
    });

    function login() {
        var win         =   window.open(_url, "windowname1", 'width=800, height=600'); 

        var pollTimer   =   window.setInterval(function() { 
            try {
                console.log(win.document.URL);
                if (win.document.URL.indexOf(REDIRECT) != -1) {
                    window.clearInterval(pollTimer);
                    var url =   win.document.URL;
                    acToken =   gup(url, 'access_token');
                    tokenType = gup(url, 'token_type');
                    expiresIn = gup(url, 'expires_in');
                    win.close();

                    validateToken(acToken);
                }
            } catch(e) {
            }
        }, 500);
    }

    function validateToken(token) {
        $.ajax({
            url: VALIDURL + token,
            data: null,
            success: function(responseText){  
                getUserInfo();
                loggedIn = true;
                $('.login').hide();
                $('.logout').show();
            },  
            dataType: "jsonp"  
        });
    }

    function getUserInfo() {
        $.ajax({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
            data: null,
            success: function(resp) {
                console.log(resp);
                user    =   resp;
                console.log(user);
                var url = 'https://spreadsheets.google.com/feeds/spreadsheets/private/full?access_token=' + acToken;
                $.get(url, function(data) {
                    console.log(data);
                });
            },
            dataType: "jsonp"
        });
    }

    //credits: http://www.netlobo.com/url_query_string_javascript.html
    function gup(url, name) {
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\#&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        if( results == null )
            return "";
        else
            return results[1];
    }

    function startLogoutPolling() {
        $('.login').show();
        $('.logout').hide();
        loggedIn = false;
        $('#uName').text('Welcome ');
        $('#imgHolder').attr('src', 'none.jpg');
    }

}(window.jQuery, window, document));