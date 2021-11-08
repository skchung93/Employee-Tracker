INSERT INTO department (name)
VALUES ("Engineering"), 
    ("Human Resources"), 
    ("Marketing"), 
    ("Recruiting"),
    ("Sales"), 
    ("Finance"), 
    ("Operations");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 1),
    ("HR Manager", 100000, 2),
    ("Product Marketing", 80000, 3),
    ("Technical Recruiter", 75000, 4),
    ("Account Executive", 80000, 5),
    ("Senior Accountant", 80000, 6),
    ("Sales Operations Manager", 85000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steven", "Stevens", 1, null),
    ("Andrew", "Andrews", 2, null),
    ("Marky", "Mark", 3, null),
    ("Peter", "Peterson", 4, 2),
    ("Jack", "Jackson", 5, null),
    ("Jeff", "Jefferson", 6, null),
    ("James", "Jameson", 7, null);
