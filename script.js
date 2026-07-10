document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================================================================
  // TAB NAVIGATION & PANES SWITCHING
  // ==========================================================================
  const navItems = document.querySelectorAll('.nav-item');
  const panes = document.querySelectorAll('.pane');
  const dashCards = document.querySelectorAll('.dash-card');

  function switchTab(tabId) {
    // Deactivate all nav items & panes
    navItems.forEach(item => item.classList.remove('active'));
    panes.forEach(pane => pane.classList.remove('active'));

    // Activate selected
    const activeNavItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (activeNavItem) activeNavItem.classList.add('active');

    const activePane = document.getElementById(`${tabId}-pane`);
    if (activePane) activePane.classList.add('active');
  }

  // Bind Sidebar Nav clicks
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Bind Dashboard Card Launch clicks
  dashCards.forEach(card => {
    card.addEventListener('click', () => {
      const tabId = card.getAttribute('data-launch');
      switchTab(tabId);
    });
  });

  // ==========================================================================
  // CALCULATOR LOGIC
  // ==========================================================================
  const display = document.getElementById('display');
  const calcButtons = document.querySelectorAll('.calculator .buttons button:not(#clear):not(#equals)');
  const clearBtn = document.getElementById('clear');
  const equalsBtn = document.getElementById('equals');

  let expression = '';

  calcButtons.forEach(button => {
    button.addEventListener('click', () => {
      const val = button.getAttribute('data-value');
      expression += val;
      display.value = expression;
    });
  });

  clearBtn.addEventListener('click', () => {
    expression = '';
    display.value = '';
  });

  equalsBtn.addEventListener('click', () => {
    if (!expression) return;
    try {
      // Replace arithmetic operators visually if any, evaluate safely
      const formattedExpr = expression.replace(/−/g, '-');
      const result = eval(formattedExpr);
      
      if (result === undefined || isNaN(result)) {
        display.value = 'Error';
        expression = '';
      } else {
        display.value = result;
        expression = result.toString();
      }
    } catch (error) {
      display.value = 'Error';
      expression = '';
    }
  });

  // Handle Keyboard inputs for calculator
  document.addEventListener('keydown', (e) => {
    // Only trigger if focus is not on input fields
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
      return;
    }

    const key = e.key;
    if (/[0-9.]/.test(key)) {
      expression += key;
      display.value = expression;
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      expression += key;
      display.value = expression;
    } else if (key === 'Enter' || key === '=') {
      equalsBtn.click();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clearBtn.click();
    } else if (key === 'Backspace') {
      expression = expression.slice(0, -1);
      display.value = expression || '0';
    }
  });

  // ==========================================================================
  // WEATHER APP LOGIC
  // ==========================================================================
  const base_url = "https://api.openweathermap.org/data/2.5/weather?q=";
  const apiKey = "0d827d83c4a8ca95d2d1eb09d2eb8c1e";

  const citySearchInput = document.getElementById('citySearchInput');
  const weatherSearchBtn = document.getElementById('weatherSearchBtn');
  const weatherResult = document.getElementById('weatherResult');
  const weatherPlaceholder = document.getElementById('weatherPlaceholder');

  const weatherCity = document.getElementById('weatherCity');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherDesc = document.getElementById('weatherDesc');
  const weatherHumidity = document.getElementById('weatherHumidity');
  const weatherWindSpeed = document.getElementById('weatherWindSpeed');
  const weatherIcon = document.getElementById('weatherIcon');

  async function checkWeather(cityNameVal) {
    if (!cityNameVal) {
      alert("Please enter City Name.");
      return;
    }

    try {
      const response = await fetch(`${base_url}${encodeURIComponent(cityNameVal)}&appid=${apiKey}&units=metric`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();

      // Display fields
      weatherCity.innerHTML = data.name;
      weatherTemp.innerHTML = Math.round(data.main.temp) + "°C";
      weatherDesc.innerHTML = data.weather[0].description;
      weatherHumidity.innerHTML = data.main.humidity + " %";
      weatherWindSpeed.innerHTML = data.wind.speed + " km/hr";

      // Dynamically select weather icons if available
      const condition = data.weather[0].main.toLowerCase();
      if (condition.includes('cloud')) {
        weatherIcon.src = 'cloudy.png';
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
        weatherIcon.src = 'climate-change (1).png'; // acts as rain representation
      } else {
        weatherIcon.src = 'icon.png'; // sunny/clear sky icon
      }

      weatherPlaceholder.classList.add('hidden');
      weatherResult.classList.remove('hidden');
      citySearchInput.value = '';

    } catch (error) {
      alert("Oops! City not found. Please try again.");
      console.error("Weather fetch error:", error);
    }
  }

  weatherSearchBtn.addEventListener('click', () => {
    checkWeather(citySearchInput.value.trim());
  });

  citySearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkWeather(citySearchInput.value.trim());
    }
  });


  // ==========================================================================
  // TO-DO LIST LOGIC
  // ==========================================================================
  let todoTasks = JSON.parse(localStorage.getItem('tasksHubTodo')) || [];

  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoPriority = document.getElementById('todoPriority');
  const todoCategory = document.getElementById('todoCategory');
  const todoList = document.getElementById('todoList');
  const todoEmptyState = document.getElementById('todoEmptyState');
  const todoStats = document.getElementById('todoStats');
  const todoClearCompleted = document.getElementById('todoClearCompleted');

  const checkMarkSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const deleteIconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (!taskText) return;

    const newTask = {
      id: 'todo_' + Date.now(),
      text: taskText,
      completed: false,
      priority: todoPriority.value,
      category: todoCategory.value
    };

    todoTasks.push(newTask);
    saveTodoTasks();
    todoInput.value = '';
    renderTodoTasks();
  });

  todoClearCompleted.addEventListener('click', () => {
    todoTasks = todoTasks.filter(t => !t.completed);
    saveTodoTasks();
    renderTodoTasks();
  });

  function toggleTodo(id) {
    const taskIndex = todoTasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      todoTasks[taskIndex].completed = !todoTasks[taskIndex].completed;
      saveTodoTasks();
      renderTodoTasks();
    }
  }

  function deleteTodo(id) {
    todoTasks = todoTasks.filter(t => t.id !== id);
    saveTodoTasks();
    renderTodoTasks();
  }

  function saveTodoTasks() {
    localStorage.setItem('tasksHubTodo', JSON.stringify(todoTasks));
  }

  function renderTodoTasks() {
    todoList.innerHTML = '';

    const remainingCount = todoTasks.filter(t => !t.completed).length;
    todoStats.textContent = `${remainingCount} task${remainingCount !== 1 ? 's' : ''} remaining`;

    if (todoTasks.length === 0) {
      todoEmptyState.style.display = 'block';
    } else {
      todoEmptyState.style.display = 'none';
    }

    // Sort: incomplete first, high priority first
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const sortedTodos = todoTasks.slice().sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed;
      }
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    sortedTodos.forEach(task => {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');

      // Checkbox
      const checkLabel = document.createElement('label');
      
      const checkInput = document.createElement('input');
      checkInput.type = 'checkbox';
      checkInput.className = 'todo-check-input';
      checkInput.checked = task.completed;
      checkInput.addEventListener('change', () => toggleTodo(task.id));

      const customCheck = document.createElement('span');
      customCheck.className = 'todo-item-check';
      customCheck.innerHTML = checkMarkSvg;

      checkLabel.appendChild(checkInput);
      checkLabel.appendChild(customCheck);

      // Content Area
      const contentDiv = document.createElement('div');
      contentDiv.className = 'todo-item-content';

      const textSpan = document.createElement('span');
      textSpan.className = 'todo-item-text';
      textSpan.textContent = task.text;

      const badgesDiv = document.createElement('div');
      badgesDiv.className = 'todo-item-badges';

      const priorityBadge = document.createElement('span');
      priorityBadge.className = `todo-badge priority ${task.priority}`;
      priorityBadge.textContent = task.priority;

      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'todo-badge category';
      categoryBadge.textContent = task.category;

      badgesDiv.appendChild(priorityBadge);
      badgesDiv.appendChild(categoryBadge);

      contentDiv.appendChild(textSpan);
      contentDiv.appendChild(badgesDiv);

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-delete-btn';
      deleteBtn.innerHTML = deleteIconSvg;
      deleteBtn.addEventListener('click', () => deleteTodo(task.id));

      li.appendChild(checkLabel);
      li.appendChild(contentDiv);
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
  }

  // Initial todo render
  renderTodoTasks();

});