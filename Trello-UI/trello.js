let draggedItem = null;

const plusIcon = document.querySelector('.plus-icon');
const mainBody = document.querySelector('.main-body');

plusIcon.addEventListener('click', () => {
    const containerNameInput = document.createElement('input');
    containerNameInput.type = 'text';
    containerNameInput.placeholder = 'Enter list name...';
    containerNameInput.style.position = 'absolute';
    containerNameInput.style.top = '60px';
    containerNameInput.style.right = '20px';
    containerNameInput.style.zIndex = '1000';
    containerNameInput.style.padding = '8px';
    containerNameInput.style.borderRadius = '4px';
    containerNameInput.style.border = '1px solid #ddd';
    
    document.body.appendChild(containerNameInput);
    containerNameInput.focus();
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const containerName = containerNameInput.value.trim();
            if (containerName) {
                createNewContainer(containerName.charAt(0).toUpperCase() + containerName.slice(1).toLocaleLowerCase());
            }
            containerNameInput.remove();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    const handleClickOutside = (e) => {
        if (!containerNameInput.contains(e.target)) {  // Fixed missing parenthesis
            containerNameInput.remove();
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 0);
});

function createNewContainer(name) {
    const newContainer = document.createElement('div');
    newContainer.className = 'containers';
    
    const header = document.createElement('div');
    header.className = 'header';
    
    const h4 = document.createElement('h4');
    h4.textContent = name;
    
    const dotsButton = document.createElement('button');
    dotsButton.innerHTML = '...';
    
    header.appendChild(h4);
    header.appendChild(dotsButton);
    
    const body = document.createElement('div');
    body.className = 'body';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.innerHTML = '<span>+</span> Add a card';
    
    const showTask = document.createElement('ul');
    showTask.className = 'showTask';
    showTask.draggable = 'true';
    
    body.appendChild(addBtn);
    body.appendChild(showTask);
    
    newContainer.appendChild(header);
    newContainer.appendChild(body);
    
    mainBody.appendChild(newContainer);
    
    initializeAddButton(addBtn, showTask);
    setupDragForContainer(showTask);
}

function initializeAddButton(button, ul) {
    let inputElement = null;
    const container = button.closest(".containers");
    
    button.addEventListener("click", () => {
        if (!inputElement) {
            inputElement = document.createElement("input");
            inputElement.className = "task-input";
            inputElement.placeholder = "Enter task...";
            inputElement.style.color = "#000";
            container.appendChild(inputElement);
            button.textContent = "Save";
            inputElement.focus();
            
            inputElement.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    saveTask();
                }
            });
        } else {
            saveTask();
        }
        
        function saveTask() {
            const value = inputElement.value.trim();
            if (value !== "") {
                createTaskItem(ul, value);
            } 
            inputElement.remove();
            inputElement = null;
            button.innerHTML = "<span>+</span> Add a card";
        }
    });
}

document.querySelectorAll(".add-btn").forEach((button) => {
    const ul = button.closest(".containers").querySelector(".showTask");
    initializeAddButton(button, ul);
    
    ul.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("delete-button")) {
            target.closest(".task-item")?.remove();
        }
        if (target.classList.contains("complete-checkbox")) {
            target.closest(".task-item")?.classList.toggle("completed");
        }
    });

    setupDragForContainer(ul);
});

function createTaskItem(ul, value) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.draggable = true;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "complete-checkbox";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-button";
    deleteBtn.textContent = "❌";

    li.append(checkbox, span, deleteBtn);
    ul.appendChild(li);
    
    addDragEvents(li);
    return li;
}

function setupDragForContainer(ul) {
    ul.querySelectorAll('.task-item').forEach(li => {
        addDragEvents(li);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(node => {
                if (node.classList?.contains('task-item')) {
                    addDragEvents(node);
                }
            });
        });
    });
    observer.observe(ul, { childList: true });
}

function addDragEvents(li) {
    li.removeEventListener('dragstart', handleDragStart);
    li.removeEventListener('dragend', handleDragEnd);
    
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    draggedItem = this;
    this.style.opacity = '0.5';
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.style.opacity = '1';
}

function setupDragAndDrop() {
    document.querySelectorAll('.containers .showTask').forEach(ul => {
        ul.removeEventListener('dragover', handleDragOver);
        ul.removeEventListener('dragleave', handleDragLeave);
        ul.removeEventListener('drop', handleDrop);
        
        ul.addEventListener('dragover', handleDragOver);
        ul.addEventListener('dragleave', handleDragLeave);
        ul.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    if (draggedItem) {
        this.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
    }
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedItem && draggedItem !== this && !this.contains(draggedItem)) {
        this.appendChild(draggedItem);
    }
}

const themeBtn = document.getElementById('toggleTheme');
const body = document.body;

themeBtn.addEventListener('click', () => {
    body.style.backgroundColor = '#1D1D1D';
});

function setupContainerClosing() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots') || e.target.closest('.header-menu')) {
      const menuContainer = e.target.closest('.header-menu-container');
      if (!menuContainer) return;
      
      const menu = menuContainer.querySelector('.menu-options');
      if (!menu) return;
      
      document.querySelectorAll('.menu-options.show').forEach(otherMenu => {
        if (otherMenu !== menu) otherMenu.classList.remove('show');
      });
      
      menu.classList.toggle('show');
      e.stopPropagation();
    }
    else if (e.target.classList.contains('close-container')) {
      const container = e.target.closest('.containers');
      if (!container) return;
      
      container.style.transition = 'all 0.3s ease';
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        container.style.display = 'none';
      }, 300);
      
      e.target.closest('.menu-options').classList.remove('show');
      e.stopPropagation();
    }
    else {
      document.querySelectorAll('.menu-options.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setupContainerClosing();
});

function createNewContainer(name) {
    const newContainer = document.createElement('div');
    newContainer.className = 'containers';
    
    const header = document.createElement('div');
    header.className = 'header';
    
    const h4 = document.createElement('h4');
    h4.textContent = name;
    
    const menuContainer = document.createElement('div');
    menuContainer.className = 'header-menu-container';
    
    const menuButton = document.createElement('button');
    menuButton.className = 'header-menu';
    menuButton.innerHTML = '<span class="dots">⋯</span>';
    
    const menuOptions = document.createElement('div');
    menuOptions.className = 'menu-options';
    menuOptions.innerHTML = '<button class="close-container">Close List</button>';
    
    menuContainer.appendChild(menuButton);
    menuContainer.appendChild(menuOptions);
    
    header.appendChild(h4);
    header.appendChild(menuContainer);
    
    const body = document.createElement('div');
    body.className = 'body';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.innerHTML = '<span>+</span> Add a card';
    
    const showTask = document.createElement('ul');
    showTask.className = 'showTask';
    showTask.draggable = 'true';
    
    body.appendChild(addBtn);
    body.appendChild(showTask);
    
    newContainer.appendChild(header);
    newContainer.appendChild(body);
    
    mainBody.appendChild(newContainer);
    
    initializeAddButton(addBtn, showTask);
    setupDragForContainer(showTask);
    
    return newContainer;
}