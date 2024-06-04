const movieTitles = [];
var movies = JSON.parse(localStorage.getItem('top100'));
const event = new Event("loaded");
const movieCardArea = $('#movieCardArea');

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

$(document).ready(function(){
    document.addEventListener(
        "loaded",
        (e) => {
            
        },
        false,
    );
})