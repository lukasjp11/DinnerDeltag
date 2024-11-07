import { db, ref, set } from './firebaseInit.js';

class Modal {
    constructor(calendar) {
        this.calendar = calendar;
    }

    openModal = () => {
        const existingDateInfo = this.getExistingDateInfo();
        const { tangStatus, hardonkStatus, sineStatus, selectedName, isGuest } = this.getStatusAndNames(existingDateInfo);
    
        this.setModalElements(tangStatus, hardonkStatus, sineStatus, selectedName, isGuest);
        document.getElementById("modal").style.display = "block";
    }
    
    getExistingDateInfo = () => {
        return this.calendar.selectedDates.find(dateInfo =>
            dateInfo.date === this.calendar.clickedDate &&
            dateInfo.month === this.calendar.currentDate.getMonth() &&
            dateInfo.year === this.calendar.currentDate.getFullYear());
    }
    
    getStatusAndNames = (existingDateInfo) => {
        let statuses = {    
            tangStatus: '✅', 
            hardonkStatus: '✅', 
            sineStatus: '✅', 
            selectedName: 'none', 
            isGuest: false 
        };
    
        if (existingDateInfo) {
            statuses.tangStatus = existingDateInfo.attendance.Tang ? '✅' : '❌';
            statuses.hardonkStatus = existingDateInfo.attendance.Hardonk ? '✅' : '❌';
            statuses.sineStatus = existingDateInfo.attendance.Sine ? '✅' : '❌';
            statuses.selectedName = existingDateInfo.person;
            statuses.isGuest = existingDateInfo.guest;
        }
        return statuses;
    }
    
    setModalElements = (tangStatus, hardonkStatus, sineStatus, selectedName, isGuest) => {
        document.getElementById('Tang-status').innerText = tangStatus;
        document.getElementById('Hardonk-status').innerText = hardonkStatus;
        document.getElementById('Sine-status').innerText = sineStatus;
    
        const isAnyoneAttending = [tangStatus, hardonkStatus, sineStatus].includes('✅');
        document.getElementById('names').disabled = !isAnyoneAttending;
    
        document.getElementById('names').value = selectedName;
        document.getElementById('guest').checked = isGuest;
    }    

    closeModalAndSave = () => {
        const selectedName = document.getElementById("names").value;
        const isGuest = document.getElementById("guest").checked;
        const firstDay = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth(), 1).getDay();
        const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

        const tangStatus = document.getElementById('Tang-status').innerText === '✅';
        const hardonkStatus = document.getElementById('Hardonk-status').innerText === '✅';
        const sineStatus = document.getElementById('Sine-status').innerText === '✅';

        const attendance = {
            tang: tangStatus,
            hardonk: hardonkStatus,
            sine: sineStatus
        };

        const selectedDateInfo = {
            date: this.calendar.clickedDate,
            month: this.calendar.currentDate.getMonth(),
            year: this.calendar.currentDate.getFullYear(),
            person: selectedName,
            guest: isGuest,
            firstDay: adjustedFirstDay,
            attendance: attendance,
            isCookSelected: selectedName !== 'none'
        };

        this.calendar.selectedDates = this.calendar.selectedDates.filter(dateInfo =>
            dateInfo.date !== this.calendar.clickedDate ||
            dateInfo.month !== this.calendar.currentDate.getMonth() ||
            dateInfo.year !== this.calendar.currentDate.getFullYear());
        this.calendar.selectedDates.push(selectedDateInfo);

        const dbRef = ref(db, 'selectedDates/');
        set(dbRef, this.calendar.selectedDates);

        this.calendar.updateCalendar();
        document.getElementById("modal").style.display = "none";
    }

    closeModalWithoutSaving = () => {
        document.getElementById("modal").style.display = "none";
    }

    clearSelectedDate = () => {
        const userConfirmed = confirm("Er du sikker på, at du vil rydde de valgte data?");
        if (userConfirmed) {
            this.calendar.selectedDates = this.calendar.selectedDates.filter(dateInfo =>
                !(dateInfo.date === this.calendar.clickedDate &&
                    dateInfo.month === this.calendar.currentDate.getMonth() &&
                    dateInfo.year === this.calendar.currentDate.getFullYear())
            );
            const dbRef = ref(db, 'selectedDates/');
            set(dbRef, this.calendar.selectedDates);

            this.calendar.updateCalendar();
            document.getElementById("modal").style.display = "none";
        }
    }

    toggleAttendance = (name) => {
        const statusElement = document.getElementById(`${name}-status`);
        if (statusElement.textContent === '✅') {
            statusElement.textContent = '❌';
        } else {
            statusElement.textContent = '✅';
        }

        const allStatuses = [
            document.getElementById('Tang-status').textContent,
            document.getElementById('Hardonk-status').textContent,
            document.getElementById('Sine-status').textContent
        ];

        const isAnyoneAttending = allStatuses.includes('✅');
        document.getElementById('names').disabled = !isAnyoneAttending;
    }
}

export default Modal;
