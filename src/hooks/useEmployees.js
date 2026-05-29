import { useState, useMemo } from "react";
import useEmployeeContext from "./useEmployeeContext"; // ← path change

export default function useEmployees() {
  // ── Context se real data lo — local array nahi
  const { employees, deleteEmployee, toggleStatus } = useEmployeeContext();

  const [search, setSearch]       = useState("");
  const [deptFilter, setDept]     = useState("All Departments");
  const [statusFilter, setStatus] = useState("All Status");
  const [currentPage, setPage]    = useState(1);

  const PER_PAGE = 5;

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());
      const matchDept =
        deptFilter === "All Departments" || emp.department === deptFilter;
      const matchStatus =
        statusFilter === "All Status" ||
        emp.status === statusFilter.toLowerCase();
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  function handleSearch(val)  { setSearch(val);  setPage(1); }
  function handleDept(val)    { setDept(val);     setPage(1); }
  function handleStatus(val)  { setStatus(val);   setPage(1); }

  return {
    employees:      paginated,
    totalEmployees: filtered.length,
    search,         onSearch:     handleSearch,
    deptFilter,     onDept:       handleDept,
    statusFilter,   onStatus:     handleStatus,
    currentPage,    totalPages,   onPageChange: setPage,
    deleteEmployee,
    toggleStatus,
  };
}