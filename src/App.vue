const total = computed(() => {
  return income.value - expenses.value; // Subtract expenses from income
 });
 <template>
  <Header :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode"/>
  <div class="container">
   <Balance :total="+total"/>
 <p class="roast-message">{{ roastMessage }}</p>
   <IncomeExpense :income="+income" :expenses="+expenses"/>
 <TransactionList :transactions="transactions" @transaction-deleted="handleTransactionDeleted" />
   <AddTransaction @transaction-submitted="handleTransactionSubmitted"/>
   </div>
  
    
 </template>
 <script setup>
 import Header from './components/Header.vue';
 import Balance from './components/Balance.vue';
 import IncomeExpense from './components/IncomeExpense.vue';
 import TransactionList from './components/TransactionList.vue';
 import AddTransaction from './components/AddTransaction.vue';
 import { useToast } from 'vue-toastification'; 
 import axios from 'axios';
 import { ref , computed, onMounted ,handleError } from 'vue';
 import { generateCodeFrame } from 'vue/compiler-sfc';
 const toast = useToast();
 const transactions = ref([]);
 const roastMessage = ref("");

 
 const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
 onMounted(() => {
   if (isDarkMode.value) {
     document.body.classList.add('dark-mode');
   }
  });

 const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
  localStorage.setItem('darkMode', isDarkMode.value);
};

const total = computed(() => {
            return transactions.value.reduce((acc, transaction) => {
                return acc + transaction.amount;
            },0);
        });
        const income = computed(() => {
            return transactions.value
            .filter(transaction => transaction.amount > 0)
            .reduce((acc, transaction) => {
                return acc + transaction.amount;
            },0).toFixed(2);  
        });

        const expenses = computed(() => {
            return transactions.value
            .filter(transaction => transaction.amount < 0)
            .reduce((acc, transaction) => {
                return acc + transaction.amount;
            },0).toFixed(2);  
        });

const getRoastMessage = (totalBalance) => {
  if (totalBalance < -1000) {
    return "Bro, are you buying a private island or just setting money on fire? 🔥😂";
  } else if (totalBalance < -500) {
    return "You spending like a millionaire, but your bank balance is crying. 💸😭";
  } else if (totalBalance < -200) {
    return "Hmm... treating yourself, huh? Hope your wallet agrees! 🤔";
  } else if (totalBalance >= 0) {
    return "Nice budgeting! Your wallet is proud of you. 🎉";
  } else {
    return ""; // No message if it's neutral
  }
};


// const handleTransactionSubmitted = async (transactionData) => {
//    try {
//     const res = await axios.post('http://localhost:5001/transactions', transactionData);
//     await fetchTransactions();
//        toast.success("Transaction added successfully! ✅");


//        // Update roast message
//        const totalBalance = transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);
//        roastMessage.value = getRoastMessage(totalBalance);
//    } catch (error) {
//        toast.error("Error adding transaction ❌");
//    }
// };





const handleTransactionSubmitted = async (transactionData) => {
    const transactionAmount = transactionData.amount;

    // Check if the transaction is an expense and exceeds balance
    if (transactionAmount < 0 && Math.abs(transactionAmount) > total.value) {
        toast.error("You don't have sufficient balance.");
        return;
    }

    try {
        const res = await axios.post('http://localhost:5001/transactions', transactionData);
        await fetchTransactions();
        toast.success("Transaction added successfully! ✅");

        // Update roast message after transaction
        const totalBalance = transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);
        roastMessage.value = getRoastMessage(totalBalance);
    } catch (error) {
        toast.error("Error adding transaction ❌");
    }
};




const generateUniqueId = () => {
    return Math.floor(Math.random() * 100000000);
};
//  const handleTransactionDeleted = (id) => {
//     transactions.value = transactions.value.filter(transaction => transaction._id !== id);
//     toast.success("Transaction deleted from UI! 🗑️");
// };


const handleTransactionDeleted = (id) => {
   console.log("Deleting transaction from UI with ID:", id);
   console.log("Current transactions before deletion:", transactions.value);


   const filteredTransactions = transactions.value.filter(transaction => transaction._id !== id);


   console.log("Transactions after filtering:", filteredTransactions);


   if (filteredTransactions.length === transactions.value.length) {
       console.warn("No transaction was removed! Check if the ID exists.");
   } else {
       console.log("Transaction successfully removed from UI.");
   }


   transactions.value = filteredTransactions;
   toast.success("Transaction deleted from UI!");
};













const fetchTransactions = async () => {
   try {
       console.log("Fetching transactions from backend...");
       const response = await axios.get("http://localhost:5001/transactions");
       transactions.value = response.data;
       console.log("Transactions received:", transactions.value);
   } catch (error) {
       console.error("Error fetching transactions:", error);
   }
};
onMounted(fetchTransactions);
const addTransaction = async (transactionData) => {
    try {
        const res = await axios.post('http://localhost:5001/transactions', transactionData);
        transactions.value.push(res.data);
        toast.success("Transaction added successfully! ✅");
    } catch (error) {
        toast.error("Error adding transaction ❌");
    }
};

const deleteTransaction = async (id) => {
   try {
       console.log("Attempting to delete transaction with ID:", id);
      
       const response = await axios.delete(`http://localhost:5001/transactions/${id}`);
       console.log("Delete response:", response);


       toast.success("Transaction deleted! 🗑️");


       // Fetch the latest transactions from the database
       console.log("Fetching updated transactions...");
       await fetchTransactions();
       console.log("Transactions successfully fetched.");
   } catch (error) {
       console.error("Error deleting transaction:", error);
       toast.error("Failed to delete transaction ❌");
   }
};



</script>



