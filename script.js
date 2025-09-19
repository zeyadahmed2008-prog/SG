// Load events from localStorage or empty array
let events = JSON.parse(localStorage.getItem('events') || '[]');
// Load invitation history from localStorage or empty array
let invitationHistory = JSON.parse(localStorage.getItem('invitationHistory') || '[]');

const eventSelect = document.getElementById('eventSelect');
const createInvitationSection = document.getElementById('create-invitation');
const invitationResult = document.getElementById('invitationResult');
const historyList = document.getElementById('historyList');

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

function saveInvitationHistory() {
  localStorage.setItem('invitationHistory', JSON.stringify(invitationHistory));
}

function refreshEventSelect() {
  eventSelect.innerHTML = '';
  events.forEach((event, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = event.name + ' (' + event.date + ')';
    eventSelect.appendChild(option);
  });
  if (events.length > 0) {
    createInvitationSection.style.display = 'block';
  } else {
    createInvitationSection.style.display = 'none';
  }
}

function refreshHistoryList() {
  historyList.innerHTML = '';
  if (invitationHistory.length === 0) {
    historyList.innerHTML = '<li>No invitations generated yet.</li>';
    return;
  }
  invitationHistory.forEach((inv, index) => {
    const li = document.createElement('li');
    li.textContent = `${inv.guestName} - Event: ${inv.eventName}`;
    historyList.appendChild(li);
  });
}

document.getElementById('saveEvent').addEventListener('click', () => {
  const name = document.getElementById('eventName').value.trim();
  const venue = document.getElementById('venue').value.trim();
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const dressCode = document.getElementById('dressCode').value.trim();

  if (!name || !venue || !date || !time) {
    alert('Please fill in all required fields (name, venue, date, time).');
    return;
  }

  events.push({ name, venue, description, date, time, dressCode });
  saveEvents();
  refreshEventSelect();

  // Clear inputs
  document.getElementById('eventName').value = '';
  document.getElementById('venue').value = '';
  document.getElementById('description').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').value = '';
  document.getElementById('dressCode').value = '';

  alert('Event saved!');
});

document.getElementById('generateInvitation').addEventListener('click', () => {
  const guestName = document.getElementById('guestName').value.trim();
  const eventIndex = eventSelect.value;

  if (!guestName) {
    alert('Please enter guest name.');
    return;
  }

  const event = events[eventIndex];
  if (!event) {
    alert('Please select an event.');
    return;
  }

  // Create invitation text
  const invitationText = `
Invitation for: ${guestName}
Event: ${event.name}
Venue: ${event.venue}
Description: ${event.description}
Date: ${event.date}
Time: ${event.time}
Dress Code: ${event.dressCode}
  `;

  // Generate a unique URL for invitation (for demo, just encode guest and event)
  const invitationUrl = `${window.location.href}#invitation?event=${encodeURIComponent(event.name)}&guest=${encodeURIComponent(guestName)}`;

  invitationResult.innerHTML = `<pre>${invitationText}</pre><div id="qrcode"></div>`;

  // Generate QR code
  QRCode.toCanvas(document.getElementById('qrcode'), invitationUrl, function (error) {
    if (error) console.error(error);
  });

  // Save invitation to history
  invitationHistory.push({ guestName, eventName: event.name });
  saveInvitationHistory();
  refreshHistoryList();
});

// On page load
refreshEventSelect();
refreshHistoryList();