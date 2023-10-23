import { db, ref, onValue, set } from './firebase.js';
import Modal from './modal.js';

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDates = [];
        this.clickedDate = null;
        this.modal = new Modal(this);

        this.init = this.init.bind(this);
        this.updateCalendar = this.updateCalendar.bind(this);
        this.setMonthName = this.setMonthName.bind(this);
        this.clearPreviousCalendar = this.clearPreviousCalendar.bind(this);
        this.createCalendar = this.createCalendar.bind(this);
        this.highlightToday = this.highlightToday.bind(this);
        this.highlightSelectedDates = this.highlightSelectedDates.bind(this);
        this.attachClickEventToCells = this.attachClickEventToCells.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
    }

    init() {
        const dbRef = ref(db, 'selectedDates/');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Data retrieved from Firebase:', data);
            this.selectedDates = data ? data : [];
            this.updateCalendar();
        });
    }

    updateCalendar() {
        this.setMonthName();
        this.clearPreviousCalendar();
        this.createCalendar();
        this.highlightToday();
        this.highlightSelectedDates();
        this.attachClickEventToCells();
    }

    setMonthName() {
        const monthName = document.getElementById('monthName');
        const monthNames = [
            'Januar', 
            'Februar', 
            'Marts', 
            'April', 
            'Maj', 
            'Juni', 
            'Juli', 
            'August', 
            'September', 
            'Oktober', 
            'November', 
            'December'
        ];
        monthName.innerText = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    clearPreviousCalendar() {
        const calendarBody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
        calendarBody.innerHTML = '';
    }

    createCalendar() {
        const calendarBody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
        let firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
        firstDay = (firstDay === 0) ? 6 : firstDay - 1;
        const totalDays = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        let dayCounter = 1;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if (i === 0 && j < firstDay) {
                    const prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
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
    }

    highlightToday() {
        const today = new Date();
        if (today.getMonth() === this.currentDate.getMonth() && today.getFullYear() === this.currentDate.getFullYear()) {
            const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
            const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;
            const todayCell = document.querySelector(`#calendar tbody tr:nth-child(${Math.ceil((today.getDate() + adjustedFirstDay) / 7)}) td:nth-child(${(today.getDate() + adjustedFirstDay - 1) % 7 + 1})`);
            
            if (todayCell) {
                todayCell.classList.add('today');
            }
        }
    }

    highlightSelectedDates() {
        this.selectedDates.forEach(dateInfo => {
            if (dateInfo.year === this.currentDate.getFullYear() && dateInfo.month === this.currentDate.getMonth()) {
                const cell = document.querySelector(`#calendar tbody tr:nth-child(${Math.ceil((dateInfo.date + dateInfo.firstDay) / 7)}) td:nth-child(${(dateInfo.date + dateInfo.firstDay - 1) % 7 + 1})`);
                const noOneAttending = !Object.values(dateInfo.attendance).some(attending => attending);
    
                if (cell) {
                    cell.style.backgroundColor = noOneAttending ? 'red' : dateInfo.isCookSelected ? 'green' : '#DAA520';
                    cell.style.color = 'white';
    
                    const allNames = ['Lukas', 'Silas', 'Anton'];
                    const cookName = dateInfo.person;
                    const otherNames = allNames.filter(name => name !== cookName);
                    const orderedNames = [cookName].concat(otherNames);
    
                    let namesHTML = '';
                    orderedNames.forEach(name => {
                        if (name === cookName && cookName !== 'none') {
                            namesHTML += `<strong>${name.toUpperCase()}👨‍🍳</strong>`;
                        } else if (name !== 'none') {
                            namesHTML += `${name} ${dateInfo.attendance[name] ? '✅' : '❌'}<br>`;
                        }
                    });
                    cell.innerHTML = `<strong>${dateInfo.date}</strong><div>${namesHTML}${dateInfo.guest ? '(gæster)' : ''}</div>`;
                }
            }
        });
    }

    attachClickEventToCells() {
        document.querySelectorAll('#calendar tbody td').forEach(cell => {
            cell.addEventListener('click', () => {
                if (!cell.classList.contains('grayed-out')) {
                    this.clickedDate = parseInt(cell.innerText, 10);
                    this.modal.openModal();
                }
            });
        });
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendar();
    }
}

export default Calendar;
