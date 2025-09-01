const express = require("express");
const bodyParser = require("body-parser");
const client = require("prom-client"); //  Add Prometheus client

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory task storage
let tasks = [];

//  Create Prometheus Registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

//  Custom Counter for API requests
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of requests",
  labelNames: ["method", "route"]
});
register.registerMetric(httpRequestsTotal);

//  Middleware to count requests
app.use((req, res, next) => {
  httpRequestsTotal.labels(req.method, req.path).inc();
  next();
});

// Serve the UI
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>To-Do App</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #00ff00; /* Green background */
        }
        .container {
          text-align: center;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          width: 350px;
        }
        h1 {
          color: black;
          font-weight: bold;
        }
        form {
          margin: 15px 0;
        }
        input[type="text"] {
          padding: 8px;
          width: 70%;
          border-radius: 6px;
          border: 1px solid #333;
        }
        button {
          padding: 8px 12px;
          margin-left: 5px;
          background: black;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        button:hover {
          background: #333;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        .delete-btn {
          background: red;
          color: white;
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .delete-btn:hover {
          background: darkred;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>My To-Do List</h1>
        <form method="POST" action="/add">
          <input type="text" name="task" placeholder="Enter a task" required />
          <button type="submit">Add</button>
        </form>
        <ul>
          ${tasks
            .map(
              (task, index) => `
              <li>
                ${task}
                <form method="POST" action="/delete" style="display:inline;">
                  <input type="hidden" name="index" value="${index}" />
                  <button type="submit" class="delete-btn">Delete</button>
                </form>
              </li>`
            )
            .join("")}
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Add task
app.post("/add", (req, res) => {
  const newTask = req.body.task;
  tasks.push(newTask);
  res.redirect("/");
});

// Delete task
app.post("/delete", (req, res) => {
  const index = req.body.index;
  tasks.splice(index, 1);
  res.redirect("/");
});

//  Add /metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Start server
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});

