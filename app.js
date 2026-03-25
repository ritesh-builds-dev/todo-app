// Selecting DOM elements
const newTask = document.getElementById("todoInput")
const addTaskBtn = document.getElementById("addTodoBtn")
const todoList = document.getElementById("todoList")
const remainingCount = document.getElementById("itemsLeft")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
const filterBtn = document.querySelectorAll(".filter-btn")
let allTasks = [];
let currentFilter = "all";
let savedTasks = localStorage.getItem("myTodoList");


// for saving items in localstoarage
if (savedTasks) {
    allTasks = JSON.parse(savedTasks);
}


// for adding task and alert
addTaskBtn.addEventListener('click', () => {
    let myTask = newTask.value

    if (myTask.trim().length < 5) {
        alert("⚠️ Warning: Input Too Short!\nYour task must be at least 5 characters long to proceed.");
        return;
    }

    let task = {
        id: Date.now(),
        title: myTask,
        iscompleted: false
    }

    allTasks.push(task)
    newTask.value = '';
    localStorage.setItem("myTodoList", JSON.stringify(allTasks));
    showTasks();
}
)


//  for handling all showtasks features 
const showTasks = () => {
    todoList.innerHTML = ""

    const filteredTasks = allTasks.filter(task => {
        if (currentFilter === "active") {
            return !task.iscompleted;
        } else if (currentFilter === "completed") {
            return task.iscompleted;
        }
        return true; // 
    })


    // for handling hopw many task is left to do
    const pendingCount = allTasks.filter(task => task.iscompleted === false).length;
    remainingCount.innerText = `Tasks to do: ${pendingCount} left`;

    // if zero tsk there than show no task found
    if (filteredTasks.length == 0) {
        todoList.innerHTML = `<h3 style="text-align: center; color: gray; margin:30px">NO TASKS FOUND</h3>`;
        return;
    }


    // the html of the showing task
    for (const task of filteredTasks) {
        todoList.innerHTML += `<li class="todo-item"  id="${task.id}">
                    <input type="checkbox" class="todo-checkbox" ${task.iscompleted ? "checked" : ""}>
                  <span class="todo-text ${task.iscompleted ? "completed" : ""}">${task.title}</span>
                    <button class="delete-btn" >×</button>
                </li>`
    }
};
showTasks();


// for handling the checkboxes
todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains("todo-checkbox")) {
        const clickedId = e.target.parentElement.id;

        allTasks.forEach(element => {
            if (element.id == clickedId) {
                element.iscompleted = !element.iscompleted;
            }
        });
        localStorage.setItem("myTodoList", JSON.stringify(allTasks));
        showTasks();
    } else if (e.target.classList.contains("delete-btn")) {
        const confirmation = confirm("Are you sure you want to delete this task?")
        if (confirmation) {
            const removeId = e.target.parentElement.id;
            allTasks = allTasks.filter(task => task.id != removeId)
            localStorage.setItem("myTodoList", JSON.stringify(allTasks))
            showTasks();
        }
    }

});


// for handle clear btn to clear all completed task
clearCompletedBtn.addEventListener('click', (e) => {
    const tasklength = allTasks.length;
    const pendingTasks = allTasks.filter(task => task.iscompleted === false);
    if (pendingTasks.length === tasklength) {
        alert("No completed tasks to clear!");
        return;
    }
    if (confirm("This will permanently delete all completed tasks. Proceed?")) {
        allTasks = pendingTasks;
        localStorage.setItem("myTodoList", JSON.stringify(allTasks));
        showTasks();
    }
});



// for handle the all working tabs
filterBtn.forEach(element => {
    element.addEventListener('click', () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        element.classList.add("active");
        const filterValue = element.dataset.filter;
        currentFilter = filterValue;
        showTasks();
    })
});

// Enter key press event listener
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodoBtn.click(); 
    }
});
