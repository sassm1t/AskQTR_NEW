import { createContext, useState,useEffect } from "react";
import runChat from "../config/Gemini";
import dayjs from "dayjs";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [tasks, setTasks] = useState(() => {
    // Initialize tasks from localStorage
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      return parsedEvents.map(event => ({
        ...event,
        date: dayjs(event.date),
        startTime: event.startTime ? dayjs(event.startTime) : null,
        endTime: event.endTime ? dayjs(event.endTime) : null,
      }));
    }
    return [];
  });
  const [chatHistory, setChatHistory] = useState([
    {
      role: "model",
      parts: [
        {
          text: `You are my personal assistant named AskQTR, always stick to your role. Your job is to help me manage my schedule, my to-do list, task, goals, identify undone work, etc. today's date and time is ${new Date().toLocaleString()}. Whenever there is need of someone else's schedule and it is not available, assume that they are always free and only consider my schedule. Use this json schema:
{
  "type": "object",
  "properties": {
    "full_response": {
      "type": "string"
    },
    "new_tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "task_name": {
            "type": "string"
          },
          "start_time": {
            "type": "string",
            "format": "date-time"
          },
          "end_time": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": ["task_name", "start_time", "end_time"]
      }
    },
    "new_events": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "event_name": {
            "type": "string"
          },
          "event_details": {
            "type": "string"
          },
          "start_time": {
            "type": "string",
            "format": "time"
          },
          "end_time": {
            "type": "string",
            "format": "time"
          },
        "required": ["event_name", "event_details", "start_time", "end_time"]
      }
    }
  },
  "required": ["full_response","new_tasks","new_events"]
} only put new tasks and events in the json not the current tasks and events`,
        },
      ],
    },
  ]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 10 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };


  const updateTasks = (newTasks) => {
    setTasks(newTasks); // Update the tasks state when a new task/event is added
  };

  // Step 2: Create an update function for events
  const updateEvents = (newEvents) => {
    setEvents(newEvents);  // Update events state
  };

  const processNewTasksAndEvents = (jsonResponse) => {
    try {
      // Process new tasks
      if (jsonResponse.new_tasks && jsonResponse.new_tasks.length > 0) {
        const newTasksToAdd = jsonResponse.new_tasks.map(task => ({
          task: task.task_name,
          date: dayjs(task.start_time).format('YYYY-MM-DD'),
          timeRange: `${dayjs(task.start_time).format('h:mm A')} - ${dayjs(task.end_time).format('h:mm A')}`
        }));

        updateTasks([...tasks, ...newTasksToAdd]);
      }

      // Process new events
      if (jsonResponse.new_events && jsonResponse.new_events.length > 0) {
        const newEventsToAdd = jsonResponse.new_events.map(event => ({
          title: event.event_name,
          details: event.event_details,
          date: dayjs(dayjs().format('YYYY-MM-DD')), // Using current date since date isn't in the event format
          startTime: dayjs(dayjs().format('YYYY-MM-DD') + ' ' + event.start_time),
          endTime: dayjs(dayjs().format('YYYY-MM-DD') + ' ' + event.end_time)
        }));

        updateEvents([...events, ...newEventsToAdd]);
      }
    } catch (error) {
      console.error("Error processing new tasks and events:", error);
    }
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
            text: `Here are my current tasks: ${taskSummary} Here are my current events: ${eventSummary}`,
          },
        ],
      };
	  console.log(contextMessage);

      const newMessage = {
        role: "user",
        parts: [{ text: input }],
      };

      // Update the chat history with the new user message
      const newChatHistory = [...chatHistory, contextMessage, newMessage];

      // Send the updated chat history to Gemini
      response = await runChat(input, newChatHistory);
      const correctResponse = response.slice(7,-4);
      const jsonify = JSON.parse(correctResponse);
      // Update the result with the new response
      setResultData(jsonify.full_response);

      processNewTasksAndEvents(jsonify);

      // Add the response from Gemini to the history
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
