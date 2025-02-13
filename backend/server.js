const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const TransactionSchema = new mongoose.Schema({
    text: String,
    amount: Number,
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

// app.get('/transactions', async (req, res) => {
//     const transactions = await Transaction.find();
//     res.json(transactions);
// });

app.get("/transactions", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});






app.post('/transactions', async (req, res) => {
    console.log("Incoming Data:", req.body); // Debugging
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        console.log("Saved Transaction:", newTransaction); // Debugging
        res.json(newTransaction);
    } catch (error) {
        console.error("Error Saving Transaction:", error);
        res.status(500).json({ error: error.message });
    }
});





app.delete('/transactions/:id', async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted!", deletedTransaction });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});


const PORT = process.env.PORT || 5001; // Use environment variable or default to 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

