import { createContext, useState } from "react";
import runChat from "../config/Gemini";
import runLlamaChat from "../config/ollama";

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
          text: `You are my personal assistant named AskQTR, always stick to your role. Your job is to help me manage my schedule, my to-do list, task, goals, identify undone work, etc. today's date and time is ${new Date().toLocaleString()}.`,
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
  const [events, setEvents] = useState([]);  // Step 1: Add `events` state

  const updateTasks = (newTasks) => {
    setTasks(newTasks); // Update the tasks state when a new task/event is added
  };

  // Step 2: Create an update function for events
  const updateEvents = (newEvents) => {
    setEvents(newEvents);  // Update events state
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
      const eventSummary = events
        .map(
          (event, index) =>
            `Event ${index + 1}: ${event.title} on ${new Date(event.date).toLocaleDateString()} from ${event.startTime.format("h:mm A")} to ${event.endTime.format("h:mm A")}.`
        )
        .join(" ");
      
      // Include both tasks and events in the context message
      const contextMessage = {
        role: "user",
        parts: [
          {
            text: `Here are my tasks: ${taskSummary} Here are my events: ${eventSummary}`,
          },
        ],
      };

      const newMessage = {
        role: "user",
        parts: [{ text: input }],
      };

      // Update the chat history with the new user message
      const newChatHistory = [...chatHistory, contextMessage, newMessage];

      // Transform `newChatHistory` to a format Llama expects
      const llamaMessages = newChatHistory.flatMap((message) =>
        message.parts.map((part) => ({
          role: message.role, // "user" or "model"
          content: part.text, // The actual message content
        }))
      );

      // Send the updated chat history to Llama
      response = await runLlamaChat(llamaMessages);
      console.log(response);

      // Update the result with the new response
      setResultData(response);

      // Add the response from Llama to the history
      const modelResponse = {
        role: "model",
        parts: [{ text: response }],
      };

      setChatHistory((prevHistory) => [
        ...prevHistory,
        contextMessage,
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

  // Step 3: Add `events` and `updateEvents` to the context value
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
    tasks, // Include tasks in context
    updateTasks, // Include updateTasks function
    events, // Include events in context
    updateEvents, // Include updateEvents function
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
