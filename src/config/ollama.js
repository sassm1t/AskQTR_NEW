async function runLlamaChat(messages) {
    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: messages, // Send the transformed message history
          max_tokens: 100,
          stream: false,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Log the raw response to debug
      const rawText = await response.text();
      console.log("Raw Response:", rawText);
  
      // Try to parse the response as JSON
      const result = JSON.parse(rawText);
  
      return result.message.content;
    } catch (error) {
      console.error("Error while running chat:", error);
      return "Sorry, something went wrong!";
    }
  }
  
  export default runLlamaChat;
  