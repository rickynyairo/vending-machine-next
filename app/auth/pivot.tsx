"use client";
import React, { useState } from "react";

export interface PivotElementProps {
  SignupForm: React.FunctionComponent;
  LoginForm: React.FunctionComponent;
}

export const PivotElement = (props: PivotElementProps) => {
  const { SignupForm, LoginForm } = props;
  const [activeTab, setActiveTab] = useState("signup");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <div className="flex">
        <div
          className={`w-1/2 p-3 text-center cursor-pointer ${
            activeTab === "signup"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabChange("signup")}
        >
          Signup
        </div>
        <div
          className={`w-1/2 p-3 text-center cursor-pointer ${
            activeTab === "login"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => handleTabChange("login")}
        >
          Login
        </div>
      </div>
      {activeTab === "signup" ? (
        <div className="p-4 border-t mt-2">
          <SignupForm />
        </div>
      ) : (
        <div className="p-4 border-t mt-2">
          <LoginForm />
        </div>
      )}
    </div>
  );
};
