const event = new Event("loaded");
const movieCardArea = $('#movieCardArea');
const inputList = $('.form-check-input');
const locationBtn = $('#btn-location');
const movieTitles = [];
const genres = [];
const state = {
    releaseCheck1: false,
    releaseCheck2: false,
    rateCheck1: false,
    rateCheck2: false
};
const searchFilters = [state, genres];
var movies = JSON.parse(localStorage.getItem('top100'));
var myLocation = JSON.parse(localStorage.getItem('location'))

if(!myLocation) {
    locationBtn.text('Add location');
    myLocation = {};
} else {
    locationBtn.text('Change Location');
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

$('#design').on('click', function(event) {
    window.location.replace('../index.html');
})

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

function randomizeBasedOnState() {
    const movieMatch = [];
    for (let movie of movies) {
        const genres = movie.genre
        if(genres.diff(searchFilters[1]).length === searchFilters[1].length) {
            movieMatch.push(movie);
        } 
    }

    if(movieMatch.length === 0) {
        alert('The genres you have selected do not match any movie. Heres 5 movies based on selected order!')
        for (let i = 0; i < 100; i++) {     
            movieMatch.push(movies[i])
        }
    } 

    if(state.releaseCheck1) {
        movieMatch.sort((a, b) => b.year - a.year);
    } else if(state.releaseCheck2) {
        movieMatch.sort((a, b) => a.year - b.year);
    } else if(state.rateCheck1) {
        movieMatch.sort((a, b) => b.rating - a.rating)
    } else if(state.rateCheck2) {
        movieMatch.sort((a, b) => a.rating - b.rating)
    }

    if(movieMatch.length > 5) {
        movieMatch.length = 5;
    }
  
    return movieMatch;
}

function locationSelect() {
    //two inputs from modal and set to local storage as location

    const countryName = $('#countryName').val();
    const cityName = $('#cityName').val();
    const countryCode = getCountryCode(countryName);

    if(!countryCode) {
        alert('Ensure that your spelling is correct, if spelling is correct, unfortunately, we do not offer randomize by weather in your area yet.')
        return 2;
    }

    if(!countryName || !cityName) {
        alert('location not updated, please fill out both section');
        return 1;
    }

    fetchCityInfo(cityName, countryCode);
}

function fetchCityInfo(cityName, countryCode) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${countryCode}&units=metric&appid=f33bf20affa316ba4d95961d5e07550c`)
    .then(function(response) {
        if(response.status === 200) {
            return response.json()
            .then(function(data){
                myLocation = data;
                localStorage.setItem('location', JSON.stringify(myLocation));
                return 0
            })
        } else {
            return 1
        }   
    }).then(function(err){
        var myModalEl = $('#location-modal');
        var modal = bootstrap.Modal.getInstance(myModalEl);
        if(err === 0){
            alert('location successfully updated');
            $('#closeBtn').text('close');
            modal.hide();
            return 0;
        } else if (err === 1) {
            alert('location not successfully updated. Please ensure city name and country are spelt correctly.');
            modal.hide();
            return 1;
        }
    })
    
}

function getCountryCode(countryName) {
    if(countryName.toLowerCase() === 'canada') {
        return 'CA'
    }

    if(countryName.toLowerCase() === 'china') {
        return 'CN'
    } 

    if(countryName.toLowerCase() === 'usa' || countryName.toLowerCase() === 'united states of america' || countryName.toLowerCase() === 'america') {
        return 'US'
    } 

    return null;
}

function randomizeBasedOnWeather() {
    const genreList = genreListBasedOnWeather(retrieveWeatherId());
    const movieMatch = [];
    const tmpMovieMatch = [];
    for (let movie of movies) {
        const genres = movie.genre
        if(genres.diff(genreList).length > 0) {
            movieMatch.push(movie);
        } 
    }

    if (movieMatch.length > 5) {      
        const randomNumbers = [];
        for (let i = 0; i < 5; i++) {    
            tmpMovieMatch.push(movieMatch[randomizeSelection(movieMatch.length, randomNumbers)])
        }
        return tmpMovieMatch;   
    }
    
    return movieMatch;
}

function genreListBasedOnWeather(id) {
    const genreSelection = [];
    if (id >= 500 && id < 531) {
        //rain
        genreSelection.push('Romance');
        genreSelection.push('Fantasy');
        genreSelection.push('Drama');
    } else if (id >= 801 && id < 805) {
        //clouds
        if(id === 801) {
            genreSelection.push('Family');
            genreSelection.push('Comedy');
        } else if(id === 802 || id == 803) {
            genreSelection.push('Animation');
            genreSelection.push('History');
            genreSelection.push('Mystery');
        } else if(id === 804) {
            genreSelection.push('Mystery');
            genreSelection.push('War');
            genreSelection.push('Crime');
        } 
    } else if (id >= 200 && id < 233) {
        //thunder
        genreSelection.push('Horror');
        genreSelection.push('Thriller');
        genreSelection.push('Drama');
    } else if (id === 800) {
        genreSelection.push('Family');
        genreSelection.push('Comedy');
    } 

    return genreSelection;
}

function retrieveWeatherId() { 
    if(myLocation) {
        if(dayjs().diff(dayjs(myLocation.list[0].dt_txt), 'h') < 0){
            return myLocation.list[0].weather[0].id;
        } else {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${myLocation.city.name},${myLocation.city.country}&units=metric&appid=f33bf20affa316ba4d95961d5e07550c`)
                .then(function(response) {
                    if(response.status === 200) {
                        return response.json()
                        .then(function(data){
                            myLocation = data;
                            localStorage.setItem('location', JSON.stringify(myLocation));
                            return 0
                        })
                    } else {
                        return 1
                     }
                }).then(function(errCode){
                    if(errCode === 0) {
                        console.log('good');
                        createMovieCards(randomizeBasedOnWeather())
                    } else {
                        console.log('Im very unsure why this happened')
                    }
                })   
            
        }
    }
}

$(document).ready(function(){
    document.addEventListener(
        "loaded",
        (e) => {
            var counter = 0;
            for (myMovie of movies) {
                movieTitles[counter] = myMovie.title;
                counter++;
            }
            
            createMovieCards(randomizeBasedOnFilter());

            $('#srchBtn').click(function(event){
                event.preventDefault();
                displayCardDetails($('#tags').val())
            })

            $( function() {
                $( function() {
                    $( "#tags" ).autocomplete({
                    source: movieTitles
                    });
                } );
            } );

            $('#btn-randomize-filter').click(function(event){
                var movieMatchSelect = false;

                for (var property in state) {
                    if (state[property]) {
                        movieMatchSelect = true;
                    } 
                }

                if(movieMatchSelect){
                    createMovieCards(randomizeBasedOnState());
                } else {
                    createMovieCards(randomizeBasedOnFilter());
                }
            })
            
            $('#submitBtn').click(function(event) {
                locationSelect();
            })

            $('#btn-randomize-weather').click(function(event){
                createMovieCards(randomizeBasedOnWeather());
            })

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