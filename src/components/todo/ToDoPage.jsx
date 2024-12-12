import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./todopage.css";

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (
      taskInput.trim() !== "" &&
      dateInput.trim() !== "" &&
      startTime &&
      endTime
    ) {
      const newTask = {
        task: taskInput,
        date: dateInput,
        timeRange: `${startTime.format("h:mm A")} - ${endTime.format("h:mm A")}`,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskInput("");
      setDateInput("");
      setStartTime(null);
      setEndTime(null);
    }
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-page">
      <div className="logo-container">
        <i className="fa fa-check-circle logo"></i> {/* FontAwesome Logo */}
      </div>
      <h1>Task List</h1>
      <div className="task-input">
        <input
          type="text"
          id="task"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
      </div>
      <div className="date-time-input">
        <input
          type="date"
          id="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="time-picker-container">
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              renderInput={(props) => <TextField {...props} />}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              renderInput={(props) => <TextField {...props} />}
            />
          </div>
        </LocalizationProvider>
      </div>
      <button onClick={addTask} className="add-task-btn">Add Task</button>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index}>
            <div className="task-details">
              <span className="task-text">{task.task}</span>
              <span className="task-date">{task.date}</span>
              <span className="task-time">{task.timeRange}</span>
            </div>
            <button onClick={() => deleteTask(index)} className="delete-btn">
              <i className="fa fa-trash"></i> {/* FontAwesome Trash Icon */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
