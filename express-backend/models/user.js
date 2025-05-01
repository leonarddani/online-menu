const pool = require("../config/db");

const User = {
    create: async ({ name, username, email, password, status }) => {
        const query = `INSERT INTO users (name, username, email, password, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        const values = [name, username, email, password, status || "client"];

        const result = await pool.query(query, values);

        return result.rows[0];
    },

    findByEmail: async (email)  => {
        const query = `SELECT * FROM users WHERE email = $1;`;
        const result = await pool.query(query, [email]);

        return result.rows[0];
    }
}

module.exports = User;
