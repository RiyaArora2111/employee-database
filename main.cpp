
#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <limits>
#include <algorithm>
#include <cctype>

using namespace std;

// Employee structure
struct Employee {
    int id;
    string name;
    string department;
    string designation;
    double salary;
};

// Doubly Linked List Node
struct Node {
    Employee data;
    Node* prev;
    Node* next;

    Node(Employee emp) {
        data = emp;
        prev = NULL;
        next = NULL;
    }
};

// Employee Database Class
class EmployeeDatabase {
private:
    Node* head;
    Node* tail;
    int employeeCount;

    // Search employee by ID
    Node* findById(int id) {
        Node* current = head;

        while (current != NULL) {
            if (current->data.id == id)
                return current;

            current = current->next;
        }

        return NULL;
    }

    // Insert employee at the end
    void appendEmployee(Employee emp) {
        Node* newNode = new Node(emp);

        if (head == NULL) {
            head = tail = newNode;
        }
        else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }

        employeeCount++;
    }

    // Convert string to lowercase
    string toLowerCase(string str) {
        transform(str.begin(), str.end(), str.begin(),
            [](unsigned char c) {
                return static_cast<char>(tolower(c));
            });

        return str;
    }

    // Save records to file
    void saveToFile() {
        ofstream file("employees.txt");

        if (!file) {
            cout << "Error saving employee records!\n";
            return;
        }

        Node* current = head;

        while (current != NULL) {
            file << current->data.id << "|"
                 << current->data.name << "|"
                 << current->data.department << "|"
                 << current->data.designation << "|"
                 << current->data.salary << "\n";

            current = current->next;
        }

        file.close();
    }

    // Load records from file
    void loadFromFile() {
        ifstream file("employees.txt");

        if (!file)
            return;

        string line;

        while (getline(file, line)) {
            if (line.empty())
                continue;

            try {
                Employee emp;
                size_t pos;

                pos = line.find('|');
                if (pos == string::npos) continue;
                emp.id = stoi(line.substr(0, pos));
                line.erase(0, pos + 1);

                pos = line.find('|');
                if (pos == string::npos) continue;
                emp.name = line.substr(0, pos);
                line.erase(0, pos + 1);

                pos = line.find('|');
                if (pos == string::npos) continue;
                emp.department = line.substr(0, pos);
                line.erase(0, pos + 1);

                pos = line.find('|');
                if (pos == string::npos) continue;
                emp.designation = line.substr(0, pos);
                line.erase(0, pos + 1);

                emp.salary = stod(line);

                if (emp.id > 0 && emp.salary >= 0 &&
                    findById(emp.id) == NULL) {
                    appendEmployee(emp);
                }
            }
            catch (...) {
                cout << "Invalid record skipped from file.\n";
            }
        }

        file.close();
    }

    // Display table heading
    void printHeader() {
        cout << "\n";
        cout << left
             << setw(10) << "ID"
             << setw(22) << "Name"
             << setw(18) << "Department"
             << setw(24) << "Designation"
             << setw(12) << "Salary" << "\n";

        cout << string(86, '-') << "\n";
    }

    // Display one employee
    void printEmployee(Employee emp) {
        cout << left
             << setw(10) << emp.id
             << setw(22) << emp.name
             << setw(18) << emp.department
             << setw(24) << emp.designation
             << fixed << setprecision(2)
             << setw(12) << emp.salary << "\n";
    }

    // Validate employee text fields
    bool validText(const string& value) {
        return !value.empty() &&
               value.find('|') == string::npos;
    }

public:

    // Constructor
    EmployeeDatabase() {
        head = NULL;
        tail = NULL;
        employeeCount = 0;

        loadFromFile();
    }

    // Destructor
    ~EmployeeDatabase() {
        saveToFile();

        Node* current = head;

        while (current != NULL) {
            Node* temp = current;
            current = current->next;
            delete temp;
        }

        head = tail = NULL;
    }

    // Add employee
    void addEmployee() {
        Employee emp;

        cout << "\nEnter Employee ID: ";
        cin >> emp.id;

        if (cin.fail() || emp.id <= 0) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid employee ID!\n";
            return;
        }

        if (findById(emp.id) != NULL) {
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Employee ID already exists!\n";
            return;
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        cout << "Enter Name: ";
        getline(cin, emp.name);

        cout << "Enter Department: ";
        getline(cin, emp.department);

        cout << "Enter Designation: ";
        getline(cin, emp.designation);

        cout << "Enter Salary: ";
        cin >> emp.salary;

        if (cin.fail() || emp.salary < 0 ||
            !validText(emp.name) ||
            !validText(emp.department) ||
            !validText(emp.designation)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid employee details!\n";
            return;
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        appendEmployee(emp);
        saveToFile();

        cout << "\nEmployee added successfully!\n";
    }

    // Delete employee
    void deleteEmployee() {
        int id;

        cout << "\nEnter Employee ID to delete: ";
        cin >> id;

        if (cin.fail()) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid ID!\n";
            return;
        }

        Node* current = findById(id);

        if (current == NULL) {
            cout << "Employee not found!\n";
            return;
        }

        if (current == head && current == tail) {
            head = tail = NULL;
        }
        else if (current == head) {
            head = head->next;
            head->prev = NULL;
        }
        else if (current == tail) {
            tail = tail->prev;
            tail->next = NULL;
        }
        else {
            current->prev->next = current->next;
            current->next->prev = current->prev;
        }

        delete current;
        employeeCount--;

        saveToFile();

        cout << "Employee deleted successfully!\n";
    }

    // Search employee by ID
    void searchById() {
        int id;

        cout << "\nEnter Employee ID: ";
        cin >> id;

        if (cin.fail()) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid ID!\n";
            return;
        }

        Node* current = findById(id);

        if (current == NULL) {
            cout << "Employee not found!\n";
        }
        else {
            printHeader();
            printEmployee(current->data);
        }
    }

    // Search employee by name
    void searchByName() {
        string name;
        bool found = false;

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        cout << "\nEnter Employee Name: ";
        getline(cin, name);

        string searchName = toLowerCase(name);

        printHeader();

        Node* current = head;

        while (current != NULL) {
            if (toLowerCase(current->data.name).find(searchName)
                != string::npos) {
                printEmployee(current->data);
                found = true;
            }

            current = current->next;
        }

        if (!found)
            cout << "No matching employee found!\n";
    }

    // Update employee
    void updateEmployee() {
        int id;

        cout << "\nEnter Employee ID to update: ";
        cin >> id;

        if (cin.fail()) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid ID!\n";
            return;
        }

        Node* current = findById(id);

        if (current == NULL) {
            cout << "Employee not found!\n";
            return;
        }

        Employee updated;

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        cout << "Enter New Name: ";
        getline(cin, updated.name);

        cout << "Enter New Department: ";
        getline(cin, updated.department);

        cout << "Enter New Designation: ";
        getline(cin, updated.designation);

        cout << "Enter New Salary: ";
        cin >> updated.salary;

        if (cin.fail() || updated.salary < 0 ||
            !validText(updated.name) ||
            !validText(updated.department) ||
            !validText(updated.designation)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid details. Update cancelled!\n";
            return;
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        updated.id = id;
        current->data = updated;

        saveToFile();

        cout << "Employee updated successfully!\n";
    }

    // Display all employees
    void displayAllEmployees() {
        if (head == NULL) {
            cout << "\nNo employee records available.\n";
            return;
        }

        cout << "\n========== ALL EMPLOYEE RECORDS ==========\n";

        printHeader();

        Node* current = head;

        while (current != NULL) {
            printEmployee(current->data);
            current = current->next;
        }

        cout << "\nTotal Employees: " << employeeCount << "\n";
    }

    // Forward traversal
    void forwardTraversal() {
        if (head == NULL) {
            cout << "\nNo employee records available.\n";
            return;
        }

        cout << "\n========== FORWARD TRAVERSAL ==========\n";

        printHeader();

        Node* current = head;

        while (current != NULL) {
            printEmployee(current->data);
            current = current->next;
        }
    }

    // Reverse traversal
    void reverseTraversal() {
        if (tail == NULL) {
            cout << "\nNo employee records available.\n";
            return;
        }

        cout << "\n========== REVERSE TRAVERSAL ==========\n";

        printHeader();

        Node* current = tail;

        while (current != NULL) {
            printEmployee(current->data);
            current = current->prev;
        }
    }

    // Display employee count
    void displayCount() {
        cout << "\nTotal number of employees: "
             << employeeCount << "\n";
    }
};

// Welcome screen
void printWelcome() {
    cout << "\n";
    cout << "============================================\n";
    cout << "       EMPLOYEE DATABASE MANAGEMENT         \n";
    cout << "============================================\n";
    cout << "       Doubly Linked List Implementation    \n";
    cout << "============================================\n";
}

// Display menu
void printMenu() {
    cout << "\n=============== MAIN MENU ===============\n";
    cout << "1. Add Employee\n";
    cout << "2. Delete Employee\n";
    cout << "3. Search Employee by ID\n";
    cout << "4. Search Employee by Name\n";
    cout << "5. Update Employee\n";
    cout << "6. Display All Employees\n";
    cout << "7. Forward Traversal\n";
    cout << "8. Reverse Traversal\n";
    cout << "9. Display Employee Count\n";
    cout << "10. Exit\n";
    cout << "========================================\n";
    cout << "Enter your choice: ";
}

// Main function
int main() {
    EmployeeDatabase db;
    int choice;

    printWelcome();

    do {
        printMenu();
        cin >> choice;

        if (cin.fail()) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "\nInvalid input! Please enter a number.\n";
            continue;
        }

        switch (choice) {
            case 1:
                db.addEmployee();
                break;

            case 2:
                db.deleteEmployee();
                break;

            case 3:
                db.searchById();
                break;

            case 4:
                db.searchByName();
                break;

            case 5:
                db.updateEmployee();
                break;

            case 6:
                db.displayAllEmployees();
                break;

            case 7:
                db.forwardTraversal();
                break;

            case 8:
                db.reverseTraversal();
                break;

            case 9:
                db.displayCount();
                break;

            case 10:
                cout << "\nThank you for using Employee Database Management System!\n";
                break;

            default:
                cout << "\nInvalid choice! Please select 1-10.\n";
        }

    } while (choice != 10);

    return 0;
}
