const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // Built-in middleware for parsing URL-encoded data

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'ROOT',
    database: 'login_details'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.send("Error: Username already exists.");
        } else {
            res.send('Registered successfully');
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const user = result[0];

            if (user.password === password) {
                res.send("Login successful!");
            } else {
                res.send("Invalid password.");
            }
        } else {
            res.send("User not found.");
        }
    });
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
