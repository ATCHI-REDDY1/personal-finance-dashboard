
const form = document.getElementById("transactionForm");
const descriptionInput =document.getElementById("description");
const amountInput =document.getElementById("amount");
const typeInput =document.getElementById("type");
const categoryInput =document.getElementById("category");
const dateInput =document.getElementById("date");
const transactionList =document.getElementById("transactionList");
const balanceElement =document.getElementById("balance");
const incomeElement =document.getElementById("income");
const expenseElement =document.getElementById("expense");
const searchInput =document.getElementById("search");
let transactions =JSON.parse(localStorage.getItem("transactions")) || [];
const today = new Date();
document.getElementById("currentDate").textContent =
    today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
dateInput.value =
    today.toISOString().split("T")[0];
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const transaction = {
        id: Date.now(),
        description:
            descriptionInput.value,
        amount:
            Number(amountInput.value),
        type:
            typeInput.value,
        category:
            categoryInput.value,
        date:
            dateInput.value
    };
    transactions.push(transaction);
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
    form.reset();
    dateInput.value =
    updateDashboard();
});
function updateDashboard() {
    calculateSummary();
    displayTransactions();
    updateChart();
}
function calculateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });
    const balance =totalIncome - totalExpense;
    incomeElement.textContent =formatCurrency(totalIncome);
    expenseElement.textContent =formatCurrency(totalExpense);
    balanceElement.textContent =formatCurrency(balance);

}
function displayTransactions() {
    transactionList.innerHTML = "";
    const searchText =
        searchInput.value.toLowerCase();
    const filteredTransactions =
        transactions.filter(function(transaction) {
            return transaction.description
                .toLowerCase()
                .includes(searchText);
        });
    filteredTransactions
        .slice()
        .reverse()
        .forEach(function(transaction) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${transaction.description}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${transaction.date}
                </td>

                <td class="${transaction.type}">
                    ${transaction.type}
                </td>

                <td class="${transaction.type}">
                    ${transaction.type === "income"
                        ? "+"
                        : "-"
                    }
                    ${formatCurrency(transaction.amount)}
                </td>

                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})">
                        Delete
                    </button>
                </td>

            `;


            transactionList.appendChild(row);

        });

}


// ================================
// Delete transaction
// ================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(function(transaction) {

            return transaction.id !== id;

        });


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    updateDashboard();

}


// ================================
// Search transactions
// ================================

searchInput.addEventListener(
    "input",
    displayTransactions
);


// ================================
// Format currency
// ================================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


// ================================
// Expense Chart
// ================================

let expenseChart;


function updateChart() {

    const categoryTotals = {};


    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] = 0;

            }


            categoryTotals[transaction.category]
                += transaction.amount;

        }

    });


    const labels =
        Object.keys(categoryTotals);


    const values =
        Object.values(categoryTotals);


    const ctx =
        document.getElementById("expenseChart");


    // Destroy previous chart

    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: values,

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// ================================
// Dark Mode
// ================================

const darkModeBtn =
    document.getElementById("darkModeBtn");


darkModeBtn.addEventListener(
    "click",
    function() {
        document.body.classList.toggle("dark");

        if (
            document.body.classList.contains("dark")
        ) {

            darkModeBtn.textContent =
                "☀️ Light Mode";

        } else {

            darkModeBtn.textContent =
                "🌙 Dark Mode";

        }

    }
);

updateDashboard();