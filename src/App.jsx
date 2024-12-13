import Main from "./components/main/Main";
import Sidebar from "./components/sidebar/Sidebar";
import TodoPage from "./components/todo/ToDoPage";
import CalendarPage from "./components/calender/CalenderPage.jsx"
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/todo" element={<TodoPage />} />{" "}
        <Route path="/calendar" element={<CalendarPage />} />
        {/* Route for the To-Do page */}
        {/* Add other routes if necessary */}
      </Routes>
    </>
  );
};

export default App;
