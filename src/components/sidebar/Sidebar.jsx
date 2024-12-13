import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);
  const navigate = useNavigate(); // Hook to navigate to another page

  const loadPreviousPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
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
        <div className="new-tab">
          <i
            className="fa fa-plus"
            aria-hidden="true"
            onClick={() => {
              navigate("/");
            }}
          ></i>

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

        <div className="new-tab">
          <i
            className="fa fa-check-square-o"
            aria-hidden="true"
            onClick={() => {
              navigate("/todo"); // Navigate to the To-Do page
            }}
          ></i>
          {extended ? <p>To-Do</p> : null}
        </div>

        {/* New Calendar Button */}
        <div className="new-tab">
          <i
            className="fa fa-calendar"
            aria-hidden="true"
            onClick={() => {
              navigate("/calendar"); // Navigate to the Calendar page
            }}
          ></i>
          {extended ? <p>Calendar</p> : null}
        </div>
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
      </div>
    </div>
  );
};

export default Sidebar;
