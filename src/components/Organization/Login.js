import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("Org");
  const [user, setUser] = useState("");

  async function submit(e) {
    e.preventDefault();

    const endpoints = {
      Org: `${process.env.REACT_APP_API_BASE_URL}/org-login`,
      Student: `${process.env.REACT_APP_API_BASE_URL}/student-login`,
      Emp: `${process.env.REACT_APP_API_BASE_URL}/emp-login`,
    };

    try {
      const response = await axios.post(endpoints[loginType], {
        email,
        password,
      });

      if (response.data.auth) {
        localStorage.setItem("user", JSON.stringify(response.data.user._id));
        if (loginType === "Student") {
          localStorage.setItem("stopId", JSON.stringify(response.data.user.stop));
        }
        localStorage.setItem("token", JSON.stringify(response.data.auth));
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUser(currentUser);

        toast.success("Login successful!");

        navigate(`/${loginType.toLowerCase()}/home`);
      } else if (response.data === "incorrect") {
        toast.error("Password does not match");
      } else if (response.data === "notexist") {
        toast.error("User does not exist");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
      console.error("Axios Error:", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg w-full max-w-md p-6 space-y-6">
        <form onSubmit={submit} className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 text-center">
            Mark Presence Pulse
          </h3>
          <div>
            <label
              htmlFor="loginType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Login as
            </label>
            <select
              id="loginType"
              onChange={(e) => setLoginType(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="Org">Organisation</option>
              <option value="Emp">Employee</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Log in
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;