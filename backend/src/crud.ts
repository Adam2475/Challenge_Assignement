import pool from "./db";
import { Request, Response } from "express";

///////////
// CREATE
///////////

export const createProject = async (request: Request, response: Response) => {
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
        const [rows] = await pool.query("INSERT INTO projects \
            (name, budget, description, hours_used) VALUES (?, ?, ?, ?)",
            [name, budget, description, hoursUsed]);
        response.json(rows);
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

export const createTask = async (request: Request, response: Response) => {
    const title = request.body?.title;
    const description = request.body?.description ?? null;
    const hours = request.body?.hours;

    if (typeof title !== "string" || typeof description !== "string" || typeof hours !== "number") {
        return response.status(400).json({
            error: "Invalid payload. Expected { title: string, description: string, hours: number }"
        });
    }

    try {
        const [rows] = await pool.query("INSERT INTO tasks \
            (title, description, hours) VALUES (?, ?, ?)",
            [title, description, hours]);
        response.json(rows);
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

///////////
// READ
///////////

export const readProjects = async (_: any, response: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM projects");
        response.json(rows);
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

// ? secure user values to prevent SQL injection
export const getProject = async (request: Request, response: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [request.params.id]);
        response.json(rows);
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

export const readTasks = async (_: any, response: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tasks");
        response.json(rows);
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

export const getTask = async (request: Request, response: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [request.params.id]);
        response.json(rows);
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

////////////
// UPDATE
////////////

export const updateProject = async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    const name = request.body?.name;
    const budget = request.body?.budget;
    const description = request.body?.description ?? null;
    const hoursUsed = request.body?.hours_used;

    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid project id" });
    }

    if (
        typeof name !== "string" ||
        typeof budget !== "number" ||
        !(typeof description === "string" || description === null) ||
        typeof hoursUsed !== "number"
    ) {
        return response.status(400).json({
            error: "Invalid payload. Expected { name: string, budget: number, hours_used: number, description?: string|null }"
        });
    }

    try {
        const [result] = await pool.query(
            "UPDATE projects SET name = ?, budget = ?, description = ?, hours_used = ? WHERE id = ?",
            [name, budget, description, hoursUsed, id]
        );

        if ((result as any).affectedRows === 0) {
            return response.status(404).json({ error: "Project not found" });
        }

        response.json({ message: "Project updated", affectedRows: (result as any).affectedRows });
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

export const updateTask = async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    const title = request.body?.title;
    const description = request.body?.description ?? null;
    const hours = request.body?.hours;

    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }

    if (
        typeof title !== "string" ||
        !(typeof description === "string" || description === null) ||
        typeof hours !== "number"
    ) {
        return response.status(400).json({
            error: "Invalid payload. Expected { title: string, description?: string|null, hours: number }"
        });
    }

    try {
        const [result] = await pool.query(
            "UPDATE tasks SET title = ?, description = ?, hours = ? WHERE id = ?",
            [title, description, hours, id]
        );

        if ((result as any).affectedRows === 0) {
            return response.status(404).json({ error: "Task not found" });
        }

        response.json({ message: "Task updated", affectedRows: (result as any).affectedRows });
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

// DELETE

export const deleteProject = async (request: Request, response: Response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid project id" });
    }

    try {
        const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [id]);

        if ((result as any).affectedRows === 0) {
            return response.status(404).json({ error: "Project not found" });
        }

        response.json({ message: "Project deleted", affectedRows: (result as any).affectedRows });
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};

export const deleteTask = async (request: Request, response: Response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ error: "Invalid task id" });
    }

    try {
        const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

        if ((result as any).affectedRows === 0) {
            return response.status(404).json({ error: "Task not found" });
        }

        response.json({ message: "Task deleted", affectedRows: (result as any).affectedRows });
    } catch (error) {
        response.status(500).json({ error: String(error) });
    }
};