"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// validate env variable from .env
function env(name) {
    const str = process.env[name];
    if (!str)
        throw new Error(`Missing env var ${name}`);
    return str;
}
/* a pool is a collection of connections to the database
    it allows us to reuse connections and improve performance */
// promise allows us to use the promise API of mysql2
const pool = mysql2_1.default.createPool({
    host: env("DB_HOST"),
    user: env("DB_USER"),
    password: env("DB_PASSWORD"),
    database: env("DATABASE")
}).promise();
exports.default = pool;
