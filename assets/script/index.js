const sortableList = document.querySelector(".sortable-list");
const listItemWrapper = document.querySelector("#listItemWrapper");
const categoryInput = document.getElementById("categoryInput");
const categoryResElement = document.getElementById("categoryResElement");
let selectedCategory = "";
const CategorySelectOptionsWrapper = document.querySelector(
  ".todoWrapper .categorySelector .select-options"
);
// set category option wrapper width
categoryResElement.style.width = `${categoryInput.offsetWidth}px`;

categoryInput.addEventListener("input", function () {
  const inputText = categoryInput.value.toLowerCase();
  const filteredOptions = autocompleteOptions.filter((option) =>
    option.toLowerCase().includes(inputText)
  );

  // handle focusOut to hide options (in add event)
  document.body.addEventListener("click", handleFocusOut);
  function handleFocusOut(e) {
    console.log(e.target);
    if (e.target != categoryInput || e.target != categoryResElement) {
      categoryResElement.style.display = "";
      document.body.removeEventListener("click", handleFocusOut);
    }
  }

  // Clear previous results
  categoryResElement.innerHTML = "";

  // Display matching options
  filteredOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.textContent = option;
    optionElement.addEventListener("click", function () {
      categoryInput.value = `  دسته بندی  :` + option;
      categoryResElement.innerHTML = ``;
      categoryResElement.style.display = "";
    });
    categoryResElement.appendChild(optionElement);
  });
});

categoryInput.addEventListener("focusin", (e) => {
  categoryResElement.style.display = "block";
});

// select category to display

function renderCategorySelectOptions(data) {
  CategorySelectOptionsWrapper.innerHTML = ``;
  data.forEach((categoryItem) => {
    const newItem = document.createElement("li");
    newItem.innerText = categoryItem;
    newItem.addEventListener("click", handleSelectCategory);
    CategorySelectOptionsWrapper.appendChild(newItem);
  });
}

function toggleSelectCategory(event) {
  const selectOptions = event.target.nextElementSibling;
  selectOptions.style.display =
    selectOptions.style.display === "block" ? "none" : "block";
}

function handleSelectCategory(event) {
  const selectedOption = event.target.textContent;
  const selectStyled = event.target.parentElement.previousElementSibling;
  selectStyled.textContent = `دسته بندی :` + selectedOption;
  selectedCategory = selectedOption;

  selectStyled.setAttribute("value", selectedOption);
  event.target.parentElement.style.display = "none";

  renderItems();
}

document.addEventListener("click", function (event) {
  const customSelects = document.querySelectorAll(".categorySelector");
  customSelects.forEach(function (select) {
    if (!select.contains(event.target)) {
      select.querySelector(".select-options").style.display = "none";
    }
  });
});

// calendar Object
const calendarObjWrapper = {
  constructor: "",
  calendar: "",
};
const userName = prompt("Enter you UserName pls :");
const autocompleteOptions = ["عمومی"];
async function fetchData() {
  const res = await fetch("https://63e09c6b59bb472a7425106c.mockapi.io/todos");

  const data = await res.json();

  localStorage.setItem("events", JSON.stringify(await data));

  return data;
}

async function putData(requestData, id) {
  // upadte localStorage
  const oldData = JSON.parse(localStorage.getItem("events"));
  oldData.map((item) => {
    if (item.id == id) {
      item = requestData;
    }
    return item;
  });
  localStorage.setItem("events", JSON.stringify(await oldData));

  try {
    const res = await fetch(
      `https://63e09c6b59bb472a7425106c.mockapi.io/todos/${id}`,
      {
        method: "PUT", // Use the PUT HTTP method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          // Add any other headers if needed
        },
        body: JSON.stringify(requestData), // Convert the data to JSON format
      }
    );

    const data = res.json();
    return data;
  } catch (error) {
    alert("oh shit my server is  fucked up ! Data cannot be updated:", error);
  }
}
async function postData(requestData) {
  // upadte localStorage
  const oldData = JSON.parse(localStorage.getItem("events"));
  oldData.push(requestData);
  localStorage.setItem("events", JSON.stringify(await oldData));

  try {
    const res = await fetch(
      `https://63e09c6b59bb472a7425106c.mockapi.io/todos`,
      {
        method: "POST", // Use the PUT HTTP method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          // Add any other headers if needed
        },
        body: JSON.stringify(requestData), // Convert the data to JSON format
      }
    );

    const data = res.json();
    return data;
  } catch (error) {
    alert("oh shit my server is  fucked up ! Data cannot be updated:", error);
  }
}
async function deleteData(id) {
  // upadte localStorage
  const oldData = JSON.parse(localStorage.getItem("events"));
  var todoIndex = oldData.indexOf((item) => item.id == id);
  oldData.splice(todoIndex, 1); // colors = ["red","blue","green"]
  localStorage.setItem("events", JSON.stringify(await oldData));

  try {
    const res = await fetch(
      `https://63e09c6b59bb472a7425106c.mockapi.io/todos/${id}`,
      {
        method: "DELETE", // Use the DELETE HTTP method
      }
    );

    const data = res.json();
    return data;
  } catch (error) {
    alert("oh shit my server is  fucked up ! Data cannot be updated:", error);
  }
}
async function renderItems() {
  listItemWrapper.innerHTML = "";
  calendarObjWrapper.calendar.removeAllEvents();
  let dataArr = await fetchData();
  await dataArr.forEach((todo) => {
    if (
      todo.extendedProps.userName == userName &&
      checkTodayTask(
        todo,
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
      )
    ) {
      if (selectedCategory && todo.extendedProps.category == selectedCategory) {
        const li = document.createElement("li");
        li.classList.add("item");
        li.id = `item_${todo.id}`;
        li.draggable = "true";
        if (todo.extendedProps.isDone) {
          li.classList.add("checked");
        }
        li.style.backgroundColor = todo.backgroundColor;
        li.innerHTML = `
       <div class="actions">
          <div class="delete"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
              <path fill="currentColor"
                d="M11.5 6h5a2.5 2.5 0 0 0-5 0ZM10 6a4 4 0 0 1 8 0h6.25a.75.75 0 0 1 0 1.5h-1.31l-1.217 14.603A4.25 4.25 0 0 1 17.488 26h-6.976a4.25 4.25 0 0 1-4.235-3.897L5.06 7.5H3.75a.75.75 0 0 1 0-1.5H10ZM7.772 21.978a2.75 2.75 0 0 0 2.74 2.522h6.976a2.75 2.75 0 0 0 2.74-2.522L21.436 7.5H6.565l1.207 14.478ZM11.75 11a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75Zm5.25.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0v-8.5Z" />
            </svg></div>
          <div class="edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0L5 16ZM15 6l3 3m-5 11h8" />
            </svg>
          </div>
           <div class="submitEdit" >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093l3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>          </div>
        </div>
        <div class="top">
        <div class="title ">
          ${todo.title}
        </div>
        <input type="checkbox" ${
          todo.extendedProps.isDone ? "checked" : ""
        } name="isDone" >
      </div>

     
      `;

        li.addEventListener("dragstart", () => {
          // Adding dragging class to item after a delay
          setTimeout(() => li.classList.add("dragging"), 0);
        });
        // Removing dragging class from item on dragend event
        li.addEventListener("dragend", () => li.classList.remove("dragging"));
        listItemWrapper.appendChild(li);
      } else if (selectedCategory == "" || selectedCategory == "عمومی") {
        const li = document.createElement("li");
        li.classList.add("item");
        li.id = `item_${todo.id}`;
        li.draggable = "true";
        if (todo.extendedProps.isDone) {
          li.classList.add("checked");
        }
        li.style.backgroundColor = todo.backgroundColor;
        li.innerHTML = `
       <div class="actions">
          <div class="delete"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
              <path fill="currentColor"
                d="M11.5 6h5a2.5 2.5 0 0 0-5 0ZM10 6a4 4 0 0 1 8 0h6.25a.75.75 0 0 1 0 1.5h-1.31l-1.217 14.603A4.25 4.25 0 0 1 17.488 26h-6.976a4.25 4.25 0 0 1-4.235-3.897L5.06 7.5H3.75a.75.75 0 0 1 0-1.5H10ZM7.772 21.978a2.75 2.75 0 0 0 2.74 2.522h6.976a2.75 2.75 0 0 0 2.74-2.522L21.436 7.5H6.565l1.207 14.478ZM11.75 11a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75Zm5.25.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0v-8.5Z" />
            </svg></div>
          <div class="edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0L5 16ZM15 6l3 3m-5 11h8" />
            </svg>
          </div>
           <div class="submitEdit" >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093l3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>          </div>
        </div>
        <div class="top">
        <div class="title ">
          ${todo.title}
        </div>
        <input type="checkbox" ${
          todo.extendedProps.isDone ? "checked" : ""
        } name="isDone" >
      </div>

     
      `;

        li.addEventListener("dragstart", () => {
          // Adding dragging class to item after a delay
          setTimeout(() => li.classList.add("dragging"), 0);
        });
        // Removing dragging class from item on dragend event
        li.addEventListener("dragend", () => li.classList.remove("dragging"));
        listItemWrapper.appendChild(li);
        // if (todo.extendedProps.userName == userName) {
        //   // add event to the calendar
        //   calendarObjWrapper.calendar.addEvent(todo);
        //   // add personalCategories to the list
        //   if (!autocompleteOptions.includes(todo.extendedProps.category)) {
        //     autocompleteOptions.push(todo.extendedProps.category);
        //     renderCategorySelectOptions(autocompleteOptions);
        //   }
        // }
      }
      // add personalCategories to the list
      if (todo.extendedProps.userName == userName) {
        // add event to the calendar
        calendarObjWrapper.calendar.addEvent(todo);
      }
      if (!autocompleteOptions.includes(todo.extendedProps.category)) {
        autocompleteOptions.push(todo.extendedProps.category);
        renderCategorySelectOptions(autocompleteOptions);
      }
    }
  });
  listItemWrapper.addEventListener("dragover", initSortableList);
  listItemWrapper.addEventListener("dragenter", (e) => e.preventDefault());

  [...listItemWrapper.querySelectorAll("li")].forEach((listItem) => {
    // checkbox
    listItem
      .querySelector("input[type='checkbox']")
      .addEventListener("click", (e) => {
        handleDoneState(e);
      });

    // editBtn
    listItem.querySelector(".edit").addEventListener("click", (e) => {
      handleEdit(e);
    });
    // deleteBtn
    listItem.querySelector(".delete").addEventListener("click", (e) => {
      handleDelete(e);
    });
    // submitEdit
    listItem.querySelector(".submitEdit").addEventListener("click", (e) => {
      handleSubmitEdit(e);
    });
  });
}

function initSortableList(e) {
  e.preventDefault();

  const draggingItem = document.querySelector(".dragging");
  // Getting all items except currently dragging and making array of them
  let siblings = [...listItemWrapper.querySelectorAll(".item:not(.dragging)")];

  // Finding the sibling after which the dragging item should be placed
  let nextSibling = siblings.find((sibling) => {
    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
  });

  // Inserting the dragging item before the found sibling
  listItemWrapper.insertBefore(draggingItem, nextSibling);
}

async function handleDoneState(e) {
  const todoId = e.target.closest(`[id*="item"]`).id.split("_")[1];
  const todoList = await fetchData();
  const Findedtodo = await todoList.find((todo) => todo.id == Number(todoId));

  if (await Findedtodo) {
    Findedtodo.extendedProps.isDone = !Findedtodo.extendedProps.isDone;
    await putData(Findedtodo, todoId);
    renderItems();
  }
}
function handleEdit(e) {
  const todoId = e.target.closest(".item").id.split("_")[1];
  e.target.closest(".item").querySelector(".title").innerHTML = `
  <input placeholder="متن خود را اینجا ویرایش کنید" value="${
    e.target.closest(".item").querySelector(".title").innerText
  }">
  `;
  e.target.closest(".edit").style.display = "none";
  e.target.closest(".item").querySelector(".submitEdit").style.display = "flex";
  e.target.closest(".item").id.split("_")[1];
  e.target
    .closest(".item")
    .querySelector(".title")
    .querySelector("input")
    .addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        e.target.closest(".item").querySelector(".submitEdit").click();
      }
    });
}
async function handleSubmitEdit(e) {
  const todoId = e.target.closest(".item").id.split("_")[1];
  const newValue = e.target
    .closest(".item")
    .querySelector(".title")
    .querySelector("input").value;
  const todoList = await fetchData();
  const Findedtodo = await todoList.find((item) => item.id == todoId);
  if (await Findedtodo) {
    Findedtodo.title = newValue;
    await putData(Findedtodo, todoId);
    renderItems();
  }
}
async function handleDelete(e) {
  const todoId = e.target.closest(".item").id.split("_")[1];
  await deleteData(todoId);
  await renderItems();
}
document
  .querySelector(".inputWrapper")
  .querySelector(".sendBtn")
  .addEventListener("click", async (event) => {
    const title = event.target
      .closest(".inputWrapper")
      .querySelector("input").value;
    let color = event.target.closest(".inputWrapper").style.backgroundColor;

    if (title) {
      if (/^rgb/.test(color)) {
        const rgba = color.replace(/^rgba?\(|\s+|\)$/g, "").split(",");

        // rgb to hex
        // eslint-disable-next-line no-bitwise
        let hex = `#${(
          (1 << 24) +
          (parseInt(rgba[0], 10) << 16) +
          (parseInt(rgba[1], 10) << 8) +
          parseInt(rgba[2], 10)
        )
          .toString(16)
          .slice(1)}`;

        // added alpha param if exists
        if (rgba[4]) {
          const alpha = Math.round(0o1 * 255);
          const hexAlpha = (alpha + 0x10000)
            .toString(16)
            .substr(-2)
            .toUpperCase();
          hex += hexAlpha;
        }

        color = hex + "80";
      } else if (color == "") {
        color = "#5bc0ff80";
      }
      const todoObject = {
        id: Date.now(),
        title: title,
        allDay: true,
        start: new Date(),
        end: new Date(),
        classNames: ["border-0"],
        backgroundColor: color,
        extendedProps: {
          userName: userName,
          isDone: false,
          category: categoryInput.value == "" ? "عمومی" : categoryInput.value,
        },
      };
      await postData(todoObject);
      event.target.closest(".inputWrapper").querySelector("input").value = "";
      event.target.closest(".inputWrapper").style.backgroundColor = "";
      categoryInput.value = "";
      await renderItems();
    }
  });
document
  .querySelector(".inputWrapper")
  .querySelector(".mainText")
  .querySelector("input")
  .addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      document.querySelector(".inputWrapper").querySelector(".sendBtn").click();
    }
  });

document
  .querySelector(".TaskColorSeletor")
  .querySelectorAll("span")
  .forEach((elm) => {
    elm.addEventListener("click", (e) => {
      document
        .querySelector(".TaskColorSeletor")
        .querySelectorAll("span")
        .forEach((item) => {
          item.style.width = "";
          item.style.height = "";
        });
      e.target.style.width = "18px";
      e.target.style.height = "18px";
      const selectedColor = e.target.getAttribute("value");
      e.target.closest(".inputWrapper").style.backgroundColor =
        e.target.getAttribute("value");
    });
  });

document.addEventListener("DOMContentLoaded", async () => {
  await renderCalendar();
  await renderItems();
});

async function renderCalendar() {
  const res = await fetch("/assets/script/calendar.js");
  const JSText = await res.text();
  const scriptTag = document.createElement("script");
  scriptTag.textContent = JSText;
  document.body.appendChild(scriptTag);
  const calendarElm = document.querySelector("#calendar");

  calendarObjWrapper.calendar = calendarObjWrapper.constructor(
    calendarElm,
    true,
    {
      eventChange: async (info) => {
        const data = info.event.toJSON();

        if (typeof data.end == "undefined") {
          data.end = "";
        }

        await putData(data, data.id);
        await renderItems();
      },
      eventClick: (info) => {
        console.log(info.event.toJSON());
      },
    }
  );

  if (document.body.offsetWidth < 1200) {
    calendarObjWrapper.calendar.setOption("height", "60vh");
  } else {
    calendarObjWrapper.calendar.setOption("height", "100vh");
  }

  calendarObjWrapper.calendar.render();
}

// async function calendarOnEventChange(info) {
//   //const json = MyCalendar.calendar.getEvents().map((event) => event.toJSON());

// }

function checkTodayTask(calendarEvent, compareDate) {
  const inTheMiddleOfEvent =
    compareDate >= new Date(calendarEvent.start) &&
    compareDate <= new Date(calendarEvent.end);
  if (
    inTheMiddleOfEvent ||
    new Date(calendarEvent.start).toDateString() === compareDate.toDateString()
  ) {
    return true;
  } else return false;
}
