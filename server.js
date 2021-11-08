const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker_db'
    });


