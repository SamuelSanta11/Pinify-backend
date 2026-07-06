import pool from "../config/database"; 

export const getDatabaseTime = async () => {
    const result = await pool.query("SELECT NOW()");

    return result.rows[0];
}