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
          "date": {
            "type": "string",
            "format": "time"
          },
        "required": ["event_name", "event_details", "start_time", "end_time","date"]
      }
    }
  },
  "delete_tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "task_name": {
            "type": "string"
          },
          "date": {
            "type": "string",
            "format": "date"
          }
        },
        "required": ["task_name", "date"]
      }
    },
    "delete_events": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "event_name": {
            "type": "string"
          },
          "date": {
            "type": "string",
            "format": "date"
          }
        },
        "required": ["event_name", "date"]
      }
    }
  },
  "update_tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "original_task_name": {
            "type": "string"
          },
          "original_date": {
            "type": "string",
            "format": "date"
          },
          "new_task_name": {
            "type": "string"
          },
          "new_start_time": {
            "type": "string",
            "format": "date-time"
          },
          "new_end_time": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": ["original_task_name", "original_date"]
      }
    },
    "update_events": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "original_event_name": {
            "type": "string"
          },
          "original_date": {
            "type": "string",
            "format": "date"
          },
          "new_event_name": {
            "type": "string"
          },
          "new_event_details": {
            "type": "string"
          },
          "new_start_time": {
            "type": "string",
            "format": "time"
          },
          "new_end_time": {
            "type": "string",
            "format": "time"
          },
          "new_date": {
            "type": "string",
            "format": "time"
          }
        },
        "required": ["original_event_name", "original_date"]
      }
    }
  },
  "required": ["full_response","new_tasks","new_events","delete_tasks","delete_events","update_tasks","update_events"]
} only put new tasks and events in the json not the current tasks and events. once new tasks and events are added, there is no need to hold them in the list. Please note that you have to always give the json in response nothing else`,
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
          date: dayjs(event.date),
          startTime: dayjs(dayjs().format('YYYY-MM-DD') + ' ' + event.start_time),
          endTime: dayjs(dayjs().format('YYYY-MM-DD') + ' ' + event.end_time)
        }));

        updateEvents([...events, ...newEventsToAdd]);
      }
      if (jsonResponse.delete_tasks && jsonResponse.delete_tasks.length > 0) {
        const updatedTasks = tasks.filter(task => {
          return !jsonResponse.delete_tasks.some(
            deleteTask => 
              deleteTask.task_name.toLowerCase() === task.task.toLowerCase() &&
              dayjs(deleteTask.date).format('YYYY-MM-DD') === task.date
          );
        });
        updateTasks(updatedTasks);
      }

      // Process event deletions
      if (jsonResponse.delete_events && jsonResponse.delete_events.length > 0) {
        const updatedEvents = events.filter(event => {
          return !jsonResponse.delete_events.some(
            deleteEvent => 
              deleteEvent.event_name.toLowerCase() === event.title.toLowerCase() &&
              dayjs(deleteEvent.date).format('YYYY-MM-DD') === event.date.format('YYYY-MM-DD')
          );
        });
        updateEvents(updatedEvents);
      }

      if (jsonResponse.update_tasks && jsonResponse.update_tasks.length > 0) {
        const updatedTasks = tasks.map(task => {
          const updateTask = jsonResponse.update_tasks.find(
            update => 
              update.original_task_name.toLowerCase() === task.task.toLowerCase() &&
              dayjs(update.original_date).format('YYYY-MM-DD') === task.date
          );

          if (updateTask) {
            return {
              task: updateTask.new_task_name || task.task,
              date: updateTask.new_start_time ? dayjs(updateTask.new_start_time).format('YYYY-MM-DD') : task.date,
              timeRange: updateTask.new_start_time && updateTask.new_end_time ? 
                `${dayjs(updateTask.new_start_time).format('h:mm A')} - ${dayjs(updateTask.new_end_time).format('h:mm A')}` : 
                task.timeRange
            };
          }
          return task;
        });
        updateTasks(updatedTasks);
      }

      // Process event updates
      if (jsonResponse.update_events && jsonResponse.update_events.length > 0) {
        const updatedEvents = events.map(event => {
          const updateEvent = jsonResponse.update_events.find(
            update => 
              update.original_event_name.toLowerCase() === event.title.toLowerCase() &&
              dayjs(update.original_date).format('YYYY-MM-DD') === event.date.format('YYYY-MM-DD')
          );

          if (updateEvent) {
            return {
              title: updateEvent.new_event_name || event.title,
              details: updateEvent.new_event_details || event.details,
              date: updateEvent.new_date ? dayjs(updateEvent.new_date) : event.date,
              startTime: updateEvent.new_start_time ? 
                dayjs(dayjs().format('YYYY-MM-DD') + ' ' + updateEvent.new_start_time) : 
                event.startTime,
              endTime: updateEvent.new_end_time ? 
                dayjs(dayjs().format('YYYY-MM-DD') + ' ' + updateEvent.new_end_time) : 
                event.endTime
            };
          }
          return event;
        });
        updateEvents(updatedEvents);
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
      const correctResponse = response.substring(
        response.indexOf('{'), 
        response.lastIndexOf('}')+1
      );
      console.log(correctResponse);
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
