<!-- 
 <template>
    <h3>Add New Transaction</h3>
    <form id="form" @submit.prevent="onSubmit">
      <div class="form-control">
        <label for="text">Transaction Name</label>
        <input type="text" id="text" v-model="text" placeholder="Enter transaction name..." />
      </div>
  <div class="form-control">
    <label for="amount"
                >Amount <br />
                (negative - expense, positive - income)</label
            >
            <input type="text" id="amount" v-model="amount" placeholder="Enter amount..." />
          
      </div>
  
      <button class="btn">Add Transaction</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useToast } from 'vue-toastification';
  
  const text = ref('');
  
  const amount = ref('');
  
  const emit = defineEmits(['transactionSubmitted']);
  const toast = useToast();
  
  // Prevent negative values
  const validateAmount = () => {
    if (amount.value < 1) {
      amount.value = 1;
      toast.error('Amount must be a positive number');
    }
  };
  
  const onSubmit = () => {
    if (text.value === '' || amount.value === '' || isNaN(amount.value)) {
      toast.error('Please enter a valid transaction name and amount');
      return;
    }
  
    const transactionData = {
      text: text.value, // Transaction name
      amount: parseFloat(amount.value), // Always positive
      
    };
  
    emit('transactionSubmitted', transactionData);
  
    // Reset fields
    text.value = '';
    amount.value = '';
  };
  </script>
  
 -->


 <template>
  <h3>Add New Transaction</h3>
  <form id="form" @submit.prevent="onSubmit">
    <div class="form-control">
      <label for="text">Transaction Name</label>
      <input type="text" id="text" v-model="text" placeholder="Enter transaction name..." />
    </div>

    <div class="form-control">
      <label for="amount">Amount <br />(negative - expense, positive - income)</label>
      <input type="text" id="amount" v-model="amount" placeholder="Enter amount..." />
    </div>

    <button class="btn">Add Transaction</button>
  </form>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

const text = ref('');
const amount = ref('');
const toast = useToast();
const emit = defineEmits(['transactionSubmitted']);

const props = defineProps({
  balance: Number // Get balance from parent component
});

const onSubmit = () => {
  if (text.value === '' || amount.value === '' || isNaN(amount.value)) {
    toast.error('Please enter a valid transaction name and amount');
    return;
  }

  let transactionAmount = parseFloat(amount.value);

  // Check if it's an expense (negative value)
  if (transactionAmount < 0) {
    // Convert to positive (absolute value) but keep it as an expense
    if (Math.abs(transactionAmount) > props.balance) {
      toast.error("You don't have sufficient balance.");
      return;
    }
  }

  const transactionData = {
    text: text.value,
    amount: transactionAmount // Keep positive for income, negative for expense
  };

  emit('transactionSubmitted', transactionData);

  // Reset fields
  text.value = '';
  amount.value = '';
};
</script>
