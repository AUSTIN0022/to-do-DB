const express = require("express");
const router = express.Router({ mergeParams: true });
const List = require("../models/List");
const Todo = require("../models/Todo");
const { isLoggedIn } = require("../middleware/auth");

router.post("/update-checkbox/:todoId",  async (req, res) => {
    try {
        const { todoId } = req.params;
        const { checked } = req.body;

        // Validate `checked` is a boolean
        if (typeof checked !== 'boolean') {
            return res.status(400).json({ message: "Invalid input: 'checked' should be a boolean" });
        }
        // Update the todo
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            { done: checked },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        // Return the updated todo
        res.json({
            message: "Todo updated successfully",
            todo: updatedTodo
        });
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// POST /lists/:listId/todos - Add a new todo
router.post("/:listId/todos",  async (req, res) => {
    const { listId } = req.params;
    const list = await List.findById(listId);
    const todo = new Todo(req.body.todo);
    todo.owner = req.user._id;
    list.todos.push(todo);
    await todo.save();
    await list.save();
    req.flash("success", "Created new todo!");
    res.redirect(`/lists/${list._id}`);
});

// PUT /lists/:listId/todos/:todoId - Update a todo
router.put("/:listId/todos/:todoId",  async (req, res) => {
    const { listId, todoId } = req.params;
    await Todo.findByIdAndUpdate(todoId, { ...req.body.todo });
    req.flash("success", "Updated todo!");
    res.redirect(`/lists/${listId}`);
});

// DELETE /lists/:listId/todos/:todoId - Delete a todo
router.delete("/:listId/todos/:todoId", async (req, res) => {
    const { listId, todoId } = req.params;
    await List.findByIdAndUpdate(listId, { $pull: { todos: todoId } });
    await Todo.findByIdAndDelete(todoId);
    req.flash("success", "Deleted todo");
    res.redirect(`/lists/${listId}`);
});

module.exports = router;
