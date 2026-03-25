"use strict";

import express from "express";
// import pool from "./db";
import {
	createProject,
	readProjects,
	createTask,
	createTag,
	readTasks,
	readTags,
	getTask,
	getProject,
	getTaskTags,
	getProjectTasks,
	updateProject,
	updateTask,
	addTagsToTask,
	addTasksToProject,
	deleteProject,
	deleteTask,
	deleteTag
} from "./crud";

const app = express();
// adds middleware to parse incoming JSON request
// bodies and make them available under request.body
app.use(express.json());

// create endpoint and bind to a handler functions
app.post("/create_project", createProject);
app.post("/create_task", createTask);
app.post("/create_tag", createTag);
app.get("/read_projects", readProjects);
app.get("/read_tasks", readTasks);
app.get("/read_tags", readTags);
app.get("/read_project/:id", getProject);
app.get("/read_task/:id", getTask);
app.get("/read_task_tags/:id", getTaskTags);
app.get("/read_project_tasks/:id", getProjectTasks);
app.put("/update_project/:id", updateProject);
app.put("/update_task/:id", updateTask);
app.post("/add_task_tags/:id", addTagsToTask);
app.post("/add_project_tasks/:id", addTasksToProject);
app.delete("/delete_project/:id", deleteProject);
app.delete("/delete_task/:id", deleteTask);
app.delete("/delete_tag/:id", deleteTag);

app.listen(3000, () => console.log("Express server started"));