const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "nwwlyfwknvktkiwcnzmq.supabase.co",  // no "db."
  database: "postgres",
  password: "leodani@120044002",       // replace with real password
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  console.log("Starting DB connection test...");
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected! Server time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await pool.end();
    console.log("Connection pool closed.");
  }
}

testConnection();
