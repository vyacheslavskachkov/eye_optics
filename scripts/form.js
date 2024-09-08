let disable;

// Registering event handlers after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', sendForm);
    let input = document.querySelectorAll('input');
    for (let count = 0; count < input.length; count++) {
        input[count].addEventListener('focus', onFocus);
        input[count].addEventListener('blur', onBlur);
    }
});

// Button click event handler for displaying the form
show_form.onclick = function () {
    let formBackground = document.querySelector('.form-background');
    if (formBackground.classList.contains('hide-form-background'))
        formBackground.classList.remove('hide-form-background');
    formBackground.classList.add('show-form-background');
    document.getElementById('date_input').value = new Date().toLocaleDateString();
    disable = false;
};

// Button click event handler to hide the form and reset
close_form.onclick = function () {
    let formBackground = document.querySelector('.form-background');
    formBackground.classList.add('hide-form-background');
    setTimeout(function () {
        let form = document.getElementById('form'),
            input = formBackground.querySelectorAll('input'),
            error = formBackground.querySelectorAll('.error-text');
        formBackground.classList.remove('show-form-background');
        formBackground.querySelector('.sending-result').classList.remove('show');
        formBackground.querySelector('.mark').classList.remove('show');
        form.classList.remove('hide');
        form.reset();
        for (let count = 0; count < input.length; count++) {
            if (input[count].classList.contains('invalid-input')) {
                input[count].classList.remove('invalid-input');
                error[count].classList.remove('show');
            }
        }
    }, 300);
};

close_form.onmousedown = () => disable = true;

// Function for replacing incorrectly entered characters on re-entry
function onFocus() {
    switch (this.id) {
        case 'name_input':
            this.value = this.value.replace(/[^a-z]/g, '');
            break;
        case 'phone_input':
            this.value = this.value.replace(/[^\d]/g, '');
            this.value = `+${this.value}`;
            break;
        case 'date_input':
            this.value = this.value.replace(/[^.\d]/g, '');
            break;
    }
    if (this.classList.contains('invalid-input')) {
        let group = this.parentNode,
            error = group.querySelector('.error-text');
        this.classList.remove('invalid-input');
        group.classList.remove('shaking');
        error.classList.remove('show');
    }
}

// Function to validate fields after input completes and focus is lost
function onBlur() {
    if (disable) return;
    switch (this.id) {
        case 'name_input':
            if (this.value.match(/[^a-z]/i))
                showError(this, 1);
            else if (this.value.length == 1)
                showError(this, 2);
            break;
        case 'phone_input':
            if (this.value == '+' || this.value == '')
                this.value = '';
            else if (this.value.match(/\+{2}|\d\+|[^+\d]/))
                showError(this, 1);
            else if (this.value.length < 11)
                showError(this, 3);
            else
                this.value = `${this.value.slice(0, 3)} (${this.value.slice(3, 5)}) ` +
                    `${this.value.slice(5, 9)} ${this.value.slice(9)}`;
            break;
        case 'mail_input':
            if (this.value != '' && !this.value.match(/[-.\w]+@([\w]+\.)+[\w]{2}/i))
                showError(this, 1);
            break;
    }
}

// Function for displaying an error on invalid input
function showError(inputField, errorType) {
    let group = inputField.parentNode,
        error = group.querySelector('.error-text');
    inputField.classList.add('invalid-input');
    group.classList.add('shaking');
    error.classList.add('show');
    switch (errorType) {
        case 1:
            error.innerHTML = 'Incorrect input';
            break;
        case 2:
            error.innerHTML = 'This name is short';
            break;
        case 3:
            error.innerHTML = 'This number is short';
            break;
        case 4:
            error.innerHTML = 'This field is required';
            break;
    }
}

// Button click event handler to validate required form fields before submit
submit.onmousedown = function () {
    let required = document.querySelectorAll('.required'),
        group = document.querySelectorAll('.form-group'),
        input = document.querySelectorAll('input');
    for (let count = 0; count < required.length; count++)
        if (required[count].value == '' || required[count].value == '+')
            showError(required[count], 4);
    for (let count = 0; count < group.length; count++) {
        if (input[count].classList.contains('invalid-input'))
            group[count].classList.add('shaking');
        group[count].onanimationend = function () {
            this.classList.remove('shaking');
        };
    }
};

// Async function to send form data and receive a response from the server
async function sendForm(e) {
    e.preventDefault();
    let input = form.querySelectorAll('input');
    for (let count = 0; count < input.length; count++)
        if (input[count].classList.contains('invalid-input'))
            return;
    let response = await fetch('programs/form.html', {
        method: "POST",
        body: new FormData(form)
    });
    let responseData = await response.json();
    document.querySelector('.answer').innerHTML = responseData.answer;
    document.getElementById('form').classList.add('hide');
    document.querySelector('.sending-result').classList.add('show');
    document.getElementById(responseData.mark).classList.add('show');
}

// A function call to create a calendar and display it
date_input.onclick = function () {
    createCalendarHeader();
    document.querySelector('.calendar-container').classList.toggle('show-calendar');
}

// Function for creating a calendar header. Сalls a function to create the body of the calendar
function createCalendarHeader() {
    let table = '<table><tr>',
        daysOfWeek = ['Mo', 'Th', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    for (let count = 0; count < daysOfWeek.length; count++)
        table += `<th class="days-of-week">${daysOfWeek[count]}</th>`;
    table += '</tr></table>';
    document.querySelector('.calendar-header').innerHTML = table;
    createCalendarBody();
    document.addEventListener('click', function (event) {
        let area = document.querySelector('.calendar-container'),
            target = document.getElementById('date_input');
        if (!area.contains(event.target) && !target.contains(event.target))
            area.classList.remove('show-calendar');
    });
}

// Function for creating a calendar body
function createCalendarBody(setYear = new Date().getFullYear(), setMonth = new Date().getMonth() + 1) {
    let table = '<table><tr>',
        currentDate = new Date(),
        year = setYear,
        month = setMonth - 1,
        day,
        date = new Date(year, month),
        daysInMonth = new Date(year, month + 1, 0).getDate(),
        monthName = new Date(year, month).toLocaleDateString('en', { month: 'long' }),
        handlers;
    if (year == currentDate.getFullYear() && month == currentDate.getMonth())
        day = currentDate.getDate();
    document.querySelector('.current-date').innerHTML = `${monthName} ${year}`;
    for (let count = 0; count < getFirstDay(date); count++)
        table += "<td></td>";
    for (let daysCounter = 1; daysCounter <= daysInMonth; daysCounter++) {
        (daysCounter == day) ?
            table += `<td class="day today">${daysCounter}<div class="today-mark"></div></td>` : table += `<td class="day">${daysCounter}</td>`;
        if (date.getDay() % 7 == 0)
            table += "</tr><tr>";
        date.setDate(date.getDate() + 1);
    }
    table += "</tr></table>";
    document.querySelector('.calendar-body').innerHTML = table;
    handlers = document.querySelectorAll('.day');
    for (let count = 0; count < handlers.length; count++)
        handlers[count].addEventListener('click', getDate);
}

// Function to get the number of the day of the week of the first day of the month
function getFirstDay(date) {
    let firstDay = date.getDay();
    if (firstDay == 0)
        firstDay = 7;
    return firstDay - 1;
}

// Function of recording in the input field of the selected date
function getDate() {
    let timePeriod = document.querySelector('.current-date').innerHTML,
        selectedDate = document.getElementById('date_input');
    selectedDate.value = new Date(`${this.innerText} ${timePeriod}`).toLocaleDateString();
}

// Previous month display function
previous_month.onclick = function () {
    let timePeriod = `1 ${document.querySelector('.current-date').innerHTML}`;
    if (new Date(timePeriod).getMonth() == 0)
        createCalendarBody(new Date(timePeriod).getFullYear() - 1, 12);
    else
        createCalendarBody(new Date(timePeriod).getFullYear(), new Date(timePeriod).getMonth());
}

// Next month display function
next_month.onclick = function () {
    let timePeriod = `1 ${document.querySelector('.current-date').innerHTML}`;
    if (new Date(timePeriod).getMonth() == 11)
        createCalendarBody(new Date(timePeriod).getFullYear() + 1, 1);
    else
        createCalendarBody(new Date(timePeriod).getFullYear(), new Date(timePeriod).getMonth() + 2);
}