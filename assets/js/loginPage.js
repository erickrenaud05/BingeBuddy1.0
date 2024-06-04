var account = JSON.parse(localStorage.getItem('account'));
if(!account) {
    account = {
        name:  '',
        age: 0,
        username: ''
    };
    $('#loginForm').empty();
    createAccountForm();
} 

function createAccountForm(){
    const formEl = $('#loginForm');
    const formTitle = $('<h3>').addClass('px-0');
    const formUsernameInputLabel = $('<label>').addClass('form-label px-0').attr('for', 'username');
    const formUsernameInput = $('<input>').addClass('form-control').attr('id', 'username').attr('type', 'text');
    const formNameInputLabel = $('<label>').addClass('form-label px-0').attr('for', 'name');
    const formNameInput = $('<input>').addClass('form-control').attr('id', 'name').attr('type', 'text');
    const formAgeInputLabel = $('<label>').addClass('form-label px-0').attr('for', 'age');
    const formAgeInput = $('<input>').addClass('form-control').attr('id', 'age').attr('type', 'text');
    const formButton = $('<button>').addClass('btn btn-search my-3 col-6  mx-auto').attr('type', 'button');

    formTitle.text('Create account: ');
    formUsernameInputLabel.text('Username: ');
    formUsernameInput.attr('placeholder', 'none case-sensitive, used to login');
    formNameInputLabel.text('First name: ');
    formAgeInputLabel.text('Age: ');

    formButton.text('Create Account');
    formButton.attr('id', 'formSubmit');

    formEl.append(formTitle, formUsernameInputLabel, formUsernameInput, formNameInputLabel, formNameInput, formAgeInputLabel, formAgeInput, formButton);
}

$('#formSubmit').on('click', function(event){
    account.username = $('#username').val();
    account.name = $('#name').val();
    account.age = Number($('#age').val());

    for (var property in account) {
        if(!account[property]){
            alert('Please fill out entire form.');
            return 1;
        }
    }

    localStorage.setItem('account', JSON.stringify(account));
    window.location.replace('blogPage.html');
    return 0;
});

$('#login').on('click', function(event){
    const username = $('#username').val();
    if(!username) {
        alert('Please enter username');
        return;
    }

    if(username === account.username) {
        window.location.replace('blogPage.html');
    } else {
        alert('Please enter username used to create account.');
    }
});