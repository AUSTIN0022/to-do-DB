    document.getElementById('openModal').addEventListener('click', function() {
        document.getElementById('noteModal').style.display = 'block';
    });
    
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('noteModal').style.display = 'none';
    });
    
    // Optional: Close the modal when clicking outside of it
    window.onclick = function(event) {
        var modal = document.getElementById('noteModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

     // edit Modal
     
    // Function to open the Edit List modal and prefill data
function openEditModal(listId, title, category, description) {
    event.stopPropagation();
    // Populate the form fields with the existing list data
    document.getElementById('editTitle').value = title;
    document.getElementById('editCategorie').value = category;
    document.getElementById('editDescription').value = description;

    // Set the hidden listId for use in the submit event
    document.getElementById('editListForm').dataset.listId = listId;

    // Show the modal
    var editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
    editModal.show();
}

// AJAX-based form submission
document.getElementById('editListForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent default form submission

    const listId = this.dataset.listId;  // Get the listId from dataset

    const formData = {
        title: document.getElementById('editTitle').value,
        category: document.getElementById('editCategorie').value,
        description: document.getElementById('editDescription').value
    };

    try {
        const response = await fetch(`/lists/${listId}?_method=PUT`, {
            method: 'POST',  // We use POST with the _method override to make it a PUT request
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list: formData })  // Send the list data as JSON
        });

        if (response.ok) {
            const updatedList = await response.json();  // Get the updated list data

            // Update the list item in the UI (you can refine this based on your UI structure)
            document.querySelector(`#list-title-${listId}`).innerText = updatedList.title;
            document.querySelector(`#list-category-${listId}`).innerText = updatedList.category;

            // Hide the modal after successful update
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
            editModal.hide();

            // Optionally display a success message
            console.log('List updated successfully!');
        } else {
            console.error('Failed to update list');
        }
    } catch (error) {
        console.error('Error updating list:', error);
    }
});

    // edit Modal

    document.getElementById('search-form').addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent the default form submission

        const formData = new FormData(event.target);
        const searchQuery = formData.get('search');

        try {
            const response = await fetch('/lists/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add CSRF token if needed
                },
                body: JSON.stringify({ search: searchQuery })
            });

            if (response.ok) {
                const data = await response.json();
                displayResults(data);
            } else {
                console.error('Search failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    function displayResults(data) {
        const notesGrid = document.getElementById('notesGrid');
        notesGrid.innerHTML = '';  // Clear previous results

        if (data.length === 0) {
            notesGrid.innerHTML = '<p>No results found</p>';
            return;
        }

        data.forEach(list => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';

            noteCard.innerHTML = `
                <a href="/lists/${list._id}" class="list-card">
                    <h3>${list.title}</h3>
                    <span class="todo-count">${list.todos.length} todos</span>
                    <div class="note-actions">
                        <a href="/lists/${list._id}/edit" class="edit-btn">Edit List</a>
                        <form action="/lists/${list._id}?_method=DELETE" method="POST">
                            <button type="submit" class="delete-btn">Delete List</button>
                        </form>
                    </div>
                </a>
            `;

            notesGrid.appendChild(noteCard);
        });
    }

    // Function to handle delete 
async function deleteList(listId) {
    const confirmation = confirm("Are you sure you want to delete this list?");
    
    if (!confirmation) return;  // If the user cancels, exit the function

    try {
        const response = await fetch(`/lists/${listId}?_method=DELETE`, {
            method: 'POST',  // Using POST with _method override to DELETE
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Remove the list element from the DOM
            const listElement = document.getElementById(`note-card-${listId}`);
            if (listElement) {
                listElement.remove();
            }
            console.log('List deleted successfully');
        } else {
            console.error('Failed to delete list');
        }
    } catch (error) {
        console.error('Error deleting list:', error);
    }
}
