const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");

// Category Elements
const groceriesEl = document.getElementById("groceries");
const foodEl = document.getElementById("food");
const travelEl = document.getElementById("travel");
const clothingEl = document.getElementById("clothing");

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add Transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            category: category.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Generate Random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Add Transactions to DOM List
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        ${transaction.text} <span>${sign}&#8377;${Math.abs(transaction.amount)}</span> 
        <small>(${transaction.category})</small>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Update Balance, Income, Expense & Categories
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerHTML = `&#8377;${total}`;
    money_plus.innerHTML = `+&#8377;${income}`;
    money_minus.innerHTML = `-&#8377;${expense}`;

    // Category-wise calculation
    updateCategoryValues();
}

// Update Category Expenses
function updateCategoryValues() {
    const categoryTotals = {
        groceries: 0,
        food: 0,
        travel: 0,
        clothing: 0,
    };

    transactions.forEach(transaction => {
        if (transaction.amount < 0) {
            categoryTotals[transaction.category] += Math.abs(transaction.amount);
        }
    });

    groceriesEl.innerHTML = `&#8377;${categoryTotals.groceries.toFixed(2)}`;
    foodEl.innerHTML = `&#8377;${categoryTotals.food.toFixed(2)}`;
    travelEl.innerHTML = `&#8377;${categoryTotals.travel.toFixed(2)}`;
    clothingEl.innerHTML = `&#8377;${categoryTotals.clothing.toFixed(2)}`;
}

// Remove Transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
}

// Update Local Storage Transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize App
function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}

Init();

form.addEventListener('submit', addTransaction);
