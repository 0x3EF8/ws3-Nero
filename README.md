# Nero Facebook Bot

This project is a simple Facebook bot built with Node.js using the ws3-fca library. I created this bot as a learning project to help automate Facebook messaging and explore useful integrations like generative AI. I hope you find it helpful and easy to extend.

---

## Features

- **Command System:**  
  Supports both user and admin commands. You can easily add new commands.
- **Event Handlers:**  
  Reacts automatically to messages (e.g., auto react when a message contains "haha") and sends welcome messages.
- **Generative AI Integration:**  
  Uses Google Generative AI to generate content from prompts.
- **Uptime Reporting:**  
  Provides system uptime, memory usage, CPU load, and OS info.
- **Modular and Extendable:**  
  The project structure is organized so that you can add new features or commands with ease.

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/0x3EF8/ws3-Nero.git
cd ws3-Nero.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File for API Keys

Create a file called `.env` in the `src/config` folder. This file will store your API keys and other sensitive information. For example:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual API key.

### 4. App State

Ensure your `appstate.json` file is placed in the `src/config` folder. This file holds your Facebook session state.

---

## Running the Bot

Start the bot with the following command:

```bash
npm start
```

The bot will log into Facebook and start listening for messages and events.

---

## Commands

- **cmd**: Displays a list of available commands.  
  *Usage:* `cmd` or `cmd -admin -info`
- **debug**: Toggle or display debug mode (maintenance mode). (Admin only)  
  *Usage:* `debug on` / `debug off` / `debug status`
- **setguard**: Toggle your profile guard (Admin only).  
  *Usage:* `setguard on` / `setguard off`
- **shell**: Execute shell commands on the server (Admin only).  
  *Usage:* `shell <command>`
- **post**: Create a post on your Facebook feed.  
  *Usage:* `post <message>`
- **uid**: Get your Facebook User ID.  
  *Usage:* `uid`
- **uptime**: Displays bot uptime and system information.  
  *Usage:* `uptime`
- **genai**: Generate content using Google Generative AI based on your prompt.  
  *Usage:* `genai <prompt>`

---

## Contributing

I welcome contributions and improvements. If you find any bugs or have suggestions, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.

---

Thank you for checking out Nero Facebook Bot. We hope it serves as a good starting point for your Facebook automation projects. Enjoy and happy coding!