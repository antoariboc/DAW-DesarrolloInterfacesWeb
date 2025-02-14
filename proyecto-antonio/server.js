const express = require('express');
const app = express();
const port = 3000;

//todo el codigo comentado es de claude y rompe, creo que por el cors
/*
const { Pool } = require('pg');
const cors = require('cors');
*/

// Servir archivos estáticos
app.use(express.static('public'));
// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

/*

// Middleware
app.use(cors());

// PostgreSQL connection configuration
const pool = new Pool({
    //host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydatabase',
    port: 5432
});


// Initialize database tables
async function initializeDatabase() {
    try {
        const client = await pool.connect();
        
        // Create students table
        await client.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                student_id VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create grades table
        await client.query(`
            CREATE TABLE IF NOT EXISTS grades (
                id SERIAL PRIMARY KEY,
                student_id VARCHAR(20) NOT NULL,
                assignment_name VARCHAR(100) NOT NULL,
                score DECIMAL(5,2) NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
            )
        `);

        client.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}


// API Endpoints

// Get all students with their grades
app.get('/students', async (req, res) => {
    try {
        const { rows: students } = await pool.query('SELECT * FROM students');
        
        // Get grades for each student
        const studentsWithGrades = await Promise.all(students.map(async (student) => {
            const { rows: grades } = await pool.query(
                'SELECT * FROM grades WHERE student_id = $1',
                [student.student_id]
            );
            return {
                ...student,
                grades: grades
            };
        }));

        res.json(studentsWithGrades);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching students' });
    }
});

// Get single student with grades
app.get('/students/:studentId', async (req, res) => {
    try {
        const { rows: students } = await pool.query(
            'SELECT * FROM students WHERE student_id = $1',
            [req.params.studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const { rows: grades } = await pool.query(
            'SELECT * FROM grades WHERE student_id = $1',
            [req.params.studentId]
        );

        const student = {
            ...students[0],
            grades: grades
        };

        res.json(student);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching student' });
    }
});

// Add new student
app.post('/students', async (req, res) => {
    const { name, studentId } = req.body;
    
    try {
        await pool.query(
            'INSERT INTO students (student_id, name) VALUES ($1, $2)',
            [studentId, name]
        );
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL unique violation error code
            res.status(400).json({ error: 'Student ID already exists' });
        } else {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error adding student' });
        }
    }
});

// Delete student
app.delete('/students/:studentId', async (req, res) => {
    try {
        // No need to delete grades first due to ON DELETE CASCADE
        const result = await pool.query(
            'DELETE FROM students WHERE student_id = $1',
            [req.params.studentId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error deleting student' });
    }
});

// Add new grade
app.post('/grades', async (req, res) => {
    const { studentId, assignmentName, grade } = req.body;
    
    try {
        await pool.query(
            'INSERT INTO grades (student_id, assignment_name, score) VALUES ($1, $2, $3)',
            [studentId, assignmentName, grade]
        );
        res.status(201).json({ message: 'Grade added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error adding grade' });
    }
});
*/



// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});