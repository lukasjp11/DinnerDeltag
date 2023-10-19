import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBPFLXo6mQXdcszXFVYaD-aCq-hRNmRjkw",
    authDomain: "dinnerdeltag.firebaseapp.com",
    projectId: "dinnerdeltag",
    storageBucket: "dinnerdeltag.appspot.com",
    messagingSenderId: "1390491301",
    appId: "1:1390491301:web:e4e61c46ed0ab5f7d5bf4c",
    databaseURL: "https://dinnerdeltag-default-rtdb.europe-west1.firebasedatabase.app"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app); 

const dinnerDeltagApp = {
    currentDate: new Date(),
    selectedDates: [],
    clickedDate: null,

    init() {
        const dbRef = ref(db, 'selectedDates/');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Data retrieved from Firebase:', data);
            this.selectedDates = data ? data : [];
            this.updateCalendar();
        });
    },

    updateCalendar() {
        this.setMonthName();
        this.clearPreviousCalendar();
        this.createCalendar();
        this.highlightToday();
        this.highlightSelectedDates();
        this.attachClickEventToCells();
    },

    setMonthName() {
        const monthName = document.getElementById('monthName');
        const monthNames = [
            '❄️ Januar', 
            '💘 Februar', 
            '🌱 Marts', 
            '✝️ April', 
            '🌸 Maj', 
            '☀️ Juni', 
            '🏖️ Juli', 
            '🌻 August', 
            '🍂 September', 
            '🎃 Oktober', 
            '🍁 November', 
            '🎄 December'
        ];
        monthName.innerText = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    },

    clearPreviousCalendar() {
        const calendarBody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
        calendarBody.innerHTML = '';
    },

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
    },

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
    },

    highlightSelectedDates() {
        document.querySelectorAll('#calendar tbody td').forEach(cell => {
            cell.style.backgroundColor = '';
        });

        this.selectedDates.forEach(dateInfo => {
            if (dateInfo.year === this.currentDate.getFullYear() && dateInfo.month === this.currentDate.getMonth()) {
                const cell = document.querySelector(`#calendar tbody tr:nth-child(${Math.ceil((dateInfo.date + dateInfo.firstDay) / 7)}) td:nth-child(${(dateInfo.date + dateInfo.firstDay - 1) % 7 + 1})`);
                
                if (cell) {
                    cell.style.backgroundColor = dateInfo.isCookSelected ? 'green' : '#DAA520';
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
    },    

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendar();
    },

    toggleAttendance(name) {
        const statusElement = document.getElementById(`${name}-status`);
        if (statusElement.textContent === '✅') {
            statusElement.textContent = '❌';
        } else {
            statusElement.textContent = '✅';
        }
    },

    openModal() {
        let lukasStatus = '✅';
        let silasStatus = '✅';
        let antonStatus = '✅';
        let selectedName = 'none';
        let isGuest = false;
    
        const existingDateInfo = this.selectedDates.find(dateInfo => 
            dateInfo.date === this.clickedDate &&
            dateInfo.month === this.currentDate.getMonth() &&
            dateInfo.year === this.currentDate.getFullYear());
    
        if (existingDateInfo) {
            lukasStatus = existingDateInfo.attendance.Lukas ? '✅' : '❌';
            silasStatus = existingDateInfo.attendance.Silas ? '✅' : '❌';
            antonStatus = existingDateInfo.attendance.Anton ? '✅' : '❌';
            
            selectedName = existingDateInfo.person;
            isGuest = existingDateInfo.guest;
        }
    
        document.getElementById('Lukas-status').innerText = lukasStatus;
        document.getElementById('Silas-status').innerText = silasStatus;
        document.getElementById('Anton-status').innerText = antonStatus;
    
        document.getElementById('names').value = selectedName;
        document.getElementById('guest').checked = isGuest;
    
        document.getElementById("modal").style.display = "block";
    },    
    
    closeModalAndSave() {
        const selectedName = document.getElementById("names").value;
        const isGuest = document.getElementById("guest").checked;
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
        const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

        const lukasStatus = document.getElementById('Lukas-status').innerText === '✅';
        const silasStatus = document.getElementById('Silas-status').innerText === '✅';
        const antonStatus = document.getElementById('Anton-status').innerText === '✅';

        const attendance = { 
            Lukas: lukasStatus,
            Silas: silasStatus,
            Anton: antonStatus
        };

        const selectedDateInfo = {
            date: this.clickedDate,
            month: this.currentDate.getMonth(),
            year: this.currentDate.getFullYear(),
            person: selectedName,
            guest: isGuest,
            attendance: attendance,
            isCookSelected: selectedName !== 'none'
        };

        this.selectedDates = this.selectedDates.filter(dateInfo => 
            dateInfo.date !== this.clickedDate || 
            dateInfo.month !== this.currentDate.getMonth() || 
            dateInfo.year !== this.currentDate.getFullYear());
        this.selectedDates.push(selectedDateInfo);

        const dbRef = ref(db, 'selectedDates/');
        set(dbRef, this.selectedDates);

        this.updateCalendar();
        document.getElementById("modal").style.display = "none";
    },

    closeModalWithoutSaving() {
        document.getElementById("modal").style.display = "none";
    },

    clearSelectedDate() {
        this.selectedDates = this.selectedDates.filter(dateInfo => 
            !(dateInfo.date === this.clickedDate && 
              dateInfo.month === this.currentDate.getMonth() && 
              dateInfo.year === this.currentDate.getFullYear())
        );

        const dbRef = ref(db, 'selectedDates/');
        set(dbRef, this.selectedDates);

        this.updateCalendar();
        document.getElementById("modal").style.display = "none";
    },

    attachClickEventToCells() {
        document.querySelectorAll('#calendar tbody td').forEach(cell => {
            cell.addEventListener('click', () => {
                if (!cell.classList.contains('grayed-out')) {
                    this.clickedDate = parseInt(cell.innerText, 10);
                    this.openModal();
                }
            });
        });
    },

};

window.addEventListener('DOMContentLoaded', (event) => {
    dinnerDeltagApp.init();
});

window.changeMonth = dinnerDeltagApp.changeMonth.bind(dinnerDeltagApp);
window.closeModalWithoutSaving = dinnerDeltagApp.closeModalWithoutSaving.bind(dinnerDeltagApp);
window.closeModalAndSave = dinnerDeltagApp.closeModalAndSave.bind(dinnerDeltagApp);
window.clearSelectedDate = dinnerDeltagApp.clearSelectedDate.bind(dinnerDeltagApp);
window.toggleAttendance = dinnerDeltagApp.toggleAttendance.bind(dinnerDeltagApp);
