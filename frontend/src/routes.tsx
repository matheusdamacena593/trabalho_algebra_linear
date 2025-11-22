import React from "react";
import { Routes, Route } from "react-router-dom";
import { CalcularDeterminante } from "./pages/CalcularDeterminante/CalcularDeterminante";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CalcularDeterminante />} />
    </Routes>
  );
};