import React, { useState } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./todopage.css";

const TodoPage = () => {
  const [tasks, setTasks] = useState([
    {
      task: "Complete React project",
      date: "2024-12-12",
      timeRange: "9:00 AM - 12:00 PM",
    },
    {
      task: "Attend meeting with client",
      date: "2024-12-13",
      timeRange: "2:00 PM - 4:00 PM",
    },
    {
      task: "Submit the report",
      date: "2024-12-15",
      timeRange: "10:00 AM - 11:30 AM",
    },
  ]);
  const [taskInput, setTaskInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const addTask = () => {
    if (
      taskInput.trim() !== "" &&
      dateInput.trim() !== "" &&
      startTime &&
      endTime
    ) {
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          task: taskInput,
          date: dateInput,
          timeRange: `${startTime.format("h:mm A")} - ${endTime.format("h:mm A")}`,
        },
      ]);
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
