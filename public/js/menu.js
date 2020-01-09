window.addEventListener('DOMContentLoaded', () => {
    // Si format téléphone, alors on cache
    const btnMenu = document.getElementsByClassName('menu-large');

    for (let i = 0; i < btnMenu.length; i += 1) {
        btnMenu[i].style.display = 'none';
    }
    document.getElementById('menu-replie').addEventListener('click', () => {
        if (btnMenu[0].style.display === 'none') {
            for (let i = 0; i < btnMenu.length; i += 1) {
                btnMenu[i].style.display = 'block';
            }
        } else {
            for (let i = 0; i < btnMenu.length; i += 1) {
                btnMenu[i].style.display = 'none';
            }
        }
    });
});
