import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { createTask, updateTaskInFirestore } from "../firebase/tasks.ts";
import "./TaskForm.css"; // Import the external CSS file

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const taskToEdit = tasks.find((task) => task.id === id);

  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [category, setCategory] = useState(taskToEdit?.category || "");
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate || "");
  const [status, setStatus] = useState(taskToEdit?.status || "ToDo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask = {
      id: taskToEdit?.id || "",
      title,
      description,
      category,
      dueDate,
      createdAt: taskToEdit?.createdAt || new Date().toISOString(), // Use existing or generate new
      status,
    };
    if (id) {
      updateTaskInFirestore(updatedTask, dispatch);
    } else {
      createTask(updatedTask, dispatch);
    }
    // Clear form fields after submission
    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate("");
    setStatus("ToDo");
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setDueDate(taskToEdit.dueDate);
    }
  }, [taskToEdit]);

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2 className="form-title">{id ? "Edit Task" : "Create New Task"}</h2>
      <div className="form-group">
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Task Description</label>
        <textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          placeholder="Enter task category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="status">Task Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="ToDo">ToDo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="form-submit-button">
        {id ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;
