# Resume-Feedback-AI

## 📝 Description

This project is a simple web application built with Next.js, Tailwind CSS, and the OpenAI API that allows users to upload their resumes (in PDF format) and receive automated feedback on areas like formatting, content, and structure.

## Features

- **PDF Upload:** Easily upload your resume in PDF format.
- **AI-Powered Feedback:** Get instant, AI-generated feedback based on your resume's content.
- **Clear UI:** A clean and user-friendly interface built with Tailwind CSS.
- **Server-Side PDF Parsing:** Utilizes `pdf-parse` to extract text from PDF files on the server.
- **OpenAI Integration:** Leverages the OpenAI Chat Completions API for feedback generation.

## 🔧 Technologies Used

- TypeScript
- Tailwind CSS
- Node.js
- React
- Next.js
- Express.js

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AshwiniParaye1/Resume-Feedback-AI.git
    cd resume-feedback-ai
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up your OpenAI API Key:**

    Create a file named `.env.local` in the root of your project and add your OpenAI API key:

    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

```
├── app
│   ├── api
│   │   ├── feedback
│   │   │   ├── upload
│   │   │   │   ├── route.ts
│   ├── components
│   │   ├── ResumeUpload.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── lib
│   │   ├── openai.ts
│   ├── page.tsx
├── middleware.ts
├── package.json
├── public

```

## How it Works

1.  The user uploads a PDF resume through the `ResumeUpload.tsx` component.
2.  The file is sent as `FormData` to the `/api/feedback/upload` endpoint.
3.  The server-side API route receives the file.
4.  The `pdf-parse` library is used to extract text content from the PDF buffer.
5.  The extracted text is sent as a prompt to the OpenAI Chat Completions API.
6.  OpenAI analyzes the text based on the provided system prompt (acting as a career coach) and generates feedback.
7.  The API route sends the AI feedback back to the client.
8.  The `ResumeUpload.tsx` component displays the feedback to the user.

## 🤝 Contribution

We welcome contributions! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.

## ❤️ Support

Thank you for checking out Resume-Feedback-AI! If you find it useful, consider giving it a star on GitHub!
