const taskInput = document.getElementById('task-input');
const taskAddButton = document.getElementById('task-add');

const tasksListUnfinished = document.getElementById('tasks-unfinished');
const tasksListFinished = document.getElementById('tasks-finished');

const storage = {
    keys: {
        lastIndex: 'lastIndex',
        tasks: 'tasks',
    },
    load(name, defaultValue = null) {
        return JSON.parse(localStorage.getItem(name)) ?? defaultValue;
    },
    save(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }
};

let tasks = storage.load(storage.keys.tasks, []);
let lastIndex = storage.load(storage.keys.lastIndex, 0);

function toggleTask(id, completed) {
    const newTasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !completed };
        }
        return task;
    });
    tasks = newTasks;
    storage.save(storage.keys.tasks, tasks);
    render();
}

function editTask(id, input, editing) {
    if (editing) {
        const newTitle = input.value.trim();
        const newTasks = tasks.map(task => {
            if (task.id === id && newTitle) {
                return { ...task, title: newTitle, editing: false };
            }
            return task;
        });
        tasks = newTasks;
    } else {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, editing: true };
            }
            return task;
        });
    }
    storage.save(storage.keys.tasks, tasks);
    render();
}

function deleteTask(id) {
    const newTasks = tasks.filter(task => task.id !== id);
    tasks = newTasks;
    storage.save(storage.keys.tasks, tasks);
    render();
}

function createTaskElement({ id, title, completed = false, editing = false }) {
    const taskElement = document.createElement('li');

    const checkbox=document.createElement('button');
    checkbox.classList.add('material-icons');
    checkbox.classList.add('checkbox');
    checkbox.innerHTML = `<i class="material-icons">${completed ? 'check_box' : 'check_box_outline_blank'}</i>`;
    checkbox.addEventListener('click', () => toggleTask(id, completed));

    const label = document.createElement('h4');
    if (editing) {
        label.classList.add('not-visible');
    }
    label.innerText = title;

    const input = document.createElement('input');
    if (!editing) {
        input.classList.add('not-visible');
    }
    input.type = 'text';
    input.value = title;

    const editButton = document.createElement('button');
    editButton.classList.add('material-icons');
    editButton.classList.add(editing ? 'save' : 'edit');
    editButton.innerHTML = `<i class="material-icons">${editing ? 'save' : 'edit'}</i>`;
    editButton.addEventListener('click', () => editTask(id, input, editing));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('material-icons');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';
    deleteButton.addEventListener('click', () => deleteTask(id));

    taskElement.appendChild(checkbox);
    taskElement.appendChild(label);
    taskElement.appendChild(input);
    taskElement.appendChild(deleteButton);
    taskElement.appendChild(editButton);

    return taskElement;
}

function render() {
    tasksListUnfinished.innerHTML = null;
    tasksListFinished.innerHTML = null;
    const tasksUnfinished = [];
    const tasksFinished = [];

    for (const task of tasks) {
        if (task.completed) {
            tasksFinished.push(task);
        } else {
            tasksUnfinished.push(task);
        }
    }

    for (const task of tasksUnfinished) {
        const taskElement = createTaskElement(task);
        tasksListUnfinished.appendChild(taskElement);
    }
    for (const task of tasksFinished) {
        const taskElement = createTaskElement(task);
        tasksListFinished.appendChild(taskElement);
    }
}
render();

function addNewTask() {
    const title = taskInput.value.trim();

    if (title) {
        const taskElement = createTaskElement({ id: lastIndex, title });
        tasksListUnfinished.appendChild(taskElement);
        taskInput.value = '';
        tasks.push({ id: lastIndex, title, completed: false, editing: false });
        storage.save(storage.keys.tasks, tasks);
        lastIndex++;
        storage.save(storage.keys.lastIndex, lastIndex);
    }
}

taskAddButton.addEventListener('click', addNewTask);
