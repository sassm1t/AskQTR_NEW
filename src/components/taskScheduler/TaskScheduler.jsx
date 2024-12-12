// src/components/taskScheduler/TaskScheduler.js
import React, { useState } from "react";
import "./TaskScheduler.css";  // The CSS for styling

const TaskScheduler = () => {
  const [taskName, setTaskName] = useState("");  // State for task name
  const [startTime, setStartTime] = useState("");  // State for task start time
  const [endTime, setEndTime] = useState("");  // State for task end time
  const [tasks, setTasks] = useState([]);  // State to store all tasks

  // Function to handle adding a new task
  const handleAddTask = () => {
    if (taskName && startTime && endTime) {
      // Add new task to the list
      setTasks([...tasks, { taskName, startTime, endTime }]);
      // Clear input fields after adding task
      setTaskName("");
      setStartTime("");
      setEndTime("");
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="task-scheduler">
      <h2>Task Scheduler</h2>

      {/* Task input form */}
      <div className="task-form">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Display list of tasks */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks scheduled.</p>
        ) : (
          tasks.map((task, index) => (
            <div key={index} className="task-item">
              <p><strong>{task.taskName}</strong></p>
              <p>Start: {task.startTime}</p>
              <p>End: {task.endTime}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskScheduler;
