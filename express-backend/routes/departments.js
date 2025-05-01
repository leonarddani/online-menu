const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authmiddleware");
const { Pool } = require("pg");

const router = express.Router();


//Endpoint -create new department 

router.post("/create", authMiddleware, async (req, res) => {
    const { name } = req.body;

    try {
        // Check if user is admin
        if (req.user.status !== "admin") {
            return res.status(403).json({ message: "Access denied: admins only" });
        }

        // Validate name
        if (!name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        // Insert into departments
        const query = "INSERT INTO departments (name) VALUES ($1) RETURNING *;";
        const result = await pool.query(query, [name]);

        // Respond with the newly created department
        res.status(201).json(result.rows[0]);
    } catch (error) {
     
        res.status(500).json({ message: "Internal server error" });
    }
});

//Endpoint -assign a user to departmet

router.post("/assign", authMiddleware, async (req, res ) => {
    const {user_id, department_id} = req.body;

    try {
        if(req.user.status !=="admin"){
            return res.status(403).json({ message: "Access denied: admins only" });  
        }

        const query = "INSERT INTO users_departments (user_id, department_id) VALUES ($1, $2) RETURNING *;";

        const result = await pool.query(query, [user_id, department_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


// Endpoint: Get all departments including number of employees
router.get("/", authMiddleware, async (req, res) => {
    try {
        const query = `
            SELECT
                d.id,
                d.name,
                COUNT(ud.user_id) AS employee_count
            FROM departments d
            LEFT JOIN users_departments ud ON d.id = ud.department_id
            GROUP BY d.id, d.name
            ORDER BY d.id;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {

        res.status(500).json({ message: "Internal server error" });
    }
});

 //delete departemnt by id 

 router.delete("/delete/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        if (req.user.status !== "admin") {
            return res.status(403).json({ message: "Access denied: admins only" });
        }

        // First, delete references from users_departments
        await pool.query(
            "DELETE FROM users_departments WHERE department_id = $1",
            [id]
        );

        // Then, delete the department
        const result = await pool.query(
            "DELETE FROM departments WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.json({ message: "Department deleted successfully", deleted: result.rows[0] });

    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
});

//get departement by id 
router.get("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT
                d.id,
                d.name,
                COUNT(ud.user_id) AS employee_count
            FROM departments d
            LEFT JOIN users_departments ud ON d.id = ud.department_id
            WHERE d.id = $1
            GROUP BY d.id, d.name;
        `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
      
        res.status(500).json({ message: "Internal server error" });
    }

   
   
});
 //update deoartemnt

router.put("/update/:id", authMiddleware, async (req,res) =>{
    const {id} = req.params;
    const {name} =  req.body;

    try {
        if(req.user.status !=="admin"){
            return res.status(403).json({ message: "Access denied: admins only" });  
        }

        if(!name || name.length < 2){
            return res.status(400).json({ message: "NAme is too short" });  
        }

        const   query = "UPDATE departments SET name = $1 WHERE id = $2 RETURNING *;";

        const result = await pool.query( query, [name, id]);
      if(result.rowCount === 0){
         return res.status(404).json({ message: "Department not found" });
      }

      res.status(200).json(result.rows[0]);

    } catch (error) {
         res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;