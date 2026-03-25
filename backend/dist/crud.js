"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.deleteTask = exports.deleteProject = exports.addTasksToProject = exports.addTagsToTask = exports.updateTask = exports.updateProject = exports.getTagTasks = exports.getProjectTasks = exports.getTaskTags = exports.getTask = exports.readTags = exports.readTasks = exports.getProject = exports.readProjects = exports.createTag = exports.createTask = exports.createProject = void 0;
const db_1 = __importDefault(require("./db"));
///////////
// CREATE
///////////
const createProject = async (request, response) => {
    const name = request.body?.name;
    const budget = request.body?.budget;
    const description = request.body?.description ?? null;
    const hoursUsed = request.body?.hours_used;
    // check if request body parameters are of the correct type
    if (typeof name !== "string" || typeof budget !== "number" || typeof hoursUsed !== "number") {
        return response.status(400).json({
            error: "Invalid payload. Expected { name: string, budget: number, hours_used: number, description?: string }"
        });
    }
    try {
        const [rows] = await db_1.default.query("INSERT INTO projects \
            (name, budget, description, hours_used) VALUES (?, ?, ?, ?)", [name, budget, description, hoursUsed]);
        response.json(rows);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.createProject = createProject;
const createTask = async (request, response) => {
    const title = request.body?.title;
    const description = request.body?.description ?? null;
    const hours = request.body?.hours;
    // check if request body parameters are of the correct type
    if (typeof title !== "string" || typeof description !== "string" || typeof hours !== "number") {
        return response.status(400).json({
            error: "Invalid payload. Expected { title: string, description: string, hours: number }"
        });
    }
    try {
        const [rows] = await db_1.default.query("INSERT INTO tasks \
            (title, description, hours) VALUES (?, ?, ?)", [title, description, hours]);
        response.json(rows);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.createTask = createTask;
const createTag = async (request, response) => {
    const name = request.body?.name;
    // check if the name is a valid string
    if (typeof name !== "string" || name.trim() === "") {
        return response.status(400).json({
            error: "Invalid payload. Expected { name: string }"
        });
    }
    try {
        const [result] = await db_1.default.query("INSERT INTO tags (name) VALUES (?)", [name.trim()]);
        response.status(201).json(result);
    }
    catch (error) {
        if (error?.code === "ER_DUP_ENTRY") {
            return response.status(409).json({ error: "Tag already exists" });
        }
        response.status(500).json({ error: String(error) });
    }
};
exports.createTag = createTag;
///////////
// READ
///////////
const readProjects = async (_, response) => {
    try {
        const [rows] = await db_1.default.query("SELECT * FROM projects");
        response.json(rows);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.readProjects = readProjects;
// ? secure user values to prevent SQL injection
const getProject = async (request, response) => {
    try {
        const [rows] = await db_1.default.query("SELECT * FROM projects WHERE id = ?", [request.params.id]);
        response.json(rows);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.getProject = getProject;
const readTasks = async (_, response) => {
    try {
        const [rows] = await db_1.default.query("SELECT * FROM tasks");
        response.json(rows);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.readTasks = readTasks;
const readTags = async (_, response) => {
    try {
        const [rows] = await db_1.default.query("SELECT * FROM tags");
        response.json(rows);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.readTags = readTags;
const getTask = async (request, response) => {
    try {
        const [rows] = await db_1.default.query("SELECT * FROM tasks WHERE id = ?", [request.params.id]);
        response.json(rows);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.getTask = getTask;
// return all the tags linked to a specific task
const getTaskTags = async (request, response) => {
    const taskId = Number(request.params.id);
    // check if passed id is a valid positive integer
    if (!Number.isInteger(taskId) || taskId <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }
    try {
        const [taskRows] = await db_1.default.query("SELECT id FROM tasks WHERE id = ?", [taskId]);
        // check if task with the given id exists
        if (taskRows.length === 0) {
            return response.status(404).json({ error: "Task not found" });
        }
        const [tags] = await db_1.default.query("SELECT tags.* FROM tags JOIN task_tags ON tags.id = task_tags.tag_id WHERE task_tags.task_id = ?", [taskId]);
        response.json(tags);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.getTaskTags = getTaskTags;
const getProjectTasks = async (request, response) => {
    const projectId = Number(request.params.id);
    // check if passed id is a valid positive integer
    if (!Number.isInteger(projectId) || projectId <= 0) {
        return response.status(400).json({ error: "Invalid project id" });
    }
    try {
        const [projectRows] = await db_1.default.query("SELECT id FROM projects WHERE id = ?", [projectId]);
        // check if project with the given id exists
        if (projectRows.length === 0) {
            return response.status(404).json({ error: "Project not found" });
        }
        // tasks.* = all tasks from tasks table
        // JOIN between tasks and project_tasks on matching task id
        const [tasks] = await db_1.default.query("SELECT tasks.* FROM tasks JOIN project_tasks ON tasks.id = project_tasks.task_id WHERE project_tasks.project_id = ?", [projectId]);
        response.json(tasks);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.getProjectTasks = getProjectTasks;
const getTagTasks = async (request, response) => {
    const tagId = Number(request.params.id);
    // check if passed id is a valid positive integer
    if (!Number.isInteger(tagId) || tagId <= 0) {
        return response.status(400).json({ error: "Invalid tag id" });
    }
    try {
        const [tagRows] = await db_1.default.query("SELECT id FROM tags WHERE id = ?", [tagId]);
        if (tagRows.length === 0) {
            return response.status(404).json({ error: "Tag not found" });
        }
        const [tasks] = await db_1.default.query("SELECT tasks.* FROM tasks JOIN task_tags ON tasks.id = task_tags.task_id WHERE task_tags.tag_id = ?", [tagId]);
        response.json(tasks);
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.getTagTasks = getTagTasks;
////////////
// UPDATE
////////////
const updateProject = async (request, response) => {
    const id = Number(request.params.id);
    const name = request.body?.name;
    const budget = request.body?.budget;
    const description = request.body?.description ?? null;
    const hoursUsed = request.body?.hours_used;
    // check if passed id is a valid positive integer
    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid project id" });
    }
    // check if request body parameters are of the correct type
    if (typeof name !== "string" ||
        typeof budget !== "number" ||
        !(typeof description === "string" || description === null) ||
        typeof hoursUsed !== "number") {
        return response.status(400).json({
            error: "Invalid payload. Expected { name: string, budget: number, hours_used: number, description?: string|null }"
        });
    }
    try {
        const [result] = await db_1.default.query("UPDATE projects SET name = ?, budget = ?, description = ?, hours_used = ? WHERE id = ?", [name, budget, description, hoursUsed, id]);
        // if 0 rows are affected, no project was found
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: "Project not found" });
        }
        response.json({ message: "Project updated", affectedRows: result.affectedRows });
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.updateProject = updateProject;
const updateTask = async (request, response) => {
    const id = Number(request.params.id);
    const title = request.body?.title;
    const description = request.body?.description ?? null;
    const hours = request.body?.hours;
    // check if passed id is a valid positive integer
    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }
    // check if request body parameters are of the correct type
    if (typeof title !== "string" ||
        !(typeof description === "string" || description === null) ||
        typeof hours !== "number") {
        return response.status(400).json({
            error: "Invalid payload. Expected { title: string, description?: string|null, hours: number }"
        });
    }
    try {
        const [result] = await db_1.default.query("UPDATE tasks SET title = ?, description = ?, hours = ? WHERE id = ?", [title, description, hours, id]);
        // if 0 rows are affected, no task was found
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: "Task not found" });
        }
        response.json({ message: "Task updated", affectedRows: result.affectedRows });
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.updateTask = updateTask;
const addTagsToTask = async (request, response) => {
    const taskId = Number(request.params.id);
    const tagIdsInput = request.body?.tag_ids;
    // check if passed id is a valid positive integer
    if (!Number.isInteger(taskId) || taskId <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }
    // check if request body parameters are of the correct type
    if (!Array.isArray(tagIdsInput) || tagIdsInput.length === 0) {
        return response.status(400).json({
            error: "Invalid payload. Expected { tag_ids: number[] }"
        });
    }
    // Convert values to numbers
    const parsedTagIds = tagIdsInput.map((value) => Number(value));
    // Remove duplicates
    const tagIds = Array.from(new Set(parsedTagIds));
    if (tagIds.some((id) => !Number.isInteger(id) || id <= 0)) {
        return response.status(400).json({
            error: "Invalid payload. tag_ids must contain only positive integers"
        });
    }
    try {
        const [taskRows] = await db_1.default.query("SELECT id FROM tasks WHERE id = ?", [taskId]);
        // check if task with the given id exists
        if (taskRows.length === 0) {
            return response.status(404).json({ error: "Task not found" });
        }
        // select all tags with the given ids and check if they exist
        const [tagRows] = await db_1.default.query("SELECT id FROM tags WHERE id IN (?)", [tagIds]);
        const existingTagIds = new Set(tagRows.map((row) => row.id));
        const missingTagIds = tagIds.filter((id) => !existingTagIds.has(id));
        if (missingTagIds.length > 0) {
            return response.status(404).json({
                error: "Some tags were not found",
                missing_tag_ids: missingTagIds
            });
        }
        for (const tagId of tagIds) {
            await db_1.default.query("INSERT IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)", [taskId, tagId]);
        }
        response.json({
            message: "Tags linked to task",
            task_id: taskId,
            tag_ids: tagIds
        });
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.addTagsToTask = addTagsToTask;
const addTasksToProject = async (request, response) => {
    const projectId = Number(request.params.id);
    const taskIdsInput = request.body?.task_ids;
    // check if passed id is a valid positive integer
    if (!Number.isInteger(projectId) || projectId <= 0) {
        return response.status(400).json({ error: "Invalid project id" });
    }
    // check if request body parameters are of the correct type
    if (!Array.isArray(taskIdsInput) || taskIdsInput.length === 0) {
        return response.status(400).json({
            error: "Invalid payload. Expected { task_ids: number[] }"
        });
    }
    const parsedTaskIds = taskIdsInput.map((value) => Number(value));
    const taskIds = Array.from(new Set(parsedTaskIds));
    if (taskIds.some((id) => !Number.isInteger(id) || id <= 0)) {
        return response.status(400).json({
            error: "Invalid payload. task_ids must contain only positive integers"
        });
    }
    try {
        const [projectRows] = await db_1.default.query("SELECT id FROM projects WHERE id = ?", [projectId]);
        if (projectRows.length === 0) {
            return response.status(404).json({ error: "Project not found" });
        }
        const [taskRows] = await db_1.default.query("SELECT id FROM tasks WHERE id IN (?)", [taskIds]);
        const existingTaskIds = new Set(taskRows.map((row) => row.id));
        const missingTaskIds = taskIds.filter((id) => !existingTaskIds.has(id));
        if (missingTaskIds.length > 0) {
            return response.status(404).json({
                error: "Some tasks were not found",
                missing_task_ids: missingTaskIds
            });
        }
        for (const taskId of taskIds) {
            await db_1.default.query("INSERT IGNORE INTO project_tasks (project_id, task_id) VALUES (?, ?)", [projectId, taskId]);
        }
        response.json({
            message: "Tasks linked to project",
            project_id: projectId,
            task_ids: taskIds
        });
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.addTasksToProject = addTasksToProject;
////////////
// DELETE
////////////
const deleteProject = async (request, response) => {
    const id = Number(request.params.id);
    // check if passed id is a valid positive integer
    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid project id" });
    }
    try {
        const [result] = await db_1.default.query("DELETE FROM projects WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: "Project not found" });
        }
        response.json({ message: "Project deleted", affectedRows: result.affectedRows });
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.deleteProject = deleteProject;
const deleteTask = async (request, response) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }
    try {
        const [result] = await db_1.default.query("DELETE FROM tasks WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: "Task not found" });
        }
        response.json({ message: "Task deleted", affectedRows: result.affectedRows });
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.deleteTask = deleteTask;
const deleteTag = async (request, response) => {
    const id = Number(request.params.id);
    // check if passed id is a valid positive integer
    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid tag id" });
    }
    try {
        const [result] = await db_1.default.query("DELETE FROM tags WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: "Tag not found" });
        }
        response.json({ message: "Tag deleted", affectedRows: result.affectedRows });
    }
    catch (error) {
        response.status(500).json({ error: String(error) });
    }
};
exports.deleteTag = deleteTag;
