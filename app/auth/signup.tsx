"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const urlPath = () => {
  // if we're in dev or testing, path is local
  // if we're in production, path is deployed url
  if (process.env.NODE_ENV === "production") {
    return "https://vending-machine-next.vercel.app";
  } else {
    return "http://localhost:3000";
  }
};

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "buyer",
  });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("formData", formData);

    // Submit the form data to the /signup endpoint as a POST request
    try {
      const response = await fetch(`${urlPath()}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        // Handle a successful signup response
        // redirect to home page

        console.log("Signup successful");
        router.push("/");
      } else {
        // Handle errors or unsuccessful signup response
        alert("Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Username:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.username}
            onChange={(e) =>
              setFormData((data) => ({ ...data, username: e.target.value }))
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password:
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={(e) =>
              setFormData((data) => ({ ...data, password: e.target.value }))
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Role:
          </label>
          <select
            className="w-full p-2 border rounded"
            value={formData.role}
            onChange={(e) =>
              setFormData((data) => ({ ...data, role: e.target.value }))
            }
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Signup
        </button>
      </form>
    </div>
  );
};
