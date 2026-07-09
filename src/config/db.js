import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "../../data/db.json");

/**
 * Read database
 */
export async function readDB() {
    const data = await readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
}

/**
 * Write database
 */
export async function writeDB(data) {
    await writeFile(
        DB_PATH,
        JSON.stringify(data, null, 2),
        "utf-8"
    );
}

/**
 * Get next employee id
 */
export async function getNextEmployeeId() {
    const db = await readDB();

    if (db.employees.length === 0) {
        return 1;
    }

    return Math.max(...db.employees.map(e => e.id)) + 1;
}

/**
 * Get next user id
 */
export async function getNextUserId() {
    const db = await readDB();

    if (db.users.length === 0) {
        return 1;
    }

    return Math.max(...db.users.map(u => u.id)) + 1;
}