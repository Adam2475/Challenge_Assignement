"use strict";

import express from "express";
import pool from "./db";
import { createProject, readProjects, createTask, readTasks, getTask, getProject } from "./crud";

const app = express();
// adds middleware to parse incoming JSON request
// bodies and make them available under request.body
app.use(express.json());

// create endpoint and bind to a handler functions
app.post("/create_project", createProject);
app.post("/create_task", createTask);
app.get("/read_projects", readProjects);
app.get("/read_tasks", readTasks);
app.get("/read_project/:id", getProject);
app.get("/read_task/:id", getTask);

app.listen(3000, () => console.log("Express server started"));