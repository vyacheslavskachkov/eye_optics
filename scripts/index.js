'use strict';

let textMask;

document.addEventListener('DOMContentLoaded', () => {
    let text = document.querySelector('.svg-text');
    document.querySelector('.header-container').setAttribute('color', 'light');
    document.querySelector('.adaptive-menu-items').setAttribute('invert-color', '');
    textMask = text.cloneNode(true);
    text.classList.add('blur');
    textMask.classList.add('mask');
    text.after(textMask);
    if (window.innerWidth < 520) {
        document.querySelector('.main-container').remove();
        document.body.innerHTML = ''; // <- INSERT CODE SVG -----------------------------------
        setTimeout(window.location.href = 'home.html', 1100);
    } else document.querySelector('.glass-container').addEventListener('animationend', () =>
        document.querySelectorAll('.header-container, .standart-button').forEach(element =>
            element.classList.add('show-control')));
});

document.querySelector('.text-container').addEventListener('animationend', () => {
    let property = window.getComputedStyle(textMask).maskImage || window.getComputedStyle(textMask).webkitMaskImage;
    playbackAnimation({
        duration: 400,
        timing: progress => progress,
        draw: progress => {
            let string = property.replaceAll('300', 300 - 200 * progress);
            textMask.style.cssText = `mask-image: ${string}; -webkit-mask-image: ${string}`;
        }
    });
});

document.querySelector('.glass-container').addEventListener('animationend', () => {
    let style = textMask.getAttribute('style'),
        maskRect = textMask.getBoundingClientRect();
    document.querySelector('.text-container').addEventListener('mousemove', event =>
        textMask.style.cssText = style.replace(';', replaceSumbol(event.clientX - maskRect.left, event.clientY - maskRect.top, '#000', 30, 50)));
});

document.querySelector('.standart-button').addEventListener('click', event => {
    let style = textMask.getAttribute('style'),
        maskWidth = textMask.clientWidth;
    event.preventDefault();
    document.body.classList.add('run-animation');
    document.querySelector('.line').addEventListener('transitionend', () => {
        document.querySelector('.text-container').classList.add('hide-container');
        changeMenuColor(event, true);
    }, { once: true });
    playbackAnimation({
        duration: 500,
        timing: progress => progress,
        draw: progress =>
            textMask.style.cssText = style.replace(';', replaceSumbol(maskWidth / 2, textMask.clientHeight / 2, `rgba(0, 0, 0, ${1 * progress})`, maskWidth, maskWidth))
    });
});

document.querySelectorAll('.navigation-container a').forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        item.classList.add('current-menu-item');
        changeMenuColor(event, false);
    });
});

function changeMenuColor(event, delay) {
    let background = document.createElement('div');
    background.className = 'menu-background';
    if (!delay) {
        document.querySelector('.header-container').setAttribute('color', 'dark');
        document.querySelector('.main-container').classList.add('hide-content')
        setTimeout(() => window.location.href = event.target.href, 400);
    } else {
        background.addEventListener('animationend', () => {
            let header = document.querySelector('.header-container');
            document.querySelector('.menu-item').classList.add('current-menu-item');
            header.removeAttribute('color');
            header.style.opacity = 1;
            setTimeout(() => window.location.href = event.target.href, 100);
        });
    }
    document.body.append(background);
}

function playbackAnimation({ duration, timing, draw }) {
    let startTime = null,
        progress = 0,
        animate = currentTime => {
            if (!startTime)
                startTime = currentTime;
            progress = (currentTime - startTime) / duration;
            progress > 1 ? progress = 1 : requestAnimationFrame(animate);
            draw(timing(progress));
        };
    requestAnimationFrame(animate);
}

function replaceSumbol(...args) {
    let string = ', radial-gradient(circle at *px *px, * *px, transparent *px);';
    for (let arg of args)
        string = string.replace('*', arg);
    return string;
}