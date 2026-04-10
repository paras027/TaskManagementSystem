# Project Approach

I built this Task Management System to keep the backend and frontend cleanly separated while making sure the workflow rules were enforced in the API.

## Backend design

I used Node.js, Express, and Mongoose for the backend because they are a good fit for a fast API with MongoDB.

The backend focuses on:
- enforcing the allowed task status flow (`TODO -> IN_PROGRESS -> DONE`)
- rejecting invalid transitions with a clear error message
- creating an activity log entry every time a task changes status
- storing `createdAt` and `updatedAt` automatically through Mongoose timestamps

I also added a dedicated AI service layer so the description improvement is handled from the backend only. The frontend simply calls `POST /api/tasks/:id/improve-description`, and the backend takes care of sending the prompt to the AI provider and saving the updated description.

## Frontend design

I used React with Vite because it is fast to set up and it keeps the frontend responsive.

The UI does the following:
- fetches the current task list from the backend
- shows buttons for allowed status transitions only
- disables invalid actions
- displays loading state for API calls
- shows backend error messages in a clear way
- lets the user view activity logs for each task
- calls the backend AI endpoint to improve task descriptions

## Why this structure

I wanted the app to behave like a real-world feature, not just a CRUD demo. That means:
- validation and workflow rules are enforced in the API
- the frontend does not make assumptions about backend logic
- all important behavior is logged and exposed through dedicated endpoints
- AI integration is done securely on the server side

## Key points

- The task workflow is strict and backend-driven.
- Activity logs are created on every valid status update.
- The AI integration is separated into its own service for cleaner code.
- The frontend uses a reusable API service layer so network calls stay organized.
