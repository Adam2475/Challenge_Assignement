"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = getAllTasks;
exports.getAllProjects = getAllProjects;
exports.getAllTags = getAllTags;
exports.getTaskById = getTaskById;
const db_1 = __importDefault(require("./db"));
// Get all tasks with their tags
async function getAllTasks() {
    const query = `
    SELECT t.id, t.title, t.hours, 
           GROUP_CONCAT(g.name ORDER BY g.name) AS tags
    FROM tasks t
    LEFT JOIN task_tags tt ON tt.task_id = t.id
    LEFT JOIN tags g ON g.id = tt.tag_id
    GROUP BY t.id, t.title, t.hours
    ORDER BY t.id
  `;
    const [rows] = await db_1.default.query(query);
    return rows;
}
// Get all projects
async function getAllProjects() {
    const query = `SELECT * FROM projects ORDER BY id`;
    const [rows] = await db_1.default.query(query);
    return rows;
}
// Get all tags
async function getAllTags() {
    const query = `SELECT * FROM tags ORDER BY name`;
    const [rows] = await db_1.default.query(query);
    return rows;
}
// Get a single task by ID
async function getTaskById(taskId) {
    const query = `
    SELECT t.id, t.title, t.hours, 
           GROUP_CONCAT(g.name ORDER BY g.name) AS tags
    FROM tasks t
    LEFT JOIN task_tags tt ON tt.task_id = t.id
    LEFT JOIN tags g ON g.id = tt.tag_id
    WHERE t.id = ?
    GROUP BY t.id, t.title, t.hours
  `;
    const [rows] = await db_1.default.query(query, [taskId]);
    return rows[0] || null;
}
