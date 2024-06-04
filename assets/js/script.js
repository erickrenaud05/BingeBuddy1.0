const movieTitles = [];
var movies = JSON.parse(localStorage.getItem('top100'));
const event = new Event("loaded");
const movieCardArea = $('#movieCardArea');
const inputList = $('.form-check-input');
const genres = [];
const state = {
    releaseCheck1: false,
    releaseCheck2: false,
    rateCheck1: false,
    rateCheck2: false
};
const searchFilters = [state, genres];

function displayMovieCards(movie) {
    
    const movieCardEl = $('<div>').addClass('movieCard row col-lg-2 col-md-3 col-sm-4 m-2 align-content-start');
    const movieCardBody = $('<div>').addClass('movieCard justify-content-center card-body bg-dark text-white').attr('style', 'height: 125px');
    const movieCardTitle = $('<h5>').addClass('movieCard card-title user-select-none').text(movie.title);
    movieCardBody.css('background-image', 'url('+movie.image+')');
    movieCardBody.attr('id', movie.title);

    movieCardEl.append(movieCardBody, movieCardTitle);
    movieCardArea.append(movieCardEl);

    $('.movieCard').click(function(event){
        displayCardDetails(event.target.id)
    })
}

function createMovieCards(randomizeSelection) {
    movieCardArea.empty();
    movieMatch = randomizeSelection;

    for (let i = 0; i < movieMatch.length; i++) {    
        displayMovieCards(movieMatch[i]);
    }
}

function randomizeBasedOnFilter() {
    const movieMatch = [];
    const tmpMovieMatch = [];
    for (let movie of movies) {
        const genres = movie.genre
        if(genres.diff(searchFilters[1]).length === searchFilters[1].length) {
            movieMatch.push(movie);
        } 
    }

    if(movieMatch.length === 0) {
        const randomNumbers = [];
        for (let i = 0; i < 5; i++) {     
            movieMatch.push(movies[randomizeSelection(100, randomNumbers)])
        }
        alert('The genres you have selected do not match any movies. Heres 5 random movies!')
    } else if (movieMatch.length > 5) {      
        const randomNumbers = [];
        for (let i = 0; i < 5; i++) {    
            tmpMovieMatch.push(movieMatch[randomizeSelection(movieMatch.length, randomNumbers)])
        }
        return tmpMovieMatch;
    }
    return movieMatch;
}

function randomizeSelection(length, randomNumbers) {
    var x = Math.floor(Math.random()*length);
    while(randomNumbers.includes(x)) {
        x = Math.floor(Math.random()*length);
    }
    randomNumbers.push(x);
    return x;
}

// This section of code is from jeremy anwsering a question on stackOverflow
Array.prototype.diff = function(arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for(var i = 0; i < this.length; i += 1) {
        if(arr2.indexOf(this[i]) > -1){
            ret.push(this[i]);
        }
    }
    return ret;
};

function displayCardDetails(movieName){
    const movieDetailArea = $('#movieCardDetails');
        movieDetailArea.empty();
        for (let movie of movies) {
            if(movie.title === movieName) {             
                const movieTitle = $('<h2>').text(movie.title).addClass('my-2');
                const movieDescription = $('<p>').text(movie.description);

                const movieExtraInfoContainer = $('<div>').addClass('container row');
                const movieThumbnail = $('<img>').attr('src', movie.image).addClass('col-sm-5 col-12');

                const movieAllOtherInfo = $('<div>').addClass('col-sm-4 col-12');

                const movieGenres = $('<div>');
                const movieGenresTitle = $('<h3>').text('Genres: ');

                const releaseArea = $('<div>');
                const releaseAreaTitle = $('<h3>').text('Release Date: ');
                const releaseDate = $('<h4>').text(movie.year).addClass('py-1');

                movieGenres.append(movieGenresTitle);
                for(let genres of movie.genre) {
                   const genre = $('<h4>').text(genres).addClass('py-1');
                   movieGenres.append(genre);
                }

                const movieRatingArea = $('<div>').addClass('py-1');
                const movieRatingTitle = $('<h3>').text('Rating: ');
                const movieRating = $('<h4>').text(movie.rating + '/10');

                releaseArea.append(releaseAreaTitle, releaseDate);
                movieRatingArea.append(movieRatingTitle, movieRating);
                movieAllOtherInfo.append(movieGenres, movieRatingArea, releaseArea);
                movieExtraInfoContainer.append(movieThumbnail, movieAllOtherInfo);
                movieDetailArea.append(movieTitle, movieDescription, movieExtraInfoContainer);
            }
        }    
}

$(document).ready(function(){
    document.addEventListener(
        "loaded",
        (e) => {
            createMovieCards(randomizeBasedOnFilter());

            inputList.click(function(event){
                for(let input of inputList) {
                    if (input.id === event.target.id)
                        if(input.checked){
                            if(input.id === 'releaseCheck1' || input.id === 'releaseCheck2' || input.id === 'rateCheck1' || input.id === 'rateCheck2') {
                                for (var property in state) {            
                                    if(property !== input.id) {
                                        state[property] = false;
                                    } else {
                                        state[property] = true;
                                    }
                                }
                            } else {
                                searchFilters[1].push(input.id);
                            }
                        } else {
                            if(input.id === 'releaseCheck1' || input.id === 'releaseCheck2' || input.id === 'rateCheck1' || input.id === 'rateCheck2') {
                                for (var property in state) {            
                                    state[property] = false;
                                }
                            }
                            for (let filter of searchFilters[1]){
                                if(filter === input.id) {
                                    searchFilters[1].splice(searchFilters[1].indexOf(filter), 1);
                                }
                            }
                        }
                    }
                for (var input of inputList) {
                    for (var property in state) {
                        if (input.id === property) {
                            input.checked = state[property]
                        }
                    }
                }
            })
        },
        false,
    );

    if(!movies){
        const url = 'https://imdb-top-100-movies.p.rapidapi.com/';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '0868ce6b49msh450c6495f98bfedp12ac44jsn4f7ca80908e2',
                'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com'
            }
        };
        fetch(url, options)
            .then(function(response){
                return response.json()
            })
            .then(function(data){
                localStorage.setItem('top100', JSON.stringify(data));
                movies = JSON.parse(localStorage.getItem('top100'));
                document.dispatchEvent(event);
            })
    } else {
        document.dispatchEvent(event);
    }
})