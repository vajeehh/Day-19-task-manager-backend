const API = "https://day-19-task-manager-backend-fses.onrender.com/tasks";

// Load tasks
async function loadTasks() {

    let userId = document.getElementById("userIdInput").value;

    if (!userId) return;

    let res = await axios.get(`${API}?userId=${userId}`);

    let tasks = res.data;

    let list = document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach(t => {
        let li = document.createElement("li");

        li.innerHTML = `
            <span class="${t.completed ? 'completed' : ''}">
                ${t.title} - ${t.category}
            </span>

            <button onclick="toggleTask('${t._id}', ${!t.completed})">
                ${t.completed ? 'Undo' : 'Complete'}
            </button>

            <button onclick="editTask('${t._id}', '${t.title}')">
                Edit
            </button>

            <button onclick="deleteTask('${t._id}')">
                Delete
            </button>
        `;

        list.appendChild(li);
    });
}

// Add task
async function addTask() {

    let userId = document.getElementById("userIdInput");
    let input = document.getElementById("taskInput");
    let category = document.getElementById("categoryInput");

    if (!userId.value || !input.value) return;

    await axios.post(API, {
        userId: userId.value,
        title: input.value,
        category: category.value
    });

    input.value = "";
    category.value = "Personal";

    loadTasks();
}

// Toggle task
async function toggleTask(id, completed) {

    await axios.put(`${API}/${id}`, {
        completed
    });

    loadTasks();
}

// Edit task
async function editTask(id, oldTitle) {

    let newTitle = prompt("Edit task title:", oldTitle);

    if (!newTitle) return;

    await axios.put(`${API}/${id}`, {
        title: newTitle
    });

    loadTasks();
}

// Delete task
async function deleteTask(id) {

    await axios.delete(`${API}/${id}`);

    loadTasks();
}

// Initial load
document.getElementById("userIdInput").addEventListener("input", loadTasks);