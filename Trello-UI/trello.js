let draggedItem = null;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(".add-btn").forEach((button) => {
    let inputElement = null;
    const container = button.closest(".containers");
    const ul = container.querySelector(".showTask");
    button.addEventListener("click", () => {
      if (!inputElement) {
        inputElement = document.createElement("input");
        inputElement.className = "task-input";
        inputElement.placeholder = "Enter task...";
        inputElement.style.color = "#000";
        container.appendChild(inputElement);
        button.textContent = "Save";
        inputElement.focus();
      } else {
        const value = inputElement.value.trim();
        if (value !== "") {
          createTaskItem(ul, value);
        } 
        inputElement.remove();
        inputElement = null;
        button.textContent = "+ Add Card";
      }
    });

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

  setupDragAndDrop();
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
  span.textContent = value;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-button";
  deleteBtn.textContent = "Delete";

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