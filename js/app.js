import { onAuthStateChanged, signInAnonymously, auth } from './firebaseInit.js';
import Calendar from './calendar.js';
import Modal from './modal.js';

const calendar = new Calendar();
const modal = new Modal(calendar);

window.changeMonth = calendar.changeMonth.bind(calendar);
window.closeModalWithoutSaving = modal.closeModalWithoutSaving.bind(modal);
window.closeModalAndSave = modal.closeModalAndSave.bind(modal);
window.clearSelectedDate = modal.clearSelectedDate.bind(modal);
window.toggleAttendance = modal.toggleAttendance.bind(modal);

function initializeCalendar() {
    calendar.init();
}

function handleAuthStateChange(user) {
    if (user) {
        initializeCalendar();
    } else {
        signInAnonymously(auth)
            .then(initializeCalendar)
            .catch(handleSignInError);
    }
}

function handleSignInError(error) {
    console.error('Error during sign in:', error);
}

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, handleAuthStateChange);
});
