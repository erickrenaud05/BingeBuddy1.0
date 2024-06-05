var myModal = $('#reviewModal');
const modal = new bootstrap.Modal(myModal);

var reviewList = JSON.parse(localStorage.getItem('reviews'));
if(!reviewList) {
    reviewList = [];
}

$( "#movieTitle" ).autocomplete({
    source: movieTitles
});

function createReview(details) {
    const cardEL = $('<div>').addClass('card m-2');
    const cardTextArea = $('<div>').addClass('card-body p-0');
    const cardTitle = $('<h3>').addClass('card-text border-bottom cardTitle p-2').text(details.title);
    const cardDescription = $('<p>').addClass('card-text p-2').text(details.description);
    const cardFooter = $('<div>').addClass('card-footer row row-cols-md-4 row-cols-xs-1 justify-content-between m-0');
    const cardAuthor = $('<h4>').addClass('card-title col-md-6').text(details.author);
    const cardDel = $('<button>').addClass('btn btn-search btn-del col-xs-2').text('Delete');

    cardDel.attr('type', 'submit');
    cardDel.attr('id', details.title);
    cardEL.append(cardTextArea);
    cardFooter.append(cardAuthor, cardDel);
    cardTextArea.append(cardTitle, cardDescription, cardFooter);
    $('#blogArea').append(cardEL);

    $(cardDel).on('click', function(event){
        const confirmation = confirm('If you wish to delete this post, press ok. This action is irreversible. Press cancel to cancel');
        if(confirmation){
            var counter = 0;
            for (var reviews of reviewList) {
                if(event.target.id === reviews.title){
                    reviewList.splice(counter, 1);
                    localStorage.setItem('reviews', JSON.stringify(reviewList));
                    window.location.replace('');
                    return;
                }
                counter++;
            }
        }
    });
}

function displayReviews() {
    for (var reviews of reviewList) {
        createReview(reviews);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$(document).ready(function(event){
    displayReviews();
    const account = JSON.parse(localStorage.getItem('account'));

    $('#username').text(capitalizeFirstLetter(account.name));
    $('#reviewSubmitBtn').on('click', function(){
        const newReview = {
            title: '',
            description: '',
            author: ''
        };

        newReview.title = $('#movieTitle').val();
        newReview.description = $('#description').val();
        newReview.author = capitalizeFirstLetter(account.name); //username pulled from localStorage
        for (let property in newReview) {
            if(!newReview[property]){
                console.log(newReview[property])
                alert('Please fill out entire form');
                return 1
            } 
        }
        for(var review of reviewList){
            if(review.title ===  newReview.title){
                alert(`You already have a review for ${newReview.title}, please enter a new title, or delete the old review`);
                return 2;
            }
        }
        $('#movieTitle').val('');
        $('#description').val('');
        modal.toggle()
        reviewList.push(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviewList));
        createReview(newReview);
    });

    $('#blogCloseBtn').on('click', function(event) {
        $('#movieTitle').val('');
        $('#description').val('');
    });

})