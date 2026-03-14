document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');

    let tasks = [];

    function addTask(taskText) {
        const task = {
            text: taskText,
            completed: false
        };
        tasks.push(task);
        renderTasks();
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span>${task.text}</span>
                <button onclick="toggleTaskCompletion(${index})">Toggle</button>
                <button onclick="removeTask(${index})">Remove</button>
            `;
            taskList.appendChild(li);
        });
    }

    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            newTaskInput.value = '';
        }
    });

    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });
});
