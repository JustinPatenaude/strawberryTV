(function($, window, document) {
    var movieList = $('.movie-list');
    $('.search-form').on("submit", function(e) {
        console.log('hello');
        var form = $(this);
        e.preventDefault();
        $.ajax({
            url: "http://imdb.wemakesites.net/api/search",
            data: form.serialize(),
            crossDomain: true,
            dataType: "jsonp",
            success: function(json) {
                window.console.log(json);
                var titles_to_get = json.data.results.titles.length;
                var titles_loaded = 1;
                console.log(json.data.results.titles.length);
                $.each(json.data.results.titles, function(index){
                    $.ajax({
                        url: "http://imdb.wemakesites.net/api/" + this.id,
                        crossDomain: true,
                        dataType: "jsonp",
                        success: function(json2) {
                            window.console.log(json2);
                            $('.movie-list').append('<div class="movie">\
                                <div class="movie-image" style="background-image: url('+json2.data.image+')"></div>\
                                <div class="movie-title"><h2>'+json2.data.title+'</h2></div>\
                                <div class="movie-description"><p>'+json2.data.description+'</p></div>\
                                </div>');
                            if(titles_loaded==titles_to_get){
                                check_images();
                            }
                            titles_loaded++;
                        }
                    });
                })
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    function check_images(){
        $('.movie-image img').each(function(){
            var imgHeight = $(this).height();
            var imgWidth = $(this).width();
            var ratio = imgHeight / imgWidth;
            console.log('ratio values: '+imgHeight+' + '+imgWidth);
            console.log('ratio: '+ratio);
            if(ratio < 1.45){
                $(this).attr('src', 'http://placehold.it/214x320');
            }
        });
    }
}(window.jQuery, window, document));