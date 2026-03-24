import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// validate env variable from .env
function env(name: string): string {
  const str = process.env[name];
  if (!str)
    throw new Error(`Missing env var ${name}`);
  return str;
}

/* a pool is a collection of connections to the database
    it allows us to reuse connections and improve performance */
// promise allows us to use the promise API of mysql2
const pool = mysql.createPool({
    host: env("DB_HOST"),
    user: env("DB_USER"),
    password: env("DB_PASSWORD"),
    database: env("DATABASE")
}).promise();

export default pool;