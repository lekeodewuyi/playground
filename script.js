document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
            const task = await response.json();
            addTaskToUI(task);
            taskForm.reset();
        }
    });

    async function fetchTasks() {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        tasks.forEach(addTaskToUI);
    }

    function addTaskToUI(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span ${task.completed ? 'class="completed"' : ''}>${task.title}</span>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    }

    async function deleteTask(taskId) {
        await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
        const taskElement = document.querySelector(`li span:contains('${taskId}')`).parentElement;
        taskList.removeChild(taskElement);
    }

    fetchTasks();
});
