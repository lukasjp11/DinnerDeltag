
// Global variables
let currentDate = new Date();
let selectedUser = null;

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
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;  // Adjust Sunday to be at the end
    
    // Get the total number of days in the month
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // Create the calendar
    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            if (i === 0 && j < firstDay || dayCounter > totalDays) {
                
    if (i === 0 && j < firstDay) {
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        cell.innerText = prevMonthLastDay - firstDay + j + 1;
        cell.classList.add('grayed-out');
    } else if (dayCounter > totalDays) {
        cell.innerText = dayCounter - totalDays;
        cell.classList.add('grayed-out');
        dayCounter++;
    } else {
        cell.innerText = '';
    }
    
            } else {
                cell.innerText = dayCounter;
                dayCounter++;
            }
            
            row.appendChild(cell);
        }
        
        calendarBody.appendChild(row);
    }
}

// Function to change the month
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendar();
}

// Function to set the selected user
function setUser(userName) {
    selectedUser = userName;
    alert('Selected user: ' + userName);
}

// Initial calendar update
updateCalendar();
