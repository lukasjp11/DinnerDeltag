import { db, ref, set } from './firebaseInit.js';
import { userNames } from './userNames.js';

class Modal {
    constructor(calendar) {
        this.calendar = calendar;
    };

    openModal = () => {
        const existingDateInfo = this.getExistingDateInfo();
        const attendanceStatuses = this.getAttendanceStatuses(existingDateInfo);

        this.setModalElements(attendanceStatuses, existingDateInfo?.person || 'none', existingDateInfo?.guest || false);
        document.getElementById("modal").style.display = "block";
    };

    getExistingDateInfo = () => {
        return this.calendar.selectedDates.find(dateInfo =>
            dateInfo.date === this.calendar.clickedDate &&
            dateInfo.month === this.calendar.currentDate.getMonth() &&
            dateInfo.year === this.calendar.currentDate.getFullYear());
    };

    getAttendanceStatuses = (existingDateInfo) => {
        const statuses = {};
        userNames.forEach(name => {
            if (existingDateInfo?.attendance?.[name] === true) {
                statuses[name] = '✅';
            } else if (existingDateInfo?.attendance?.[name] === false) {
                statuses[name] = '❌';
            } else {
                statuses[name] = '❓';
            }
        });
        return statuses;
    };

    setModalElements = (attendanceStatuses, selectedName, isGuest) => {
        const attendanceContainer = document.getElementById('attendance-list');
        attendanceContainer.innerHTML = userNames.map(name => `
            <div id="${name}-attendance" class="guest-container">
                <span id="${name}-status" onclick="toggleAttendance('${name}')">${attendanceStatuses[name]}</span>
                <label for="${name}-status">${name}</label>
            </div>
        `).join('');

        const namesDropdown = document.getElementById('names');
        namesDropdown.innerHTML = `<option value="none">Ingen</option>` +
            userNames.map(name => `<option value="${name}">${name}</option>`).join('');
        namesDropdown.value = selectedName;

        document.getElementById('guest').checked = isGuest;

        const isAnyoneAttending = Object.values(attendanceStatuses).includes('✅');
        document.getElementById('names').disabled = !isAnyoneAttending;
    };

    closeModalAndSave = () => {
        const selectedName = document.getElementById("names").value;
        const isGuest = document.getElementById("guest").checked;
        const firstDay = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth(), 1).getDay();
        const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;
    
        const attendance = {};
        userNames.forEach(name => {
            const statusElement = document.getElementById(`${name}-status`);
            attendance[name] = statusElement.textContent === '✅' ? true 
                : statusElement.textContent === '❌' ? false
                : 'undecided';
        });
    
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
        set(dbRef, this.calendar.selectedDates)
            .then(() => {
                this.calendar.updateCalendar();
                document.getElementById("modal").style.display = "none";
            })
            .catch(error => {
                console.error('Error saving data:', error);
                alert('An error occurred while saving. Please try again.');
            });
    };       

    closeModalWithoutSaving = () => {
        document.getElementById("modal").style.display = "none";
    };

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
    };

    toggleAttendance = (name) => {
        const statusElement = document.getElementById(`${name}-status`);
        const currentStatus = statusElement.textContent;
    
        if (currentStatus === '✅') {
            statusElement.textContent = '❌';
        } else if (currentStatus === '❌') {
            statusElement.textContent = '❓';
        } else {
            statusElement.textContent = '✅';
        }
    
        const isAnyoneAttending = Array.from(document.querySelectorAll('#attendance-list span'))
            .some(span => span.textContent === '✅');
        document.getElementById('names').disabled = !isAnyoneAttending;
    };
};

export default Modal;
