const fetch = require('node-fetch');

const emailValue = document.getElementById('email').value;
const password1 = document.getElementById('password1').value;
const password2 = document.getElementById('password2').value;

if (password1 === password2) {
    const user = {
        email: emailValue,
        password: password1,
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    };

    fetch('/api/signIn/', options)
        .then((res) => res.json())
        .then((res) => console.log(res));
    // envoyer les données à l'api
} else {
    alert('mot de passe différent');
}
