# Employee Database Management System
### A Doubly Linked List Implementation in C++

[![Language](https://img.shields.io/badge/Language-C++-blue.svg)](https://isocpp.org/)
[![Data Structure](https://img.shields.io/badge/Data%20Structure-Doubly%20Linked%20List-green.svg)]()
[![Standard](https://img.shields.io/badge/Standard-C%2B%2B11-orange.svg)]()

## 1. Project Overview

The **Employee Database Management System** is a menu-driven application developed in C++ using a Doubly Linked List data structure.

The project provides an organized way to manage employee records, including adding, deleting, searching, updating, and displaying employee information.

Unlike a traditional array-based approach, this project uses dynamically allocated nodes connected through two pointers: `prev` and `next`. This allows traversal in both forward and reverse directions.

The application also uses file handling to save employee records in a text file, allowing data to remain available when the program is restarted.

### Objectives

- Understand the implementation of a Doubly Linked List.
- Perform insertion, deletion, searching and updating operations.
- Demonstrate forward and backward traversal.
- Implement dynamic memory allocation and deallocation.
- Use file handling for persistent employee records.
- Understand the time and space complexity of linked-list operations.

## 2. Data Structure Architecture

### What is a Doubly Linked List?

A Doubly Linked List is a linear data structure in which each node contains three components:

1. **Data:** Stores employee information.
2. **Previous Pointer (`prev`):** Points to the previous node.
3. **Next Pointer (`next`):** Points to the next node.

Unlike a singly linked list, a doubly linked list supports traversal in both directions.

### Node Structure

```cpp
struct Node {
    Employee data;
    Node* prev;
    Node* next;

    Node(Employee emp) {
        data = emp;
        prev = nullptr;
        next = nullptr;
    }
};
```

### Employee Structure

```cpp
struct Employee {
    int id;
    string name;
    string department;
    string designation;
    double salary;
};
```

### Visual Representation

```text
        HEAD                              TAIL
          |                                 |
          v                                 v
      +-------+       +-------+       +-------+
NULL  |  101  | <-->  |  102  | <-->  |  103  |  NULL
      +-------+       +-------+       +-------+
       Node 1          Node 2          Node 3

       Forward Traversal  ------>
       Reverse Traversal  <------
```

### Core Class: EmployeeDatabase

The `EmployeeDatabase` class manages the entire linked list.

It contains:

- `head`: Pointer to the first node.
- `tail`: Pointer to the last node.
- `employeeCount`: Stores the total number of employees.

The class provides methods for employee management, traversal, searching, file operations and memory cleanup.

### Insertion at the End

When a new employee is added:

1. A new node is dynamically created.
2. If the list is empty, both `head` and `tail` point to the new node.
3. Otherwise, the new node's `prev` points to the current tail.
4. The current tail's `next` points to the new node.
5. The tail pointer is updated.

### Deletion

When an employee is deleted:

1. The employee is located using its ID.
2. The previous node is connected to the next node.
3. The next node is connected to the previous node.
4. The deleted node is removed using `delete`.
5. The employee count is decreased.

Special cases such as deleting the first node, last node or only node are handled.

## 3. Key Features

The application provides the following operations through an interactive command-line menu.

| Feature | Description |
|---|---|
| Add Employee | Inserts a new employee at the end of the list. |
| Delete Employee | Removes an employee using their unique ID. |
| Search Employee | Searches employees by ID or name. |
| Update Employee | Updates employee details. |
| Display Employees | Displays all stored employee records. |
| Forward Traversal | Traverses from head to tail. |
| Reverse Traversal | Traverses from tail to head. |
| Count Employees | Displays the total number of employees. |
| File Handling | Saves and loads employee records. |

### Input Validation

The application includes basic input validation:

- Employee IDs must be positive.
- Duplicate employee IDs are not allowed.
- Employee names and other text fields cannot be empty.
- Text fields cannot contain the `|` delimiter used in file storage.
- Salary must be a valid non-negative number.
- Invalid menu inputs are rejected.

### File Handling

Employee records are stored in:

```text
employees.txt
```

Records are saved using a pipe-separated format:

```text
101|Rahul Sharma|IT|Developer|35000
102|Priya Verma|HR|Manager|45000
```

The program loads existing records when it starts and saves the records when changes are made and when the application exits.

## 4. Memory Trade-offs & Complexity Analysis

### Time Complexity

Let `n` represent the total number of employee nodes.

| Operation | Time Complexity | Explanation |
|---|---|---|
| Add Employee | O(n) | Duplicate ID check takes O(n); insertion itself is O(1). |
| Delete Employee | O(n) | Searching takes O(n); unlinking the node takes O(1). |
| Search by ID | O(n) | Sequential traversal is required. |
| Search by Name | O(n) | Each employee name is checked. |
| Update Employee | O(n) | Employee must first be located. |
| Display All | O(n) | Every node is visited. |
| Forward Traversal | O(n) | Traverses from head to tail. |
| Reverse Traversal | O(n) | Traverses from tail to head. |
| Count Employees | O(1) | Maintains a separate employee counter. |

### Space Complexity

The overall space complexity is **O(n)** because each employee requires one dynamically allocated node.

Each node stores:

- Employee information.
- One pointer to the previous node.
- One pointer to the next node.

### Memory Trade-offs

**Advantages:**

- Dynamic memory allocation.
- Supports traversal in both directions.
- Efficient node insertion and deletion once the node is located.
- Does not require a fixed-size array.

**Disadvantages:**

- Requires additional memory for two pointers per node.
- Searching requires sequential traversal.
- Pointer management makes implementation more complex than arrays.

## 5. How to Run & Install

### Prerequisites

- A C++ compiler such as GCC or MinGW.
- A terminal or command prompt.
- C++11 or later support.

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Navigate to the Project Folder

```bash
cd Employee-Database-Management
```

### Step 3: Compile the Program

```bash
g++ -std=c++11 main.cpp -o employee.exe
```

### Step 4: Run the Application

On Windows PowerShell:

```powershell
.\employee.exe
```

The program automatically loads existing records from `employees.txt` if the file is available.

## 6. Code Structure Blueprint

The project is implemented in a single C++ source file.

| Component | Responsibility |
|---|---|
| `Employee` | Stores employee details. |
| `Node` | Represents an individual doubly linked list node. |
| `EmployeeDatabase` | Manages the linked list and employee operations. |
| `findById()` | Locates an employee using ID. |
| `appendEmployee()` | Inserts a node at the end. |
| `deleteEmployee()` | Removes an employee node. |
| `saveToFile()` | Saves records to a text file. |
| `loadFromFile()` | Loads records from a text file. |
| `forwardTraversal()` | Displays nodes from head to tail. |
| `reverseTraversal()` | Displays nodes from tail to head. |
| `main()` | Controls the menu and user interaction. |

### Memory Management

The program uses dynamic memory allocation through `new` when creating nodes.

The destructor releases allocated memory using `delete` while traversing the linked list.

This prevents dynamically allocated nodes from remaining in memory after the database object is destroyed.

## 7. Screenshots

The following screenshots demonstrate the application's functionality.

Save your actual terminal screenshots in the `screenshots` folder and use these image paths.

### Main Menu

![Main Menu](screenshots/01_main_menu.png)

### Add Employee

![Add Employee](screenshots/02_add_employee.png)

### Display All Employees

![Display Employees](screenshots/03_display_employees.png)

### Search Employee

![Search Employee](screenshots/04_search_employee.png)

### Update Employee

![Update Employee](screenshots/05_update_employee.png)

### Delete Employee

![Delete Employee](screenshots/06_delete_employee.png)

### Forward Traversal

![Forward Traversal](screenshots/07_forward_traversal.png)

### Reverse Traversal

![Reverse Traversal](screenshots/08_reverse_traversal.png)

## 8. Future Scope

The project can be extended with the following improvements:

- Search employees by department or designation.
- Sort employee records by salary or employee ID.
- Add department-wise employee reports.
- Introduce a graphical user interface.
- Integrate a relational database such as MySQL.
- Add authentication and role-based access.
- Export employee records into CSV or PDF formats.

## 9. Author & Acknowledgements

### Developed By

### Developed By

**Name:** Riya Arora  
**Roll Number:** YOUR ROLL NUMBER  
**Section:** YOUR SECTION  
**Course:** B.Tech Computer Science and Engineering (AI & ML)  
**Institution:** Delhi Technical Campus, GGSIPU

### Project Information

**Project Title:** Employee Database Management System Using Doubly Linked List  
**Subject:** Data Structures  
**Programming Language:** C++  
**Academic Year:** 2026–2027

### Acknowledgements

I would like to express my gratitude to my faculty members for their guidance and support throughout this project.

I also acknowledge the learning resources and references that helped me understand linked lists, dynamic memory allocation, file handling and object-oriented programming concepts.

---

**Note:** This project is developed for academic purposes to demonstrate the practical implementation of a Doubly Linked List in C++.
