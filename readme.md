# LearnFlow

A streamlined platform for mentors to schedule live Google Meet classes and learners to join them.

## Features

- Google Authentication
- Role-based access (Mentor/Learner)
- Class scheduling with Google Calendar integration
- Live class joining via Google Meet
- Responsive design

## Tech Stack

- Next.js 14
- MongoDB
- NextAuth.js
- Google Calendar API
- Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Run development server: `npm run dev`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages
├── lib/                # Utility functions and configurations
├── models/             # Database models
├── styles/             # Global styles
└── utils/              # Helper functions
```