// Function to open the modal for adding a new note
function openAddNoteModal() {
    document.getElementById('add-note-modal').style.display = 'block';
}

// Function to close the modal for adding a new note
function closeAddNoteModal() {
    document.getElementById('add-note-modal').style.display = 'none';
}

// Function to open the modal for showing the full note
function openShowNoteModal() {
    document.getElementById('show-note-modal').style.display = 'block';
}

// Function to close the modal for showing the full note
function closeShowNoteModal() {
    document.getElementById('show-note-modal').style.display = 'none';
}

// Function to display the details of a note in the show-note-modal
function displayNoteDetails(title, content) {
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    modalTitle.textContent = title;
    modalContent.textContent = content;

    openShowNoteModal();
}

// Function to get the current date and time
function getCurrentDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return now.toLocaleString('en-US', options);
}

// Function to add a new note to the notes list
function addNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteContent = document.getElementById('note-content').value;

    if (noteTitle.trim() !== '' && noteContent.trim() !== '') {
        const notesList = document.getElementById('notes-list');

        // Create a new list item
        const li = document.createElement('li');

        // Add timestamp
        const timestamp = getCurrentDateTime();
        li.innerHTML = `<strong>${noteTitle}</strong> <br> <span class="timestamp">${timestamp}</span>`;

        // Save note to local storage
        saveNoteToLocalStorage(noteTitle, noteContent, timestamp);

        // Prepend the new note to the list
        li.addEventListener('click', function() {
            displayNoteDetails(noteTitle, noteContent);
        });

        notesList.insertBefore(li, notesList.firstChild);

        // Close the modal after adding a note
        closeAddNoteModal();

        // Reset textarea height to normal
        document.getElementById('note-content').style.height = 'auto';

        // Clear input fields
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
    }
}

// Function to save note to local storage
function saveNoteToLocalStorage(title, content, timestamp) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.unshift({
        title: title,
        content: content,
        timestamp: timestamp
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to load notes from local storage
function loadNotesFromLocalStorage() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Clear existing list

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    for (const note of notes) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${note.title}</strong> <br> <span class="timestamp">${note.timestamp}</span>`;
        li.addEventListener('click', function() {
            displayNoteDetails(note.title, note.content);
        });
        notesList.appendChild(li);
    }
}

// Additional function for live search
function liveSearch() {
    const searchBar = document.getElementById('search-bar');
    const filter = searchBar.value.toUpperCase();
    const notesList = document.getElementById('notes-list');
    const notes = notesList.getElementsByTagName('li');

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const text = note.textContent || note.innerText;

        if (text.toUpperCase().indexOf(filter) > -1) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    }
}

// Event listener to load notes from local storage on page load
document.addEventListener('DOMContentLoaded', loadNotesFromLocalStorage);

// Function to delete a note with confirmation
function deleteNoteWithConfirmation() {
    const modalTitle = document.getElementById('modal-title').textContent;

    if (confirm(`Are you sure you want to delete the note "${modalTitle}"?`)) {
        deleteNote();
    }
}

// Function to delete a note
function deleteNote() {
    const modalTitle = document.getElementById('modal-title').textContent;
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Find the index of the note in the array
    const index = notes.findIndex(note => note.title === modalTitle);

    if (index !== -1) {
        // Remove the note from the array
        notes.splice(index, 1);

        // Save the updated array to local storage
        localStorage.setItem('notes', JSON.stringify(notes));

        // Close the show-note-modal
        closeShowNoteModal();

        // Reload notes from local storage
        loadNotesFromLocalStorage();
    }
}

// Function to clear all app data (cache, cookies, and local storage)
function clearAppData() {
    if (confirm("Are you sure you want to clear all app data? This action cannot be undone.")) {
        // Clear local storage
        localStorage.clear();

        // Clear session storage
        sessionStorage.clear();

        // Clear cookies
        document.cookie = "";

        // Clear cache
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
        }

        // Reload the page after clearing data
        location.reload();
    }
}

// Button to clear all app data
const clearStorageBtn = document.getElementById('clear-storage-btn');
clearStorageBtn.addEventListener('click', clearAppData);

// ... (Previous JavaScript code remains unchanged)

// Function to dynamically adjust textarea height
function adjustTextareaHeight() {
    const textarea = document.getElementById('note-content');
    textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = (textarea.scrollHeight) + 'px'; // Set the new height based on content
}

// Event listener to adjust textarea height on input
document.getElementById('note-content').addEventListener('input', adjustTextareaHeight);

