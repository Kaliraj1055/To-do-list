document.addEventListener('DOMContentLoaded', () => {
    const userIntro = document.querySelector('.user-intro');
    let userName = localStorage.getItem('userName') || prompt("Enter Your Name");
    if (!userName) {
        userIntro.innerHTML = `Welcome`;
    } else {
        userIntro.innerHTML = `Hello ${userName}`;
        localStorage.setItem('userName', userName);
    }

    const totalTask = document.querySelector('.total-task');
    const taskInput = document.querySelector('.task-details');
    const addTaskBtn = document.querySelector('.task-button');
    const taskList = document.getElementById('task-item');
    const progressNumber = document.querySelector('.number');
    const progressBar = document.querySelector('.progress');

   
    const safeParse = (data) => {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
        return [];
    };

    let tasks = safeParse(localStorage.getItem('tasks'));

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateTaskCount = () => {
        const count = tasks.length;
        totalTask.innerHTML = `Total ${count} task${count !== 1 ? 's' : ''}`;
    };

    const updateProgress = () => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        progressNumber.textContent = `${completed}/${total}`;
        const progressPercent = total > 0 ? (completed / total) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            let li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <div class="cs-delete-button"><button class="edit-button">Edit</button></div>
                <div class="cs-delete-button"><button class="delete-button" id="deleteButton">Delete</button></div>
            `;

            const editBtn = li.querySelector('.edit-button');
            const checkbox = li.querySelector('.checkbox');
            const textEl = li.querySelector('span');

          
            if (task.completed) {
                textEl.style.textDecoration = 'line-through';
                textEl.style.textDecorationThickness = '2px';
                textEl.style.textDecorationColor = '#000000ff';
                textEl.style.color = '#868686ff';
                editBtn.disabled = true;
            }

            
            checkbox.addEventListener('change', (e) => {
                tasks[index].completed = e.target.checked;
                if (e.target.checked) {
                    textEl.style.textDecoration = 'line-through';
                    textEl.style.textDecorationThickness = '2px';
                    textEl.style.textDecorationColor = '#000000ff';
                    textEl.style.color = '#868686ff';
                    editBtn.disabled = true;
                } else {
                    textEl.style.textDecoration = 'none';
                    textEl.style.color = '';
                    editBtn.disabled = false;
                }
                saveTasks();
                updateProgress();
            });

            
            editBtn.addEventListener('click', () => {
                taskInput.value = task.text;
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                updateTaskCount();
                updateProgress();
            });

            
            li.querySelector('.delete-button').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                updateTaskCount();
                updateProgress();
            });

            taskList.append(li);
        });

        updateTaskCount();
        updateProgress();
    };

    const addTask = (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (!taskText) return;
        tasks.push({ text: taskText, completed: false });
        saveTasks();
        taskInput.value = '';
        renderTasks();
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        }
    });

    
    renderTasks();
});
