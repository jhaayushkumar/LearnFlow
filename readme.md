# LearnFlow

LearnFlow is a streamlined tool designed for Mentors to schedule live Google Meet classes and for Learners to attend them. The platform integrates with the Google Calendar API to facilitate automated meeting generation and class scheduling.

## Core Objective

Provide a seamless interaction between Mentors and Learners for live educational sessions using Google Calendar and Google Meet.

## Features

### 1. User Roles
*   Mentor: Create and manage classes, schedule times, and generate Google Meet links automatically.
*   Learner: View the dashboard of scheduled classes and join meetings directly.

### 2. Google Authentication
*   Secure Sign-in: Users authenticate via Google OAuth.
*   Role Management: Users select their role (Mentor or Learner) upon first login.

### 3. Mentor Module (Schedule Class)
*   Class Creation: Mentors provide a Title, Description, and Start/End times.
*   Automated Meet Links: Every class creation triggers a call to the Google Calendar API to create a primary event and generate a unique Google Meet video conference link.
*   Calendar Synchronization: Scheduled classes are added to the Mentor's Google Calendar, and deleting a class removes it from the calendar.

### 4. Learner Module (Join Class)
*   Class Board: A centralized list of all upcoming classes from all registered Mentors.
*   One-Click Join: Learners can join the Google Meet session directly from the class card.

## Technology Stack

*   Frontend: Next.js (App Router), Tailwind CSS
*   Backend: Next.js API Routes (Serverless)
*   Database: MongoDB
*   Authentication: NextAuth.js
*   Integration: Google Calendar API (googleapis)

## Setup and Installation

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Atlas account
*   Google Cloud Console account with Google Calendar API enabled

### Environment Variables
Create a .env.local file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## OAuth Verification and Scopes
This application uses the `https://www.googleapis.com/auth/calendar.events` scope. In development environments, users may see an "Unverified App" warning from Google. This is expected as the application uses sensitive scopes to automate meeting generation. For evaluation purposes, Clicking "Advanced" and "Go to LearnFlow (unsafe)" will allow the application to function correctly.

## Legal Compliance
The application includes a Privacy Policy and Terms of Service located at /privacy and /terms respectively, ensuring compliance with Google Developer requirements.