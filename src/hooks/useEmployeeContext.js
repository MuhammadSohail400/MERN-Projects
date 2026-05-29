import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeContextValue"; // ← path fix

export default function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployeeContext must be used inside EmployeeProvider");
  }
  return context;
}