"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.deleteTask = exports.deleteProject = exports.addTagsToTask = exports.updateTask = exports.updateProject = exports.getTask = exports.readTags = exports.readTasks = exports.getProject = exports.readProjects = exports.createTag = exports.createTask = exports.createProject = void 0;
const db_1 = __importDefault(require("./db"));
///////////
// CREATE
///////////
const createProject = async (request, response) => {
    const name = request.body?.name;
    const budget = request.body?.budget;
    const description = request.body?.description ?? null;
    const hoursUsed = request.body?.hours_used;
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
////////////
// UPDATE
////////////
const updateProject = async (request, response) => {
    const id = Number(request.params.id);
    const name = request.body?.name;
    const budget = request.body?.budget;
    const description = request.body?.description ?? null;
    const hoursUsed = request.body?.hours_used;
    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid project id" });
    }
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
    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }
    if (typeof title !== "string" ||
        !(typeof description === "string" || description === null) ||
        typeof hours !== "number") {
        return response.status(400).json({
            error: "Invalid payload. Expected { title: string, description?: string|null, hours: number }"
        });
    }
    try {
        const [result] = await db_1.default.query("UPDATE tasks SET title = ?, description = ?, hours = ? WHERE id = ?", [title, description, hours, id]);
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
    if (!Number.isInteger(taskId) || taskId <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }
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
        if (taskRows.length === 0) {
            return response.status(404).json({ error: "Task not found" });
        }
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
////////////
// DELETE
////////////
const deleteProject = async (request, response) => {
    const id = Number(request.params.id);
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
