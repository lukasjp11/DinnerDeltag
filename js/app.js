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

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            calendar.init();
        } else {
            signInAnonymously(auth)
                .then(() => {
                    calendar.init();
                })
                .catch((error) => {
                    console.error('Error during sign in:', error);
                });
        }
    });
});
