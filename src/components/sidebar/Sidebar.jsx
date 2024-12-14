import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  QuestionCircleOutlined,
  HistoryOutlined,
  SettingOutlined,
  MenuOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

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
        <MenuOutlined
          className="menu"
          style={{ fontSize: "30px", color: "black" }}
          onClick={() => {
            setExtended((prev) => !prev);
          }}
        />

        <div className="new-tab">
          <PlusOutlined
            onClick={() => {
              navigate("/");
            }}
          />

          {extended ? <p className="para">New Chat</p> : null}
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
          <CheckCircleOutlined
            onClick={() => {
              navigate("/todo"); // Navigate to the To-Do page
            }}
          />
          {extended ? <p className="para">To-Do</p> : null}
        </div>

        {/* New Calendar Button */}
        <div className="new-tab">
        
          <CalendarOutlined onClick={() => {
              navigate("/calendar"); // Navigate to the Calendar page
            }} />
          {extended ? <p className="para">Calendar</p> : null}
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <QuestionCircleOutlined
            style={{ fontSize: "25px", color: "grey" }}
          />
          {extended ? <p>Help desk</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <HistoryOutlined style={{ fontSize: "25px", color: "grey" }} />
          {extended ? <p>History</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <SettingOutlined style={{ fontSize: "25px", color: "grey" }} />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
