const inputName = document.getElementById("inputName");
const buttonAdd = document.getElementById("buttonAdd");
const section1 = document.getElementById('section1');
const section2 = document.getElementById('section2');
const section3 = document.getElementById('section3');

let arr = []
if (localStorage.getItem("todos") == null) {
    arr = []
} else{
    arr = JSON.parse(localStorage.getItem("todos"));
}

// Создание задачи
function renderTodos() {
    section1.innerHTML = "";
    section2.innerHTML = "";  
    section3.innerHTML = "";

    arr.forEach((todo, index) => {
        let postponeButtonHTML = "";
        if (!todo.completed) {
            const btnText = todo.postponed ? "Вернуть задачу" : "Отложить задачу";
            postponeButtonHTML = `<button class="section-postpone" data-index="${index}">${btnText}</button>`;
        }
        const todoHTML = `
            <div class="section-todo ${todo.completed ? 'completed' : ''}">
                <p class="section-name">Название задачи: ${todo.name}</p>
                <p class="section-date">Дата создания задачи: ${todo.date}</p>
                <p class="section-last-modified">Последнее изменение: ${todo.lastModified}</p>
                <div class="section-completed">
                    <p class="section-completed">Задача выполнена:</p>
                    <input type="checkbox" class="checkbox" data-index="${index}"
                        ${todo.completed ? 'checked' : ''}
                        ${todo.postponed ? 'disabled' : ''}>
                </div>
                ${postponeButtonHTML}  
                <button class="section-deleted" data-index="${index}">Удалить задачу</button>
            </div>`;
        if (todo.postponed) {
            section3.innerHTML += todoHTML;
        } else if (todo.completed) {
            section2.innerHTML += todoHTML; 
        } else {
            section1.innerHTML += todoHTML; 
        }
    });

    document.querySelectorAll(".section-postpone").forEach(button => {
        button.addEventListener("click", postponeTask);
    });
    // Обработчики событий для чекбоксов
    document.querySelectorAll(".checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", toggleTaskCompletion); //добавил индекс ко всем чекбоксам
    });
    // Обработчики событий для кнопок удаления
    document.querySelectorAll(".section-deleted").forEach(button => {
        button.addEventListener("click", deleteTask);
    });
}

// Завершение задачи
function toggleTaskCompletion(event) {
    const index = event.target.dataset.index; // Получаем индекс задачи
    arr[index].completed = event.target.checked; // Меняем состояние completed
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0') + ':' + String(date.getSeconds()).padStart(2,'0');

    arr[index].lastModified = `${day}.${month}.${year}; ${time}`; // Обновляем дату последнего изменения
    localStorage.setItem("todos", JSON.stringify(arr)); // Сохраняем в localStorage
    renderTodos(); // Перерисовываем список
}

// Удаление задачи
function deleteTask(event) {
    const index = event.target.dataset.index;

    // Показываем модалку и ждём подтверждения
    showConfirmModal((confirmed) => {
        if (confirmed) {
            arr.splice(index, 1); // Удаляем задачу из массива
            localStorage.setItem("todos", JSON.stringify(arr)); // Обновляем localStorage
            renderTodos(); // Перерисовываем задачи
        }
    });
}


// Всплывашка при удалении задачи
function showConfirmModal(callback) {
    const modal = document.getElementById("confirmModal");
    const yesBtn = document.getElementById("confirmYes");
    const noBtn = document.getElementById("confirmNo");
    
    modal.classList.remove("hidden");
    
    const close = () => {
        modal.classList.add("hidden");
        document.removeEventListener("keydown", keyHandler);
    };

    // Обработчик клавиш для модального окна
    function keyHandler(event) {
        // Если модалка открыта, перехватываем нажатия Enter и Escape
        if (event.key === "Escape") {
            event.preventDefault();
            close();
        }
        if (event.key === "Enter") {
            event.preventDefault();
            callback(true);
            close();
        }
    }
    document.addEventListener("keydown", keyHandler);
    
    yesBtn.onclick = () => {
        callback(true);
        close();
    };
    
    noBtn.onclick = () => {
        callback(false);
        close();
    };
    
    // Закрытие при клике по фону модалки
    modal.onclick = (e) => {
        if (e.target === modal) {  
            close();
        }
    };
}

// Отложить задачу
function postponeTask(event) {
    const index = event.target.dataset.index;
    arr[index].postponed = !arr[index].postponed;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0') + ':' + String(date.getSeconds()).padStart(2,'0');

    arr[index].lastModified = `${day}.${month}.${year}; ${time}`; // Обновляем дату последнего изменения
    localStorage.setItem("todos", JSON.stringify(arr));
    renderTodos();
}

renderTodos();

// Добавление задачи
function addTask() {
    const name = inputName.value.trim();
    if (name === "") return;  // Если поле пустое, выходим

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0') + ':' + String(date.getSeconds()).padStart(2,'0');
    const formattedDate = `${day}.${month}.${year}; ${time}`;

    const todo = {
        name: name,
        date: formattedDate,
        lastModified: formattedDate,
        completed: false,
        postponed: false,
        deleted: false
    };

    arr.push(todo);
    const stringTodo = JSON.stringify(arr);
    localStorage.setItem("todos", stringTodo);
    renderTodos();
    inputName.value = "";  // Очищаем поле ввода
}

    // Обработчик на кнопку "Добавить"
buttonAdd.addEventListener("click", addTask);

    // Обработчик на клавишу "Enter"
inputName.addEventListener("keydown", (event) => {
    // Если модалка видна, выходим, чтобы не сработало добавление задачи
    const modal = document.getElementById("confirmModal");
    if (!modal.classList.contains("hidden")) {
        event.preventDefault();
        return;
    }

    if (event.key === "Enter") {
        event.preventDefault();  // Останавливаем стандартное действие (например, отправку формы)
        addTask();  // Вызываем общую функцию добавления задачи
    }
});


// Изменение фона
const tabButtons = document.querySelectorAll('.tab-button');
const tabs = document.querySelectorAll('.tabs__block');
const body = document.body;
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.dataset.tab;

    // Скрываем все табы
    tabs.forEach(tab => {
      tab.classList.remove('active__block', 'completed__block', 'postpone__block');
      tab.style.display = (tab.id === tabId) ? 'block' : 'none';
    });

    // Удаляем все фоновые классы у body
    body.classList.remove('active__block', 'completed__block', 'postpone__block');

    // Назначаем новый фон
    if (tabId === 'tab_01') {
      body.classList.add('active__block');
    } else if (tabId === 'tab_02') {
      body.classList.add('completed__block');
    } else if (tabId === 'tab_03') {
      body.classList.add('postpone__block');
    }
  });
});