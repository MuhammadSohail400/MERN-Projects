import { useState, useMemo } from "react";
import { EMPLOYEES } from "../data/employees";

// ── Custom hook — filter + search + pagination logic
// Employees.jsx mein sirf yeh hook call karo
// sari logic yahan hogi — component clean rahega
export default function useEmployees() {
  const [search, setSearch]     = useState("");
  const [deptFilter, setDept]   = useState("All Departments");
  const [statusFilter, setStatus] = useState("All Status");
  const [currentPage, setPage]  = useState(1);

  const PER_PAGE = 3; // har page pe kitne employees

  // ── Derived state — filter + search apply karo ──
  const filtered = useMemo(() => {
    return EMPLOYEES.filter((emp) => {
      // Search match
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

      // Department match
      const matchDept =
        deptFilter === "All Departments" ||
        emp.department === deptFilter;

      // Status match
      const matchStatus =
        statusFilter === "All Status" ||
        emp.status === statusFilter.toLowerCase();

      return matchSearch && matchDept && matchStatus;
    });
  }, [search, deptFilter, statusFilter]);
  // ↑ sirf tab recalculate hoga jab yeh 3 change hon

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  // Filter change hone pe page 1 pe wapis jao
  function handleSearch(val) {
    setSearch(val);
    setPage(1);
  }
  function handleDept(val) {
    setDept(val);
    setPage(1);
  }
  function handleStatus(val) {
    setStatus(val);
    setPage(1);
  }

  return {
    // Data
    employees: paginated,
    totalEmployees: filtered.length,
    // Filters
    search,        onSearch: handleSearch,
    deptFilter,    onDept: handleDept,
    statusFilter,  onStatus: handleStatus,
    // Pagination
    currentPage,   totalPages,   onPageChange: setPage,
  };
}