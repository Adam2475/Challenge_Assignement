"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crud_1 = require("./crud");
const app = (0, express_1.default)();
// adds middleware to parse incoming JSON request
// bodies and make them available under request.body
app.use(express_1.default.json());
// create endpoint and bind to a handler functions
app.post("/create_project", crud_1.createProject);
app.post("/create_task", crud_1.createTask);
app.get("/read_projects", crud_1.readProjects);
app.get("/read_tasks", crud_1.readTasks);
app.get("/read_project/:id", crud_1.getProject);
app.get("/read_task/:id", crud_1.getTask);
app.listen(3000, () => console.log("Express server started"));
