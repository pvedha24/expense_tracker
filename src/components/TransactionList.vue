<template>
    <h3>History</h3>
    <ul id="list" class="list">
    
       <!-- <li v-for="transaction in transactions" :key="transaction.id" :class="transaction.amount < 0 ? 'minus':'plus'" >
       {{ transaction.text }}<span>${{ transaction.amount }}</span><button @click ="deleteTransaction(transaction)" class="delete-btn">x</button>
       
    </li> -->
       

    <li v-for="transaction in transactions" :key="transaction.id" 
    :class="transaction.type === 'expense' ? 'minus' : 'plus'">
  {{ transaction.text }} 
  <span>${{ transaction.amount }}</span>
  <button @click="deleteTransaction(transaction)" class="delete-btn">x</button>
</li>


       
    </ul>
</template>

<script setup>

import axios from "axios";
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(['TransactionDeleted']);

const props = defineProps({
    transactions: {
        type: Array,
        required: true,
    },

});
// const deleteTranscation = (id) => {
//    emit('TransactionDeleted', id);
// };

const deleteTransaction = async (transaction) => {
  console.log("🛠️ Transaction Data Received:", transaction); // Debugging Log
  if (!transaction || !transaction._id) {
    console.error("❌ ERROR: Transaction ID is undefined!");
    return;
  }

  try {
    console.log("Attempting to delete transaction with ID:", transaction._id);
    await axios.delete(`http://localhost:5001/transactions/${transaction._id}`);
    console.log("✅ Successfully deleted transaction:", transaction._id);
    emit("transaction-deleted", transaction._id);
  } catch (error) {
    console.error("❌ Failed to delete transaction:", error.response || error);
  }
};

</script>

