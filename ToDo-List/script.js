// --- DOM Elemanlarını Seçme ---
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

// --- Uygulama State'i (Durumu) ---
let todos = []; 
let currentFilter = "all"; 

// --- Olay Dinleyicileri (Event Listeners) ---
addTaskBtn.addEventListener("click", () => {
  addTodo(taskInput.value);
});

// Enter tuşuna basıldığında görev ekleme
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
});

// Tamamlanmış tüm görevleri temizleme butonu
clearCompletedBtn.addEventListener("click", clearCompleted);

/**
 * Yeni bir görev ekler.
 * @param {string} text - Kullanıcının girdiği görev metni
 */
function addTodo(text) {
  if (text.trim() === "") return; // Boş girişleri engelle

  const todo = {
    id: Date.now(), // Benzersiz bir ID için zaman damgası kullanıldı
    text,
    completed: false,
  };

  todos.push(todo);
  saveTodos(); // Veriyi kaydet
  renderTodos(); // Arayüzü güncelle
  taskInput.value = ""; // Inputu temizle
}

/**
 * Görevleri LocalStorage'a kaydeder ve sayaçları günceller.
 */
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

/**
 * Tamamlanmamış görev sayısını hesaplar ve ekrana yazar.
 */
function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed);
  itemsLeft.textContent = `${uncompletedTodos?.length} item${
    uncompletedTodos?.length !== 1 ? "s" : ""
  } left`;
}

/**
 * Listede görev yoksa "Boş Durum" görselini gösterir.
 */
function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos?.length === 0) emptyState.classList.remove("hidden");
  else emptyState.classList.add("hidden");
}

/**
 * Mevcut filtreye göre hangi görevlerin gösterileceğini belirler.
 */
function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

/**
 * Görev dizisini HTML listesine dönüştürür ve ekrana basar.
 * (DOM Manipülasyonunun merkezi burasıdır)
 */
function renderTodos() {
  todosList.innerHTML = ""; // Listeyi temizle

  const filteredTodos = filterTodos(currentFilter);

  filteredTodos.forEach((todo) => {
    // Liste elemanı (li) oluşturma
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) todoItem.classList.add("completed");

    // Checkbox yapısını oluşturma
    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    // Görev metni
    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    // Silme butonu
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    // Elemanları birbirine bağlama
    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(deleteBtn);

    todosList.appendChild(todoItem);
  });
}

/**
 * Tamamlanmış olan tüm görevleri diziden siler.
 */
function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

/**
 * Bir görevin tamamlanma durumunu (true/false) tersine çevirir.
 */
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

/**
 * ID'ye göre belirli bir görevi siler.
 */
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

/**
 * Uygulama başladığında tarayıcı hafızasındaki verileri yükler.
 */
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) todos = JSON.parse(storedTodos);
  renderTodos();
}

// --- Filtre Butonları İçin Event Listeners ---
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  });
});

/**
 * Aktif filtre stilini günceller ve listeyi yeniden render eder.
 */
function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((item) => {
    if (item.getAttribute("data-filter") === filter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  renderTodos();
}
/**
 * Üst kısımdaki güncel tarihi yerel formatta ayarlar.
 */
function setDate() {
  const options = { weekday: "long", day: "numeric", month: "short"};
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("TR", options);
}

// --- Uygulama Başlatıcı (Initializers) ---
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  updateItemsCount();
  setDate();
});