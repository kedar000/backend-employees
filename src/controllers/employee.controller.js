import { readDB } from "../config/db.js";

export async function getEmployees(req, res) {
    const db = await readDB();

    let employees = [...db.employees];

    const {
        q,
        page = 1,
        limit = 30,
        sort,
        order = "asc",
    } = req.query;

    // ------------------------
    // Search
    // ------------------------

    if (q) {
        const search = q.toLowerCase();

        employees = employees.filter((employee) => {
            return (
                employee.firstName.toLowerCase().includes(search) ||
                employee.lastName.toLowerCase().includes(search) ||
                employee.email.toLowerCase().includes(search) ||
                employee.phone.toLowerCase().includes(search) ||
                employee.company.department.toLowerCase().includes(search) ||
                employee.company.title.toLowerCase().includes(search)
            );
        });
    }

    // ------------------------
    // Sorting
    // ------------------------

    if (sort) {
        employees.sort((a, b) => {
            let valueA = a[sort];
            let valueB = b[sort];

            if (typeof valueA === "string") {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (valueA < valueB) return order === "asc" ? -1 : 1;
            if (valueA > valueB) return order === "asc" ? 1 : -1;

            return 0;
        });
    }

    // ------------------------
    // Pagination
    // ------------------------

    const total = employees.length;

    const start = (Number(page) - 1) * Number(limit);

    const end = start + Number(limit);

    employees = employees.slice(start, end);

    res.json({
        data: employees,

        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

export async function getEmployeeById(req, res) {
    const db = await readDB();

    const employee = db.employees.find(
        (employee) => employee.id === Number(req.params.id)
    );

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found",
        });
    }

    res.json(employee);
}