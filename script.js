let notes = JSON.parse(localStorage.getItem("notes")) || [];
let archivedNotes = JSON.parse(localStorage.getItem("archivedNotes")) || [];
let addNoteForm = document.getElementById("add-note-form");

function renderNotes() {
    
    document.getElementById("notes-list").innerHTML = "";
    document.getElementById("archived-notes-list").innerHTML = "";

    // Sort notes by creation time (newest first)
    notes.sort((a, b) => b.createdAt - a.createdAt);


    notes.forEach(note => {
        let noteElement = document.createElement("div");
        noteElement.classList.add("note");

        let titleElement = document.createElement("h3");
        titleElement.textContent = note?.title;

        let bodyElement = document.createElement("p");
        bodyElement.textContent = note?.body;

        let createdAtElement = document.createElement("p");
        createdAtElement.textContent = "Created at: " + new Date(note?.createdAt).toLocaleString();

        let dueDateElement = document.createElement("p");
        if (note.dueDate) {
            dueDateElement.textContent = "Due on: " + new Date(note?.dueDate).toLocaleString();
            if (new Date(note.dueDate) < new Date()) {
                dueDateElement.classList.add("overdue");
            }
        } else {
            dueDateElement.textContent = "No due date";
        }

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            notes = notes.filter(n => n !== note);
            archivedNotes.push(note);
            saveNotes();
            renderNotes();
        });

        let archiveButton = document.createElement("button");
        archiveButton.textContent = "Archive";
        archiveButton.addEventListener("click", () => {
            notes = notes.filter(n => n !== note);
            archivedNotes.push(note);
            saveNotes();
            renderNotes();
        });

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            let newTitle = prompt("Enter new title:", note.title);
            let newBody = prompt("Enter new body:", note.body);
            let newDueDate = prompt("Enter new due date (optional):", note.dueDate);
            note.title = newTitle;
            note.body = newBody;
            note.dueDate = newDueDate ? new Date(newDueDate).toISOString() : null;
            saveNotes();
            renderNotes();
        });

        noteElement.appendChild(titleElement);
        noteElement.appendChild(bodyElement);
        noteElement.appendChild(createdAtElement);
        noteElement.appendChild(dueDateElement);
        noteElement.appendChild(deleteButton);
        noteElement.appendChild(archiveButton);
        noteElement.appendChild(editButton);

        document.getElementById("notes-list").appendChild(noteElement);
    });

    // Display archived notes in list
    archivedNotes.forEach(note => {
        let noteElement = document.createElement("div");
        noteElement.classList.add("note");

        let titleElement = document.createElement("h3");
        titleElement.textContent = note?.title;

        let bodyElement = document.createElement("p");
        bodyElement.textContent = note?.body;

        let archivedAtElement = document.createElement("p");
        archivedAtElement.textContent = "Archived at: " + new Date(note?.archivedAt).toLocaleString();

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
           
            archivedNotes = archivedNotes?.filter(n => n !== note);
            saveNotes();
            renderNotes();
        });

        let unarchiveButton = document.createElement("button");
        unarchiveButton.textContent = "Unarchive";
        unarchiveButton.addEventListener("click", () => {
            archivedNotes = archivedNotes.filter(n => n !== note);
            notes.push(note);
            saveNotes();
            renderNotes();
        });

        noteElement.appendChild(titleElement);
        noteElement.appendChild(bodyElement);
        noteElement.appendChild(archivedAtElement);
        noteElement.appendChild(deleteButton);
        noteElement.appendChild(unarchiveButton);

        document.getElementById("archived-notes-list").appendChild(noteElement);
    });
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));
}


addNoteForm.addEventListener("submit", event => {
    event.preventDefault();
    let title = document.getElementById("note-title-input").value;
    let body = document.getElementById("note-body-input").value;
    let dueDate = document.getElementById("note-due-date-input").value;
    let note = {
        title: title,
        body: body,
        createdAt: Date.now(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };
    notes.push(note);
    saveNotes();
    renderNotes();
    addNoteForm.reset();
});

renderNotes();