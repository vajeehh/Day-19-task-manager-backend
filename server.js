require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Task = require("./models/Task");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    })
    .catch(err => {
        console.log(err);
    });

// Get all tasks sorted by creation date
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
});

// Add new task
app.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
});

// Update task
app.put("/tasks/:id", async (req, res) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(task);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
        msg: "Task deleted"
    });
});