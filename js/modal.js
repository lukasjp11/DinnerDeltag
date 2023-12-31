import { db, ref, set } from './firebaseInit.js';

class Modal {
    constructor(calendar) {
        this.calendar = calendar;
    }

    openModal = () => {
        const existingDateInfo = this.getExistingDateInfo();
        const { lukasStatus, silasStatus, antonStatus, selectedName, isGuest } = this.getStatusAndNames(existingDateInfo);
    
        this.setModalElements(lukasStatus, silasStatus, antonStatus, selectedName, isGuest);
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
            lukasStatus: '✅', 
            silasStatus: '✅', 
            antonStatus: '✅', 
            selectedName: 'none', 
            isGuest: false 
        };
    
        if (existingDateInfo) {
            statuses.lukasStatus = existingDateInfo.attendance.Lukas ? '✅' : '❌';
            statuses.silasStatus = existingDateInfo.attendance.Silas ? '✅' : '❌';
            statuses.antonStatus = existingDateInfo.attendance.Anton ? '✅' : '❌';
            statuses.selectedName = existingDateInfo.person;
            statuses.isGuest = existingDateInfo.guest;
        }
        return statuses;
    }
    
    setModalElements = (lukasStatus, silasStatus, antonStatus, selectedName, isGuest) => {
        document.getElementById('Lukas-status').innerText = lukasStatus;
        document.getElementById('Silas-status').innerText = silasStatus;
        document.getElementById('Anton-status').innerText = antonStatus;
    
        const isAnyoneAttending = [lukasStatus, silasStatus, antonStatus].includes('✅');
        document.getElementById('names').disabled = !isAnyoneAttending;
    
        document.getElementById('names').value = selectedName;
        document.getElementById('guest').checked = isGuest;
    }    

    closeModalAndSave = () => {
        const selectedName = document.getElementById("names").value;
        const isGuest = document.getElementById("guest").checked;
        const firstDay = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth(), 1).getDay();
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
            document.getElementById('Lukas-status').textContent,
            document.getElementById('Silas-status').textContent,
            document.getElementById('Anton-status').textContent
        ];

        const isAnyoneAttending = allStatuses.includes('✅');
        document.getElementById('names').disabled = !isAnyoneAttending;
    }
}

export default Modal;
