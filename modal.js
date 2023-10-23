import { db, ref, set } from './firebase.js';

class Modal {
    constructor(calendar) {
        this.calendar = calendar;

        this.openModal = this.openModal.bind(this);
        this.closeModalAndSave = this.closeModalAndSave.bind(this);
        this.closeModalWithoutSaving = this.closeModalWithoutSaving.bind(this);
        this.clearSelectedDate = this.clearSelectedDate.bind(this);
        this.toggleAttendance = this.toggleAttendance.bind(this);
    }

    openModal() {
        let lukasStatus = '✅';
        let silasStatus = '✅';
        let antonStatus = '✅';
        let selectedName = 'none';
        let isGuest = false;
    
        const existingDateInfo = this.calendar.selectedDates.find(dateInfo => 
            dateInfo.date === this.calendar.clickedDate &&
            dateInfo.month === this.calendar.currentDate.getMonth() &&
            dateInfo.year === this.calendar.currentDate.getFullYear());
    
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

        const isAnyoneAttending = [lukasStatus, silasStatus, antonStatus].includes('✅');
        document.getElementById('names').disabled = !isAnyoneAttending;
    
        document.getElementById('names').value = selectedName;
        document.getElementById('guest').checked = isGuest;
    
        document.getElementById("modal").style.display = "block";
    }

    closeModalAndSave() {
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

    closeModalWithoutSaving() {
        document.getElementById("modal").style.display = "none";
    }

    clearSelectedDate() {
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

    toggleAttendance(name) {
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
