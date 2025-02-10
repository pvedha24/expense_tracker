<template>
 <Header :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode"/>
 <div class="container">
  <Balance :total="+total"/>
<p class="roast-message">{{ roastMessage }}</p>
  <IncomeExpense :income="+income" :expenses="+expenses"/>
  <TransactionList :transactions="transactions" @transaction-deleted="handleTransactionDeleted" />
  <AddTransaction 
  @transaction-submitted="handleTransactionSumbitted"/>
 </div>
  
    
</template>
<script setup>
import Header from './components/Header.vue';
import Balance from './components/Balance.vue';
import IncomeExpense from './components/IncomeExpense.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';

import { useToast } from 'vue-toastification';  

import { ref , computed, onMounted ,handleError } from 'vue';
import { generateCodeFrame } from 'vue/compiler-sfc';

const toast = useToast();
const transactions = ref([]);
const roastMessage = ref("");

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

// Apply dark mode on mount
onMounted(() => {
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode');
  }
  const savedTransactions = JSON.parse(localStorage.getItem('transactions'));
  if (savedTransactions) {
    transactions.value = savedTransactions;
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

const handleTransactionSumbitted=(transactionData)=>{
transactions.value.push({
    id: generateUniqueId(),
    text: transactionData.text,
    amount: transactionData.amount
});
saveTransactionsToLocalStorage();
const totalBalance = transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);

  // Update roast message based on the total balance
  roastMessage.value = getRoastMessage(totalBalance);
};







const generateUniqueId = () => {
    return Math.floor(Math.random() * 100000000);
};
const handleTransactionDeleted = (id) => {
    transactions.value = transactions.value.filter(transaction => transaction.id !== id);
    toast.success('Transaction deleted successfully');
};

const saveTransactionsToLocalStorage = () => {
    localStorage.setItem('transactions',JSON.stringify(transactions.value));
};
</script>