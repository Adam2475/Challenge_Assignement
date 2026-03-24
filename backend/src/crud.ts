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

    if (typeof title !== "string" || typeof hours !== "number") {
        return response.status(400).json({
            error: "Invalid payload. Expected { title: string, hours: number }"
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

// UPDATE

// DELETE