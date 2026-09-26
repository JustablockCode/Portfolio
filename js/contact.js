const contactBtn = document.getElementById('contact-btn');
const contactMenu = document.getElementById('contact-menu');

contactBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    contactMenu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!contactMenu.contains(e.target) && !contactBtn.contains(e.target)) {
        contactMenu.classList.remove('open');
    }
});
