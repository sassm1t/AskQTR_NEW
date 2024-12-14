// node --version # Should be >= 18
// npm install @google/generative-ai

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.GOOGLE_API_KEY;


async function runChat(prompt,chatHistory) {

  const genAI = new GoogleGenerativeAI("AIzaSyAwEiW6-S2tT4n1L5aHTD3njVoQAlAz04Y");
  // Set the system instruction during model initialization
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const generationConfig = {
    temperature: 0,
    topP: 0.7,
    topK: 40,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

const chat = model.startChat({
  generationConfig,
  safetySettings,
  history: chatHistory,  // Start with an empty conversation history
});

// Send the initial prompt message and get a response
const result = await chat.sendMessage(prompt);
const response = result.response;


const text = response.text();

// Output the response text and ensure the cat-like behavior
return text;
}

export default runChat;


