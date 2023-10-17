const calendar = document.getElementById('calendar');

function signup() {
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const div = document.createElement('div');
    div.innerHTML = `${name} har tilmeldt sig til aftensmad den ${date}`;
    calendar.appendChild(div);
}

function addGuest() {
    const guestName = document.getElementById('guest-name').value;
    const guestDate = document.getElementById('guest-date').value;
    const div = document.createElement('div');
    div.innerHTML = `${guestName} er inviteret til aftensmad den ${guestDate}`;
    calendar.appendChild(div);
}
