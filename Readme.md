# Social Scheduler

A simple mock social media scheduling application that allows users to create, manage, and schedule posts across various platforms.

## Features

- **Post Creation**: Easily create posts with titles, descriptions, and images.
- **Scheduling**: Schedule posts for specific dates and times.
- **Hashtag Generation**: Automatically generate relevant hashtags for your posts using Gemini Flash 2.0
- **Image Generation**: Generate images based on user prompts using the FLUX.1-dev model hosted on Hugging Face.
- **Remotion Video Generation**: Generate videos based on uploaded assets using Remotion package (WIP).



## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/miketsg/social-scheduler.git
   cd social-scheduler
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your API keys:

   ```plaintext
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the URL served by the local host.
