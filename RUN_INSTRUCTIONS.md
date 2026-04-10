# Run Instructions

## Backend

### Prerequisites
- Node.js installed
- MongoDB running locally or accessible via connection string

### Setup
1. Open a terminal and go to the backend folder:
   cd Backend
2. Install dependencies:
   npm install
3. Create a `.env` file in the `Backend` folder with the following content:
   MONGO_URI= MongoDB_Connection_String
   GROK_API_KEY=GROK_API

   - If your MongoDB URL is different, replace `mongodb://localhost:27017/tms` with your own connection string.

### Start the backend
npm run dev


The backend will start on `http://localhost:5000` and the API base URL is:

`http://localhost:5000/api`

### Backend API endpoints
- `POST /api/tasks` - create a new task
- `GET /api/tasks` - list all tasks
- `GET /api/tasks/:id` - get a single task by id
- `PATCH /api/tasks/:id/status` - update task status
- `DELETE /api/tasks/:id` - delete a task
- `GET /api/tasks/:id/logs` - get activity logs for a task
- `POST /api/tasks/:id/improve-description` - improve a task description using AI

---

## Frontend

### Setup
1. Open another terminal and go to the frontend folder:
   cd Frontend

2. Install dependencies:
   npm install

3. (Optional) Configure backend API URL by creating a `.env` file in `Frontend` with:
   VITE_API_BASE_URL=http://localhost:5000/api
   If you do not create this file, the frontend will use `http://localhost:5000/api` by default.

### Start the frontend
npm run dev


The frontend will run on `http://localhost:5173` by default.

### What to do after launch
- Open the frontend URL in the browser
- Create tasks using the form
- Use status buttons to move tasks through the workflow
- Click `View Logs` to see activity history
- Click `Improve Description` to update the description via the AI backend
