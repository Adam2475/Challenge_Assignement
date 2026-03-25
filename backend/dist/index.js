"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import pool from "./db";
const crud_1 = require("./crud");
const app = (0, express_1.default)();
// adds middleware to parse incoming JSON request
// bodies and make them available under request.body
app.use(express_1.default.json());
// create endpoint and bind to a handler functions
app.post("/create_project", crud_1.createProject);
app.post("/create_task", crud_1.createTask);
app.post("/create_tag", crud_1.createTag);
app.get("/read_projects", crud_1.readProjects);
app.get("/read_tasks", crud_1.readTasks);
app.get("/read_tags", crud_1.readTags);
app.get("/read_project/:id", crud_1.getProject);
app.get("/read_task/:id", crud_1.getTask);
app.get("/read_task_tags/:id", crud_1.getTaskTags);
app.get("/read_project_tasks/:id", crud_1.getProjectTasks);
app.get("/read_tag_tasks/:id", crud_1.getTagTasks);
app.put("/update_project/:id", crud_1.updateProject);
app.put("/update_task/:id", crud_1.updateTask);
app.post("/add_task_tags/:id", crud_1.addTagsToTask);
app.post("/add_project_tasks/:id", crud_1.addTasksToProject);
app.delete("/delete_project/:id", crud_1.deleteProject);
app.delete("/delete_task/:id", crud_1.deleteTask);
app.delete("/delete_tag/:id", crud_1.deleteTag);
app.listen(3000, () => console.log("Express server started"));
