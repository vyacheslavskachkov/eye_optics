// numberOfRows - the number of product units displayed on the page when it is loaded
let numberOfRows = 9,
    unitsShown = 0,
    isAdaptive = false,
    data;

window.addEventListener('resize', setCurrentItem);
window.addEventListener('DOMContentLoaded', setCurrentItem);

// Event handler to show footer and button after loading page content
window.addEventListener('load', () => {
    let footer = document.querySelector('footer');

    // document.getElementById('more').style.display = 'block';
    if (footer.getBoundingClientRect().top < document.body.clientHeight)
        footer.classList.add('appearance-footer');
    else footer.style.visibility = 'visible';
});

// Event handler to determine the current submenu item
document.addEventListener('DOMContentLoaded', () => {
    let items = document.querySelectorAll('.submenu-item');

    for (let i = 0; i < items.length; i++) {
        if (items[i].getAttribute('href').split('.')[0] == window.location.pathname.replace('/', '').split('.')[0]) {
            items[i].classList.add('current-item');
            break;
        }
    }
});

// Event handler to load json file
document.addEventListener('DOMContentLoaded', async () => {
    let pathname = window.location.pathname,
        position = pathname.lastIndexOf('/');
    data = await (await fetch(`json${pathname.substring(position).split('.')[0]}.json`)).json();
    if (data.length > 0)
        createUnit(data);
});

// Function for getting and drawing a unit of production
function createUnit(units) {
    let container = document.querySelector('.products-container'),
        element = '';

    while (unitsShown <= units.length) {
        element += `<div class="image-container equilateral-image-container">
            <img src="images/catalog/${units[unitsShown]['File name']}" alt="${units[unitsShown]['File name']}">
            <div class="banner dynamic-banner text-banner">
                <button id="expand" type="button" onclick="expand(this)">
                    <svg class="arrow-expand" xmlns="http://www.w3.org/2000/svg" width="12" height="22" viewBox="0 0 12 22">
                        <style>.cls-1{fill:#f8f8f8;}</style>
                        <polygon class="cls-1" points="12 11 1.41 0 0 1.37 9.27 11 0 20.63 1.41 22 12 11"/>
                    </svg>
                </button>`;
        for (let value in units[unitsShown]) {
            switch (value) {
                case 'Manufacturer':
                    element += `<p class="title">${units[unitsShown][value]}</p>`;
                    break;
                case 'Model':
                    element += `<p class="subtitle">${units[unitsShown][value]}</p><div class="unit-info">`;
                    break;
                case 'Price':
                    element += `</div><p class="price">${units[unitsShown][value]}</p>`;
                    break;
                case 'File name':
                    continue;
                default:
                    element += `<p class="subtitle">${value}: ${units[unitsShown][value]}</p>`;
                    break;
            }
        }
        element += '</div></div></div>';
        unitsShown++;
        if (unitsShown != 0 && unitsShown % numberOfRows == 0) {
            document.getElementById('more').style.display = 'block';
            container.innerHTML += element;
            break;
        }
        if (unitsShown == units.length) {
            document.getElementById('more').style.display = 'none';
            container.innerHTML += element;
            break;
        }
    }
}

// Handler for the event of clicking on the arrow of the banner (the element was generated in createUnit())
function expand(sender) {
    sender.parentNode.classList.toggle('expand-banner');
    sender.querySelector('.arrow-expand').classList.toggle('arrow-rotation');
}

more.onclick = () => {
    document.querySelector('style').innerHTML += `.rectangle { position: absolute; bottom: 0; height: 650px; width: 100%; background-color: #f8f8f8; z-index: 20; animation: rectangle .8s ease forwards; }
        @keyframes rectangle { 0%, 10% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } }`;
    document.querySelector('.appearance-footer').innerHTML += `<div class="rectangle"></div>`;
    createUnit(data);
}

// A function that controls the position of submenu elements and navigation elements on it
function setCurrentItem() {
    if (window.innerWidth <= 768 && !isAdaptive) {
        let submenu = document.querySelector('.submenu'),
            items = document.querySelectorAll('.submenu-item'),
            position;

        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('current-item')) {
                submenu.style.transform = `translateX(${position = -submenu.clientWidth * i}px)`;
                break;
            }
        }
        navVisibility(position, -submenu.clientWidth * (items.length - 1));
        isAdaptive = true;
    } else if (window.innerWidth > 768 && isAdaptive) {
        let submenu = document.querySelector('.submenu');

        document.querySelector('.previous').classList.remove('show');
        document.querySelector('.next').classList.remove('show');
        submenu.classList.remove('animate');
        submenu.style.transform = `translateX(0px)`;
        isAdaptive = false;
    }
}

// A function that displays the necessary submenu navigation elements
function navVisibility(position, maxPosition) {
    switch (position) {
        case 0:
            document.querySelector('.previous').classList.remove('show');
            document.querySelector('.next').classList.add('show');
            break;
        case maxPosition:
            document.querySelector('.previous').classList.add('show');
            document.querySelector('.next').classList.remove('show');
            break;
        default:
            document.querySelector('.previous').classList.add('show');
            document.querySelector('.next').classList.add('show');
    }
}

// Function of smooth transition through submenu items
function browseСategories(sender) {
    let submenu = document.querySelector('.submenu'),
        position = +submenu.style.transform.match(/-?(\d+\.\d+)|-?\d+/g),
        items = document.querySelectorAll('.submenu-item');

    if (!submenu.classList.contains('animate'))
        submenu.classList.add('animate');
    if (sender.classList.contains('previous'))
        submenu.style.transform = `translateX(${position += submenu.clientWidth}px)`;
    else
        submenu.style.transform = `translateX(${position -= submenu.clientWidth}px)`;
    navVisibility(position, -submenu.clientWidth * (items.length - 1));
}
