'use strict'

window.addEventListener('resize', resetSliderPosition);

menu.onclick = () => document.addEventListener('click', showMenu);

// Main menu display function
function showMenu(e) {
    let menu = document.querySelector('.adaptive-menu-items');
    if (window.getComputedStyle(menu).display == 'none')
        menu.classList.add('show-menu');
    else if (e.target.parentNode != menu && e.target != menu) {
        menu.classList.remove('show-menu');
        document.removeEventListener('click', showMenu);
    }
}

// Function to reset slider position when window is resized
function resetSliderPosition() {
    let galleries = document.querySelectorAll('.gallery');
    for (let i = 0; i < galleries.length; i++)
        if (galleries[i].style.transform.match(/-?(\d+\.\d+)|-?\d+/g) != 0) {
            galleries[i].style.transform = 'translate(0px)';
            document.removeEventListener('resize', resetSliderPosition);
        }
}

// Event handler for moving slider elements to the left
function toLeft(sender) {
    let slider = sender.parentNode,
        gallery = slider.querySelector('.gallery'),
        images = gallery.querySelectorAll('.image-container'),
        position = +gallery.style.transform.match(/-?(\d+\.\d+)|-?\d+/g),
        imageWidth = +window.getComputedStyle(images[0]).width.match(/(\d+\.\d+)|\d+/g),
        shift = -(imageWidth + Number(window.getComputedStyle(images[0]).marginRight.match(/\d+/g)));
    if (position === 0)
        gallery.style.transform = `translate(${shift * (images.length - Math.round(slider.clientWidth / images[0].clientWidth))}px)`;
    else gallery.style.transform = `translate(${position - shift}px)`;
}

// Event handler for moving slider elements to the right
function toRight(sender) {
    let slider = sender.parentNode,
        gallery = slider.querySelector('.gallery'),
        images = gallery.querySelectorAll('.image-container'),
        position = +gallery.style.transform.match(/-?(\d+\.\d+)|-?\d+/g),
        imageWidth = +window.getComputedStyle(images[0]).width.match(/(\d+\.\d+)|\d+/g),
        shift = -(imageWidth + Number(window.getComputedStyle(images[0]).marginRight.match(/\d+/g)));
    if (position === shift * (images.length - Math.round(slider.clientWidth / images[0].clientWidth)))
        gallery.style.transform = 'translate(0px)';
    else gallery.style.transform = `translate(${position + shift}px)`;
}