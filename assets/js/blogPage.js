var reviewList = JSON.parse(localStorage.getItem('reviews'));
if(!reviewList) {
    reviewList = [];
}

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
