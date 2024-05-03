import "./utils/bling";
import "./style.css";
import { nanoid } from "nanoid";

function app() {
  let storedTodoItems = localStorage.getItem("todo");
  let initialState = {
    id: nanoid,
    todoItems: storedTodoItems ? JSON.parse(storedTodoItems) : [],
  };
  let state = { ...initialState };

  let ui = {};

  function saveToLocalStorage(todos) {
    localStorage.setItem("todo", JSON.stringify(todos));
  }

  function DisplayTodo() {
    let items;

    state.todoItems.forEach((item) => {
      items = mk("div", { className: "todo_items " }, [
        (ui.item = mk("div", { className: "todo-item" }, [
          (ui.listItem = mk("li", { className: "list-item" }, [item.text])),
          mk("div", { className: "todo-btns" }, [
            mk("i", {
              className: "fa-solid fa-trash-can deleteBtn",
              onclick: () => deleteTodo(item.id),
            }),
            (ui.markComplete = mk("i", {
              className: "fa-sharp fa-solid fa-check-double markCompleteBtn",
              id: `mark-complete-${item.id}`,
              onclick: () => toggleItemComplete(item.id),
            })),
          ]),
        ])),
      ]);

      const savedStyle = getSavedStyle(item.id);
      if (savedStyle) {
        const button = items.querySelector(`#mark-complete-${item.id}`);
        button.style.color = savedStyle.color;
      }

      ui.todos.prepend(items);
    });
  }

  function displayDate() {
    let date = new Date();
    date = date.toString().split(" ");
    ui.date.innerHTML = date[1] + " " + date[2] + " " + date[3];
  }

  window.onload = function () {
    displayDate();
    DisplayTodo();
  };

  function addItem(e) {
    e.preventDefault();

    const text = ui.input.value;

    if (!text) return;

    if (!Array.isArray(state.todoItems)) {
      state.todoItems = [];
    }

    const todo = { text, completed: false, id: Date.now() };
    state.todoItems.push(todo);
    saveToLocalStorage(state.todoItems);
    ui.input.value = "";
    renderTodo();
  }

  function toggleItemComplete(id) {
    const updatedTasks = state.todoItems.map((item) => {
      if (id === item.id) {
        const updatedItem = { ...item, completed: !item.completed };
        const buttonId = `mark-complete-${item.id}`; // Unique button ID

        // Apply style changes based on completion status
        const button = document.getElementById(buttonId);
        if (updatedItem.completed) {
          button.style.color = "green"; // Change text color to green
        } else {
          button.style.color = ""; // Reset text color
        }

        return updatedItem;
      }
      return item;
    });
    state.todoItems = updatedTasks;
    saveItemsWithStyle(updatedTasks);
    renderTodo();
  }

  function saveItemsWithStyle(updatedTasks) {
    const serializedTasks = updatedTasks.map((item) => ({
      id: item.id,
      text: item.text,
      completed: item.completed,
      style: {
        color: document.getElementById(`mark-complete-${item.id}`).style.color,
      },
    }));

    // Save serialized todo items to localStorage
    localStorage.setItem("todoItems", JSON.stringify(serializedTasks));
    saveToLocalStorage(serializedTasks);
  }

  function deleteTodo(id) {
    const remainingTodo = state.todoItems?.filter((item) => {
      return id !== item.id;
    });
    state.todoItems = remainingTodo;
    saveToLocalStorage(remainingTodo);

    renderTodo();
  }

  function renderTodo() {
    ui.todos.innerHTML = "";

    state.todoItems.forEach((item) => {
      const todoItem = mk("div", { className: "todo_items" }, [
        (ui.todoItem = mk("div", { className: "todo-item" }, [
          (ui.listItem = mk("li", { className: "list-item" }, [item.text])),
          mk("div", { className: "todo-btns" }, [
            mk("i", {
              className: "fa-solid fa-trash-can deleteBtn",
              onclick: () => deleteTodo(item.id),
            }),
            (ui.markComplete = mk("i", {
              className: "fa-sharp fa-solid fa-check-double markCompleteBtn",
              id: `mark-complete-${item.id}`,
              onclick: () => toggleItemComplete(item.id),
            })),
          ]),
        ])),
      ]);

      const savedStyle = getSavedStyle(item.id);
      if (savedStyle) {
        const button = todoItem.querySelector(`#mark-complete-${item.id}`);
        button.style.color = savedStyle.color;
      }

      ui.todos.prepend(todoItem);
    });
  }

  function getSavedStyle(itemId) {
    const serializedTasks = JSON.parse(localStorage.getItem("todoItems"));
    if (serializedTasks) {
      const savedItem = serializedTasks.find((item) => item.id === itemId);
      return savedItem ? savedItem.style : null;
    }
    return null;
  }

  function filterBtns() {
    const filterContainer = mk("div", { className: "filter-btn-container" }, [
      mk("div", { className: "filter-btns-wrap" }, [
        (ui.filterBtn1 = mk(
          "button",
          { type: "button", className: "btn-toggle", id: "filter-btn-all" },
          [
            mk("span", { className: "visually-hidden" }, ["Show"]),
            mk("span", null, ["All"]),
            mk("span", { className: "visually-hidden" }, ["Tasks"]),
          ]
        )),
        (ui.filterBtn2 = mk(
          "button",
          {
            type: "button",
            className: "btn-toggle",
            id: "filter-btn-active",
          },
          [
            mk("span", { className: "visually-hidden" }, ["Show"]),
            mk("span", null, ["Active"]),
            mk("span", { className: "visually-hidden" }, ["Tasks"]),
          ]
        )),
        (ui.filterBtn3 = mk(
          "button",
          {
            type: "button",
            className: "btn-toggle",
            id: "filter-btn-completed",
          },
          [
            mk("span", { className: "visually-hidden" }, ["Show"]),
            mk("span", null, ["Completed"]),
            mk("span", { className: "visually-hidden" }, ["Tasks"]),
          ]
        )),
      ]),
    ]);

    // Add event listeners to the filter buttons
    ui.filterBtn1.addEventListener("click", () => handleFilter("all"));
    ui.filterBtn2.addEventListener("click", () => handleFilter("active"));
    ui.filterBtn3.addEventListener("click", () => handleFilter("completed"));

    return filterContainer;
  }

  function handleFilter(filterType) {
    let filteredItems;
    if (filterType === "all") {
      filteredItems = state.todoItems;
    } else if (filterType === "active") {
      filteredItems = state.todoItems.filter((item) => !item.completed);
    } else if (filterType === "completed") {
      filteredItems = state.todoItems.filter((item) => item.completed);
    }
    ui.todos.innerHTML = "";

    filteredItems.forEach((item) => {
      const todoItem = mk("div", { className: "todo_items" }, [
        (ui.todoItem = mk("div", { className: "todo-item" }, [
          (ui.listItem = mk("li", { className: "list-item" }, [item.text])),
          mk("div", { className: "todo-btns" }, [
            mk("i", {
              className: "fa-solid fa-trash-can deleteBtn",
              onclick: () => deleteTodo(item.id),
            }),
            (ui.markComplete = mk("i", {
              className: "fa-sharp fa-solid fa-check-double markCompleteBtn",
              id: `mark-complete-${item.id}`,
              onclick: () => toggleItemComplete(item.id),
            })),
          ]),
        ])),
      ]);

      const savedStyle = getSavedStyle(item.id);
      if (savedStyle) {
        const button = todoItem.querySelector(`#mark-complete-${item.id}`);
        button.style.color = savedStyle.color;
      }

      // Append the filtered todo item to the UI
      ui.todos.prepend(todoItem);
    });
  }

  return mk("div", { className: "app" }, [
    mk("div", { className: "decorator" }, [
      mk("h1", null, ["My Todo.."]),
      mk("div", { className: "input-header" }, [
        mk("h2", {}, [(ui.date = mk("span", { id: "date" }, []))]),
        (ui.form = mk("form", { id: "form", name: "form" }, [
          (ui.input = mk("input", {
            type: "text",
            id: "new-todo-input",
            name: "new todo",
            className: "todo",
            placeholder: "Enter a todo",
          })),
          mk("button", { type: "submit", onclick: addItem }, ["Add Task"]),
        ])),
      ]),
      filterBtns(),
    ]),
    (ui.todos = mk("ul", { id: "todos" }, [])),
  ]);
}

function render() {
  document.body.prepend(app());
}

render();

export default app;
