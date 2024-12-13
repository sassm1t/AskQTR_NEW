import { createContext, useState } from "react";
import runChat from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "model",
      parts: [
        {
          text: "You are my personal assistant named AskQTR, always stick to your role. Your job is to help me manage my schedule, my to-do list, task, goals, identify undone work, etc.",
        },
      ],
    },
  ]);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 10 * index);
  };
  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };
  const [tasks, setTasks] = useState([]);

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
  };

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResults(true);
    let response;
    setPrevPrompts((prev) => [...prev, input]);
    setRecentPrompt(input);

    try {
      // Add the user's prompt to the history
      const taskSummary = tasks
        .map(
          (task, index) =>
            `Task ${index + 1}: ${task.task} on ${task.date} from ${
              task.timeRange
            }.`
        )
        .join(" ");
      const taskContextMessage = {
        role: "user",
        parts: [
          {
            text: `Here are my tasks: ${taskSummary}`,
          },
        ],
      };
      const newMessage = {
        role: "user",
        parts: [{ text: input }],
      };

      // Update the chat history with the new user message
      const newChatHistory = [...chatHistory,taskContextMessage, newMessage];

      // Send the updated chat history to Gemini
      response = await runChat(input, newChatHistory);

      // Update the result with the new response
      setResultData(response);

      // Add the response from Gemini to the history
      const modelResponse = {
        role: "model",
        parts: [{ text: response }],
      };

      setChatHistory((prevHistory) => [
        ...prevHistory,
		taskContextMessage,
        newMessage,
        modelResponse,
      ]);
    } catch (error) {
      console.error("Error while running chat:", error);
    } finally {
      setLoading(false);
      setInput(""); // Clear input field
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResults,
    loading,
    resultData,
    newChat,
    chatHistory,
    tasks, // Add tasks to context
    updateTasks, // Add updater function
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
