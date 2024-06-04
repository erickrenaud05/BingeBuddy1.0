const movieTitles = [];
var movies = JSON.parse(localStorage.getItem('top100'));
const event = new Event("loaded");

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