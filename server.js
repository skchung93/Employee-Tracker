//importing depencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const dotenv = require('dotenv').config();

//creating a port variable
const PORT = process.env.PORT || 3001;

//connecting to the db
const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker_db'
    },
    console.log(`Connected to the database on ${PORT}.`)
    );

//starting the inquirer prompt giving options of what we want to do
function starter() {
    inquirer.prompt([
        {
        type: "list",
        message: "What would you like to do?",
        name: "options",
        choices: [
                    "View All Departments?",
                    "View All Roles?",
                    "View All Employees?",
                    "Add a Department?",
                    "Add a Role?",
                    "Add an Employee?",
                    "Update an Employee Role?",
                    ]
        }
    ])
    .then((answers) => {
        //creating a switch case thing to handle what the user chooses.
        switch (answers.options) {
            case 'View All Departments?':
                viewAllDepartments();
            break;
            case 'View All Roles?':
                viewAllRoles();
            break;
            case 'View All Employees?':
                viewAllEmployees();
            break;
            case 'Add a Department?':
                addDepartment();
            break;
            case 'Add a Role?':
                addRole();
            break;
            case 'Add an Employee?':
                addEmployee();
            break;
            case 'Update an Employee Role?':
                updateEmployeeRole();
            break;
        };    
    })
}
//Creating view all departments function/query
function viewAllDepartments() {
    db.query(`SELECT * FROM department`,
    (err, res) =>{
        if (err) {
            console.log(err);
        }
        else{
            console.table(res);
            starter();
        };
    });
}

//Creating a view all roles function/query
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

function viewAllRoles(){
    db.query(`SELECT role.id,
            role.title,
            role.salary,
            department.name
            FROM role
            JOIN department on department.id = role.department_id`,
    (err, res) =>{
        if (err) {
            console.log(err);
        }
        else{
            console.table(res);
            starter();
        };
    });
}

//Creating a view all employees funciton/query
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

function viewAllEmployees(){
    db.query(`SELECT employee.id, 
            employee.first_name, 
            employee.last_name, 
            role.title, 
            role.salary, 
            department.name, 
            e.id AS managerID
            FROM employee
            JOIN role on role.id = employee.role_id
            JOIN department on department.id = role.department_id
            LEFT JOIN employee e on employee.manager_id = e.id
            `,
    (err, res) =>{
        if (err) {
            console.log(err);
        }
        else{
            console.table(res);
            starter();
        };
    });
}

//Creating an add department function
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

function addDepartment(){
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Department name:"
        }
    ]).then((answer) => {
        db.query(`INSERT INTO department SET ?`,
            {
                name: answer.name
            },
            (err, res) =>{
                if (err) {
                    console.log(err);
                }
                else{
                    console.log('Department created!');
                    starter();
                };
            }
        );
    })
}

//Creating an add role function
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

function addRole(){
    db.query (`SELECT department.name, department.id FROM department`,
    (err, res) => {
        var departmentNames = res.map(( {name, id}) => ({name: name, value: id}));
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Role name: "
            },
            {
                name: "salary",
                type: "input",
                message: "Salary: "
            },
            {   
                type: "list",
                mesage: "Select a department",
                name: "department",
                choices: departmentNames
            }
        ]).then((answers) => {
            db.query(`INSERT INTO role set ?`,
            {
                title: answers.title,
                salary: answers.salary,
                department_id: answers.department,
            },
            (err, res) =>{
                if (err) {
                    console.log(err);
                }
                else{
                    console.log('Role added!');
                    starter();
                };
            })
        });
    });
};

//Creating an add employee function
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

function addEmployee(){
    db.query(`SELECT employee.id, 
            employee.first_name, 
            employee.last_name, 
            employee.manager_id,
            role.title as role_title,
            role.id as roleid
            FROM employee 
            JOIN role on employee.role_id = role.id`,
    (err, res) => {
        var managerNames = res.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}));
        var roleNames = res.map(({role_title, roleid}) => ({name: role_title, value: roleid}))
        inquirer.prompt([
            {
                name: "firstname",
                type: "input",
                message: "First Name: "
            },
            {
                name: "lastname",
                type: "input",
                message: "Last Name: "
            },
            {
                type: "list",
                mesage: "Select a role",
                name: "role",
                choices: roleNames
            },
            {   
                type: "list",
                mesage: "Select a manager",
                name: "manager",
                choices: managerNames
            }
        ]).then((answers) => {
            db.query(`INSERT INTO employee set?`,
            {
                first_name: answers.firstname,
                last_name: answers.lastname,
                role_id: answers.role,
                manager_id: answers.manager,
            });
            (err, res) => {
                if (err) {
                    console.log(err);
                }
                else{
                    console.log('Employee added!');
                    starter();
                };
            }
        });
    });
}

//Creating an update employee role function
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

function updateEmployeeRole(){
    db.query(`SELECT employee.id,
            employee.first_name,
            employee.last_name,
            role.title as role_title,
            role.id as role_id
            FROM employee
            JOIN role on employee.role_id = role.id`,
    (err, res) => {
    var employeeNames = res.map(({id, first_name, last_name}) => ({name: first_name + last_name, value: id}))
    var roleNames = res.map(({role_title, role_id}) => ({name: role_title, value: role_id}))
    inquirer.prompt([
        {
            type: "list",
            mesage: "Select an employee",
            name: "employee",
            choices: employeeNames
        },
        {
            type: "list",
            mesage: "Select a role",
            name: "newRole",
            choices: roleNames
        }
    ]);
        (err, res) => {
            if (err) {
                console.log(err);
            }
            else{
                console.log('Employee role updated!');
                starter();
            }
        };
    });
}


//Calling the starter to get the application going
starter();
