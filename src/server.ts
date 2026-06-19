import app from "./app";
import pool from "./config/database";

const PORT = 3000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
  }
}

startServer();
