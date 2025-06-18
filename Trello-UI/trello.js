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
        const li = document.createElement("li");
        li.className = "task-item";
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
});

 