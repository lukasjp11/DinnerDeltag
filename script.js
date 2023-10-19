const dinnerDeltagApp = {
    currentDate: new Date(),
    selectedDates: [],
    clickedDate: null,

    init() {
        this.updateCalendar();
        this.addSwipeListeners();
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
        const monthNames = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
        monthName.innerText = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    },

    clearPreviousCalendar() {
        const calendarBody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
        calendarBody.innerHTML = '';
    },

    createCalendar() {
        const calendarBody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
        let firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
        firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Adjust Sunday to be at the end
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
        this.selectedDates.forEach(dateInfo => {
            if (dateInfo.year === this.currentDate.getFullYear() && dateInfo.month === this.currentDate.getMonth()) {
                const cell = document.querySelector(`#calendar tbody tr:nth-child(${Math.ceil((dateInfo.date + dateInfo.firstDay) / 7)}) td:nth-child(${(dateInfo.date + dateInfo.firstDay - 1) % 7 + 1})`);
                
                if (cell) {
                    cell.style.backgroundColor = 'green';
                    cell.style.color = 'white';
                    cell.innerHTML = `<strong>${dateInfo.date}</strong><div>${dateInfo.person}<br>${dateInfo.guest ? '(gæster)' : ''}</div>`;
                }
            }
        });
    },

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.updateCalendar();
    },

    openModal() {
        document.getElementById("modal").style.display = "block";
        document.getElementById("guest").checked = false;
    },

    closeModalAndSave() {
        const selectedName = document.getElementById("names").value;
        const isGuest = document.getElementById("guest").checked;
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
        const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

        const selectedDateInfo = {
            date: this.clickedDate,
            month: this.currentDate.getMonth(),
            year: this.currentDate.getFullYear(),
            person: selectedName,
            guest: isGuest,
            firstDay: adjustedFirstDay
        };

        this.selectedDates = this.selectedDates.filter(dateInfo => dateInfo.date !== this.clickedDate || dateInfo.month !== this.currentDate.getMonth() || dateInfo.year !== this.currentDate.getFullYear());
        this.selectedDates.push(selectedDateInfo);

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

    addSwipeListeners() {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            touchEndX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                this.changeMonth(1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                this.changeMonth(-1);
            }
        };

        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        document.addEventListener('touchend', handleTouchEnd, false);
    }
};

dinnerDeltagApp.init();

window.changeMonth = dinnerDeltagApp.changeMonth.bind(dinnerDeltagApp);
window.closeModalWithoutSaving = dinnerDeltagApp.closeModalWithoutSaving.bind(dinnerDeltagApp);
window.closeModalAndSave = dinnerDeltagApp.closeModalAndSave.bind(dinnerDeltagApp);
window.clearSelectedDate = dinnerDeltagApp.clearSelectedDate.bind(dinnerDeltagApp);
