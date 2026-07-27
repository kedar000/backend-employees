import { readDB } from "../config/db.js";

export async function getEmployees(req, res) {
  const db = await readDB();

  let employees = [...db.employees];

  const { q, sort, order = "asc" } = req.query;

  console.log(`search request with params : q =${q}.  sort =${sort}. order=${order}` )
  // Search
  if (q) {
    const search = q.toLowerCase();
    console.log("search request q : "+ q)

    employees = employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(search) ||
        employee.lastName.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search) ||
        employee.phone.toLowerCase().includes(search) ||
        employee.company.department.toLowerCase().includes(search) ||
        employee.company.title.toLowerCase().includes(search),
    );
  }

  // Sorting
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

  res.json(employees);
}

export async function getEmployeeById(req, res) {
  const db = await readDB();

  const employee = db.employees.find(
    (employee) => employee.id === Number(req.params.id),
  );

  if (!employee) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }

  res.json(employee);
}
