<template>
  <header>
    <h2>Expense Tracker</h2>
    <button class="toggle-btn" @click="$emit('toggle-dark-mode')">
      {{ isDarkMode ? '🌞' : '🌙' }}
    </button>
  </header>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  isDarkMode: Boolean
});
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  padding: 15px 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 2.2rem;
  color: white;
  margin: 0;
  flex: 1;
  text-align: center;
}

/* Dark Mode Toggle Button */
.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.toggle-btn:hover {
  transform: scale(1.1);
}

/* Responsive Styles */
@media (max-width: 768px) {
  h2 {
    font-size: 1.8rem;
  }
}
</style>
