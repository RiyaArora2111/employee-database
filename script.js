
"use strict";

// ======================================
// EMPLOYEE DATABASE MANAGEMENT SYSTEM
// ======================================

const STORAGE_KEY = "employeeDB_records_v2";
const THEME_KEY = "employeeDB_theme";

let employees = loadEmployees();
let editingId = null;

const $ = id => document.getElementById(id);

// ======================================
// LOAD AND SAVE EMPLOYEES
// ======================================

function loadEmployees() {
    try {
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(data)
            ? data.filter(emp =>
                emp &&
                Number.isInteger(Number(emp.id))
            )
            : [];

    } catch {
        return [];
    }
}

function saveEmployees() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(employees)
    );
}

// ======================================
// UTILITY FUNCTIONS
// ======================================

function formatMoney(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

function notify(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(notify.timer);

    notify.timer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

function getInitials(name) {
    return String(name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("") || "?";
}

// ======================================
// DASHBOARD STATISTICS
// ======================================

function updateStats() {

    const total = employees.length;

    const totalSalary = employees.reduce(
        (sum, emp) => sum + Number(emp.salary || 0),
        0
    );

    const average = total
        ? totalSalary / total
        : 0;

    const highest = total
        ? Math.max(...employees.map(emp =>
            Number(emp.salary || 0)
        ))
        : 0;

    const departments = {};

    employees.forEach(emp => {
        departments[emp.department] =
            (departments[emp.department] || 0) + 1;
    });

    $("totalEmployees").textContent = total;

    $("departmentCount").textContent =
        Object.keys(departments).length;

    $("averageSalary").textContent =
        formatMoney(average);

    $("highestSalary").textContent =
        formatMoney(highest);

    $("totalPayroll").textContent =
        formatMoney(totalSalary);

    const topDepartment = Object.entries(departments)
        .sort((a, b) => b[1] - a[1])[0];

    $("topDepartment").textContent =
        topDepartment ? topDepartment[0] : "—";
}

// ======================================
// DEPARTMENT FILTER
// ======================================

function updateDepartmentFilter() {

    const select = $("departmentFilter");
    const previous = select.value;

    const departments = [
        ...new Set(
            employees.map(emp => emp.department)
        )
    ].sort();

    select.innerHTML =
        '<option value="">All Departments</option>';

    departments.forEach(department => {

        const option = document.createElement("option");

        option.value = department;
        option.textContent = department;

        select.appendChild(option);
    });

    select.value = departments.includes(previous)
        ? previous
        : "";
}

// ======================================
// SEARCH AND SORT
// ======================================

function getFilteredEmployees() {

    const query = $("searchInput").value
        .trim()
        .toLowerCase();

    const department = $("departmentFilter").value;

    let result = employees.filter(emp => {

        const matchesSearch = [
            emp.id,
            emp.name,
            emp.department,
            emp.designation
        ].some(value =>
            String(value).toLowerCase().includes(query)
        );

        const matchesDepartment =
            !department ||
            emp.department === department;

        return matchesSearch && matchesDepartment;
    });

    const [field, direction] =
        $("sortSelect").value.split("-");

    result.sort((a, b) => {

        if (field === "name") {
            return direction === "asc"
                ? String(a.name).localeCompare(String(b.name))
                : String(b.name).localeCompare(String(a.name));
        }

        return direction === "asc"
            ? Number(a[field]) - Number(b[field])
            : Number(b[field]) - Number(a[field]);
    });

    return result;
}

// ======================================
// DISPLAY EMPLOYEES - REDESIGNED TABLE
// ======================================

function displayEmployees() {

    const table = $("employeeTable");
    const list = getFilteredEmployees();

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    <div class="empty-state">
                        <span>👥</span>
                        <strong>No employees found</strong>
                        <small>Try changing your search or filters.</small>
                    </div>
                </td>
            </tr>
        `;

    } else {

        list.forEach(emp => {

            const row = document.createElement("tr");

            // Employee ID
            const idCell = document.createElement("td");

            idCell.className = "employee-id";
            idCell.textContent = `#${emp.id}`;

            row.appendChild(idCell);

            // Employee name and avatar
            const nameCell = document.createElement("td");

            nameCell.className = "employee-info";

            const avatar = document.createElement("span");

            avatar.className = "employee-avatar";
            avatar.textContent = getInitials(emp.name);

            const name = document.createElement("span");

            name.className = "employee-name";
            name.textContent = emp.name;

            nameCell.append(avatar, name);

            row.appendChild(nameCell);

            // Department badge
            const departmentCell = document.createElement("td");

            const badge = document.createElement("span");

            badge.className = "department-pill";
            badge.textContent = emp.department;

            departmentCell.appendChild(badge);

            row.appendChild(departmentCell);

            // Designation
            const designationCell = document.createElement("td");

            designationCell.className = "designation-cell";
            designationCell.textContent = emp.designation;

            row.appendChild(designationCell);

            // Salary
            const salaryCell = document.createElement("td");

            salaryCell.className = "salary-cell";
            salaryCell.textContent = formatMoney(emp.salary);

            row.appendChild(salaryCell);

            // Action buttons
            const actionCell = document.createElement("td");

            const actionGroup = document.createElement("div");

            actionGroup.className = "action-group";

            const actions = [
                {
                    label: "View",
                    className: "action-btn view-action",
                    callback: () => viewEmployee(emp.id)
                },
                {
                    label: "Edit",
                    className: "action-btn edit-action",
                    callback: () => editEmployee(emp.id)
                },
                {
                    label: "Delete",
                    className: "action-btn delete-btn",
                    callback: () => deleteEmployee(emp.id)
                }
            ];

            actions.forEach(action => {

                const button = document.createElement("button");

                button.type = "button";
                button.textContent = action.label;
                button.className = action.className;

                button.addEventListener(
                    "click",
                    action.callback
                );

                actionGroup.appendChild(button);
            });

            actionCell.appendChild(actionGroup);

            row.appendChild(actionCell);

            table.appendChild(row);
        });
    }

    $("recordCount").textContent =
        `${list.length} / ${employees.length} Records`;

    updateStats();
    updateDepartmentFilter();
    drawCharts();
}

// ======================================
// ADD AND UPDATE EMPLOYEE
// ======================================

$("employeeForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const id = Number($("empId").value);
    const name = $("empName").value.trim();
    const department = $("empDepartment").value.trim();
    const designation = $("empDesignation").value.trim();
    const salary = Number($("empSalary").value);

    if (
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        !name ||
        !department ||
        !designation ||
        !Number.isFinite(salary) ||
        salary < 0
    ) {
        notify("Please enter valid employee details.");
        return;
    }

    const duplicate = employees.some(emp =>
        Number(emp.id) === id &&
        Number(emp.id) !== editingId
    );

    if (duplicate) {
        notify("Employee ID already exists!");
        return;
    }

    const record = {
        id,
        name,
        department,
        designation,
        salary
    };

    if (editingId === null) {

        employees.push(record);

        notify("Employee added successfully!");

    } else {

        const index = employees.findIndex(emp =>
            Number(emp.id) === editingId
        );

        if (index === -1) {

            notify("Employee record not found.");

            resetForm();

            return;
        }

        employees[index] = record;

        notify("Employee updated successfully!");
    }

    saveEmployees();

    resetForm();

    displayEmployees();
});

// ======================================
// EDIT EMPLOYEE
// ======================================

function editEmployee(id) {

    const emp = employees.find(item =>
        Number(item.id) === Number(id)
    );

    if (!emp) return;

    editingId = Number(emp.id);

    $("empId").value = emp.id;
    $("empName").value = emp.name;
    $("empDepartment").value = emp.department;
    $("empDesignation").value = emp.designation;
    $("empSalary").value = emp.salary;

    $("empId").disabled = true;

    $("formTitle").textContent = "Update Employee";
    $("submitBtn").textContent = "Save Changes";

    $("cancelBtn").classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ======================================
// RESET FORM
// ======================================

function resetForm() {

    $("employeeForm").reset();

    editingId = null;

    $("empId").disabled = false;

    $("formTitle").textContent = "Add New Employee";
    $("submitBtn").textContent = "+ Add Employee";

    $("cancelBtn").classList.add("hidden");
}

$("cancelBtn").addEventListener("click", resetForm);

// ======================================
// DELETE EMPLOYEE
// ======================================

function deleteEmployee(id) {

    const emp = employees.find(item =>
        Number(item.id) === Number(id)
    );

    if (!emp) return;

    const confirmed = confirm(
        `Are you sure you want to delete ${emp.name}?`
    );

    if (!confirmed) return;

    employees = employees.filter(item =>
        Number(item.id) !== Number(id)
    );

    if (editingId === Number(id)) {
        resetForm();
    }

    saveEmployees();

    displayEmployees();

    notify("Employee deleted successfully!");
}

// ======================================
// VIEW EMPLOYEE PROFILE
// ======================================

function viewEmployee(id) {

    const emp = employees.find(item =>
        Number(item.id) === Number(id)
    );

    if (!emp) return;

    const fields = [
        ["Employee ID", emp.id],
        ["Full Name", emp.name],
        ["Department", emp.department],
        ["Designation", emp.designation],
        ["Monthly Salary", formatMoney(emp.salary)]
    ];

    const content = $("profileContent");

    content.innerHTML = "";

    fields.forEach(([label, value]) => {

        const row = document.createElement("div");

        row.className = "profile-row";

        const title = document.createElement("span");

        title.textContent = label;

        const detail = document.createElement("strong");

        detail.textContent = value;

        row.append(title, detail);

        content.appendChild(row);
    });

    $("profileModal").classList.add("show");
}

$("closeProfile").addEventListener("click", () => {

    $("profileModal").classList.remove("show");
});

$("profileModal").addEventListener("click", event => {

    if (event.target === $("profileModal")) {
        $("profileModal").classList.remove("show");
    }
});

// ======================================
// SEARCH, FILTER AND SORT EVENTS
// ======================================

$("searchInput").addEventListener(
    "input",
    displayEmployees
);

$("departmentFilter").addEventListener(
    "change",
    displayEmployees
);

$("sortSelect").addEventListener(
    "change",
    displayEmployees
);

// ======================================
// CSV EXPORT
// ======================================

$("exportBtn").addEventListener("click", () => {

    if (employees.length === 0) {

        notify("No employee records to export.");

        return;
    }

    const rows = [
        ["ID", "Name", "Department", "Designation", "Salary"],

        ...employees.map(emp => [
            emp.id,
            emp.name,
            emp.department,
            emp.designation,
            emp.salary
        ])
    ];

    const csv = rows.map(row =>
        row.map(value =>
            '"' + String(value).replace(/"/g, '""') + '"'
        ).join(",")
    ).join("\r\n");

    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "employee-records.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    notify("CSV downloaded successfully!");
});

// ======================================
// PRINT RECORDS
// ======================================

$("printBtn").addEventListener("click", () => {
    window.print();
});

// ======================================
// DARK / LIGHT MODE
// ======================================

function applySavedTheme() {

    const savedTheme = localStorage.getItem(THEME_KEY);

    const isDark = savedTheme === "dark";

    document.body.classList.toggle("dark", isDark);

    $("themeBtn").textContent = isDark ? "☀" : "☾";
}

$("themeBtn").addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    $("themeBtn").textContent =
        darkMode ? "☀" : "☾";

    localStorage.setItem(
        THEME_KEY,
        darkMode ? "dark" : "light"
    );

    drawCharts();
});

applySavedTheme();

// ======================================
// DEPARTMENT CHART
// ======================================

function drawDepartmentChart() {

    const canvas = $("departmentChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const departments = {};

    employees.forEach(emp => {

        departments[emp.department] =
            (departments[emp.department] || 0) + 1;
    });

    const entries = Object.entries(departments)
        .sort((a, b) => b[1] - a[1]);

    const colors = [
        "#c98268",
        "#78947b",
        "#b8a7cf",
        "#d4bd79",
        "#8da9a0",
        "#c58d9d"
    ];

    const textColor = getComputedStyle(document.body)
        .getPropertyValue("--text");

    if (entries.length === 0) {

        ctx.fillStyle = "#89918a";
        ctx.font = "14px Arial";

        ctx.fillText("No data available", 15, 35);

        $("departmentLegend").textContent =
            "Add employees to see department distribution.";

        return;
    }

    const max = Math.max(...entries.map(item => item[1]));

    const barHeight = Math.min(
        28,
        170 / entries.length
    );

    entries.slice(0, 6).forEach(([name, count], index) => {

        const y = 10 + index * barHeight * 1.4;

        const width = (count / max) * 270;

        ctx.fillStyle = colors[index % colors.length];

        ctx.fillRect(
            5,
            y,
            Math.max(width, 5),
            barHeight - 5
        );

        ctx.fillStyle = textColor;
        ctx.font = "12px Arial";

        ctx.fillText(
            `${name} (${count})`,
            Math.min(12 + width, 320),
            y + barHeight - 9
        );
    });

    $("departmentLegend").textContent =
        entries.map(([name, count]) =>
            `${name}: ${count}`
        ).join(" | ");
}

// ======================================
// SALARY CHART
// ======================================

function drawSalaryChart() {

    const canvas = $("salaryChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bins = [0, 0, 0, 0];

    employees.forEach(emp => {

        const salary = Number(emp.salary);

        if (salary < 25000) bins[0]++;
        else if (salary < 50000) bins[1]++;
        else if (salary < 75000) bins[2]++;
        else bins[3]++;
    });

    const labels = [
        "<25k",
        "25k-50k",
        "50k-75k",
        "75k+"
    ];

    const colors = [
        "#c98268",
        "#78947b",
        "#b8a7cf",
        "#d4bd79"
    ];

    const textColor = getComputedStyle(document.body)
        .getPropertyValue("--text");

    if (employees.length === 0) {

        ctx.fillStyle = "#89918a";
        ctx.font = "14px Arial";

        ctx.fillText("No data available", 15, 35);

        return;
    }

    const max = Math.max(1, ...bins);

    const base = 175;
    const barWidth = 65;
    const gap = 38;

    bins.forEach((count, index) => {

        const height = (count / max) * 125;

        const x = 20 + index * (barWidth + gap);

        ctx.fillStyle = colors[index];

        ctx.fillRect(
            x,
            base - height,
            barWidth,
            height
        );

        ctx.fillStyle = textColor;
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            count,
            x + barWidth / 2,
            base - height - 7
        );

        ctx.fillText(
            labels[index],
            x + barWidth / 2,
            base + 17
        );
    });

    ctx.textAlign = "left";
}

// ======================================
// UPDATE BOTH CHARTS
// ======================================

function drawCharts() {

    drawDepartmentChart();

    drawSalaryChart();
}

// ======================================
// INITIALIZE APPLICATION
// ======================================

displayEmployees();
