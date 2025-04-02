const inputName = document.getElementById("inputName");
        const buttonAdd = document.getElementById("buttonAdd");
        const section1 = document.getElementById('section1');


        let arr = []
        if (localStorage.getItem("todos") == null) {
            arr = []
        } else{
            arr = JSON.parse(localStorage.getItem("todos"));
        }

        function renderTodos() {
            section1.innerHTML = ""; 
            arr.forEach((todo, index) => {
                section1.innerHTML += `
                <div class="section-todo ${todo.completed ? 'completed' : ''}">
                <p class="section-name">Название задачи: ${todo.name}</p>
                <p class="section-date">Дата добавления: ${todo.date}</p>
                <div class="section-completed">
                    <p class="section-completed">Выполнить задачу:</p>
                    <input type="checkbox" class="checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}>
                </div>   
                <button class="section-deleted" data-index="${index}">Удалить задачу</button>
                </div>`;
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

        function toggleTaskCompletion(event) {
            const index = event.target.dataset.index; // Получаем индекс задачи
            arr[index].completed = event.target.checked; // Меняем состояние completed
            localStorage.setItem("todos", JSON.stringify(arr)); // Сохраняем в localStorage
            renderTodos(); // Перерисовываем список
        }

        function deleteTask(event) {
            const index = event.target.dataset.index; // Получаем индекс задачи
            arr.splice(index, 1); // Удаляем задачу из массива
            localStorage.setItem("todos", JSON.stringify(arr)); // Обновляем данные в localStorage
            renderTodos(); // Перерисовываем список задач
        }

        renderTodos();

        buttonAdd.addEventListener("click", () => {
            const date = new Date();
            const formattedDate = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
            const todo = {
                name: inputName.value,
                date: formattedDate,
                completed: false,
                deleted: false
            }
            arr.push(todo);
            const stringTodo = JSON.stringify(arr);
            localStorage.setItem("todos", stringTodo);
            renderTodos();
            inputName.value = "";
        })