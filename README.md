# AskQTR

## Overview
AskQTR is an AI-powered chatbot designed to enhance productivity by integrating application's other tabs like task and calendar data to provide smart, actionable answers. The application streamlines planning and scheduling, helping users save time and make informed decisions effortlessly. Built using **ReactJS, JavaScript, CSS, and Material UI**, it leverages **Gemini's API** for generating intelligent responses.

## Tech Stack
- **Frontend**: ReactJS, JavaScript, CSS, MUI
- **AI API**: Gemini’s API for generating intelligent responses
- **Future Integration**: Locally running AI models (e.g., LLaMA 3.2)

---

## Installation

1. **Fork the Repository**  
   Click on the "Fork" button in the top-right corner of this repository's GitHub page to create your own copy.

2. **Clone the Forked Repository**  
   Use the following command to clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/your-username/askqtr.git
   ```
3. **Navigate to the Project Directory**
   ```bash
   cd askqtr
   ```
4. **Checkout the branch**
   ```bash
   git checkout ollama
   ```
5. **Clone the Forked Repository**  
   Use the following command to clone your forked repository to your local machine:\
   Download the [Ollama application](https://ollama.com) and follow the installation 
   instructions for your operating system.

6. **Start Ollama Server**  
   Make sure ollama application is not on and running.
   ```bash
   ollama serve
   ```
6. **Run Llama3.2 Model**  
   ```bash
   ollama run llama3.2
   ```

3. **Install Dependencies**\
In a different terminal
Install all required dependencies using npm:\
Install npm from [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

   ```bash
   npm install
   ```
4. **Start Server**
   ```bash
   npm run dev
   ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.