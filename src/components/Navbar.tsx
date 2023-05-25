import React, { useState } from "react";
import App from "../App";
import {
  CodeBracketIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

export default function Navbar(props: {
  theme: string;
  setTheme: any;
  data: any;
}) {
  const toggleTheme = () => {
    props.theme === "dark" ? props.setTheme("light") : props.setTheme("dark");
  };

  const handleDownload = (format: string) => {
    const data = props.data;
    if (format === "csv") {
      const csvData = convertToCSV(data);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === "json") {
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  function convertToCSV(data: any) {
    const headers = Object.keys(data[0]);
    const rows = data.map((row: any) =>
      headers.map((header: any) => row[header])
    );
    return [headers.join(","), ...rows.map((row: any) => row.join(","))].join(
      "\n"
    );
  }

  return (
    <nav className="nav w-full px-3 flex items-center justify-between text-gray-300 py-4 sticky top-0 z-50">
      <div className="title flex gap-2 items-center font-black text-lg">
        <div className="logo w-7 h-7"></div>
        <div>Senti-Surfer</div>
      </div>
      <div className="extras flex gap-3 items-center">
        <label className="switch">
          <input type="checkbox" onClick={toggleTheme}></input>
          <span className="slider"></span>
        </label>
        <DocumentArrowDownIcon
          className="h-5 w-5"
          onClick={() => handleDownload("csv")}
        />
        <CodeBracketIcon
          className="w-7 h-7 hover:cursor-pointer"
          onClick={() => handleDownload("json")}
        />
      </div>
    </nav>
  );
}
