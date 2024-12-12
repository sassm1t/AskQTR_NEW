import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import TaskScheduler from "../taskScheduler/TaskScheduler.jsx";  // Import TaskScheduler component

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);
  const [showTaskScheduler, setShowTaskScheduler] = useState(false); // New state to control TaskScheduler visibility

  const loadPreviousPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  // Toggle TaskScheduler visibility
  const toggleTaskScheduler = () => {
    setShowTaskScheduler((prev) => !prev);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          src={assets.menu_icon}
          className="menu"
          alt="menu-icon"
          onClick={() => {
            setExtended((prev) => !prev);
          }}
        />
        <div className="new-chat">
          <img
            src={assets.plus_icon}
            alt=""
            onClick={() => {
              newChat();
            }}
          />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    loadPreviousPrompt(item);
                  }}
                  className="recent-entry"
                  key={index}
                >
                  <img src={assets.message_icon} alt="" />
                  <p>{item.slice(0, 18)}...</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help desk</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>History</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
        {/* New Task Scheduler button */}
        <div className="bottom-item recent-entry" onClick={toggleTaskScheduler}>
          <img src={assets.task_icon} alt="task-icon" /> {/* Add a task icon */}
          {extended ? <p>Task Scheduler</p> : null}
        </div>
      </div>
      {/* Optionally, show TaskScheduler here if the state is true */}
      {showTaskScheduler && <TaskScheduler />}
    </div>
  );
};

export default Sidebar;
