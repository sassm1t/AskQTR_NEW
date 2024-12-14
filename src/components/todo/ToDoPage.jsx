import React, { useState, useEffect, useContext } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./todopage.css";
import { Context } from "../../context/Context";
import {CheckCircleOutlined,} from "@ant-design/icons";


const TodoPage = () => {
  const { tasks, updateTasks } = useContext(Context);
  const [taskInput, setTaskInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (Array.isArray(savedTasks)) {
      updateTasks(savedTasks);
    } else {
      updateTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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
      updateTasks([...tasks, newTask]);
      setTaskInput("");
      setDateInput("");
      setStartTime(null);
      setEndTime(null);
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    updateTasks(updatedTasks);
  };

  return (
    <div className="todo-page">
      <div className="logo-container">
      <CheckCircleOutlined style={{ fontSize: "35px", color: "#7F8AC7" }}/>
      </div>
      <h1>Task List</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
      </div>
      <div className="date-time-input">
        <input
          type="date"
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
              <i className="fa fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
