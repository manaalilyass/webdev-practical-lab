// Grab elements from the page
const form = document.getElementById("expense-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const filterInput = document.getElementById("filter");
const errorMsg = document.getElementById("error");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const emptyMsg = document.getElementById("empty-msg");

// Load saved expenses (if any) so they stay after a refresh
let expenses = [];
try {
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];
} catch (e) {
  expenses = [];
}

function saveExpenses() {
  try {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (e) {
    // storage not available - app still works, just won't persist
  }
}

function formatMoney(num) {
  return "₹" + num.toFixed(2);
}

// Draw the list and total based on the current filter
function render() {
  const selected = filterInput.value;
  list.innerHTML = "";

  const visible = expenses.filter(function (exp) {
    return selected === "All" || exp.category === selected;
  });

  let total = 0;

  visible.forEach(function (exp) {
    total += exp.amount;

    const li = document.createElement("li");
    li.className = "expense-item " + exp.category;

    const info = document.createElement("div");
    info.className = "expense-info";

    const nameEl = document.createElement("div");
    nameEl.className = "expense-name";
    nameEl.textContent = exp.name;

    const catEl = document.createElement("div");
    catEl.className = "expense-category";
    catEl.textContent = exp.category;

    info.appendChild(nameEl);
    info.appendChild(catEl);

    const amountEl = document.createElement("div");
    amountEl.className = "expense-amount";
    amountEl.textContent = formatMoney(exp.amount);

    const delBtn = document.createElement("button");
    delBtn.className = "btn-delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", function () {
      deleteExpense(exp.id);
    });

    li.appendChild(info);
    li.appendChild(amountEl);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  totalEl.textContent = formatMoney(total);
  emptyMsg.style.display = visible.length === 0 ? "block" : "none";
}

function deleteExpense(id) {
  expenses = expenses.filter(function (exp) {
    return exp.id !== id;
  });
  saveExpenses();
  render();
}

// Handle the Add Expense form
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const amountText = amountInput.value.trim();
  const amount = parseFloat(amountText);
  const category = categoryInput.value;

  // Validation
  if (name === "" || amountText === "") {
    errorMsg.textContent = "Please fill in both the name and the amount.";
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    errorMsg.textContent = "Amount must be a number greater than 0.";
    return;
  }

  errorMsg.textContent = "";

  expenses.push({
    id: Date.now(),
    name: name,
    amount: amount,
    category: category
  });

  saveExpenses();
  render();

  form.reset();
  nameInput.focus();
});

// Re-draw when the filter changes
filterInput.addEventListener("change", render);

// First draw when the page loads
render();
