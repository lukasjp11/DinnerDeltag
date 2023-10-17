// Global variables
let currentDate = new Date();
let selectedDates = []; // To store the selected dates and persons
let clickedDate; // To store the clicked date

// Function to update the calendar based on the current date
function updateCalendar() {
    const monthName = document.getElementById('monthName');
    const calendarBody = document.getElementById('calendar').getElementsByTagName('tbody')[0];

    // Set the month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthName.innerText = monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();

    // Clear the previous calendar
    calendarBody.innerHTML = '';

    // Get the first day of the month
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Adjust Sunday to be at the end

    // Get the total number of days in the month
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Create the calendar
    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');

            if (i === 0 && j < firstDay) {
                const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
                cell.innerText = prevMonthLastDay - firstDay + j + 1;
                cell.classList.add('grayed-out');
            } else if (dayCounter > totalDays) {
                cell.innerText = dayCounter - totalDays;
                cell.classList.add('grayed-out');
                dayCounter++;
            } else {
                cell.innerText = dayCounter;
                dayCounter++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }

    // Highlight the selected dates and show the selected person and guest status
    highlightSelectedDates();

    // After creating the calendar, attach the click event listeners to the cells
    attachClickEventToCells();
}

// Function to highlight the selected dates
function highlightSelectedDates() {
    selectedDates.forEach(dateInfo => {
        if (dateInfo.year === currentDate.getFullYear() && dateInfo.month === currentDate.getMonth()) {
            const cell = document.querySelector(`#calendar tbody tr:nth-child(${Math.ceil((dateInfo.date + dateInfo.firstDay) / 7)}) td:nth-child(${(dateInfo.date + dateInfo.firstDay - 1) % 7 + 1})`);
            if (cell) {
                cell.style.backgroundColor = 'green';
                cell.style.color = 'white';
                cell.innerHTML = `<strong>${dateInfo.date}</strong>
                                  <div>${dateInfo.person}<br>${dateInfo.guest ? 'With Guest' : ''}</div>`;
            }
        }
    });
}


// Function to change the month
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendar();
}

// Function to open the modal
function openModal() {
    document.getElementById("modal").style.display = "block";
}

// Function to close the modal and capture the selected values
function closeModal() {
    const selectedName = document.getElementById("names").value;
    const isGuest = document.getElementById("guest").checked;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

    const selectedDateInfo = {
        date: clickedDate,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        person: selectedName,
        guest: isGuest,
        firstDay: adjustedFirstDay
    };

    // Update selectedDates array
    selectedDates = selectedDates.filter(dateInfo => dateInfo.date !== clickedDate || dateInfo.month !== currentDate.getMonth() || dateInfo.year !== currentDate.getFullYear());
    selectedDates.push(selectedDateInfo);

    updateCalendar();
    document.getElementById("modal").style.display = "none";
}

// Function to attach click event to calendar cells
function attachClickEventToCells() {
    document.querySelectorAll('#calendar tbody td').forEach(cell => {
        cell.addEventListener('click', () => {
            if (!cell.classList.contains('grayed-out')) {
                clickedDate = parseInt(cell.innerText, 10);
                openModal();
            }
        });
    });
}

// Initial calendar update
updateCalendar();
