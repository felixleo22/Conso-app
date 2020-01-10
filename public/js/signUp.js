const email = document.getElementById('email').value;
const password1 = document.getElementById('password1').value;
const password2 = document.getElementById('password2').value;

if (password1 === password2) {
    const account = {};
    account.email = email;
    // hacher le password
} else {
    alert('mot de passe différent');
}
