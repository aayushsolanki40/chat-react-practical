import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, setAuthenticated } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated){
        navigate("/dashboard");
    }
  }, [isAuthenticated]);
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/login", { username, password });
      setAuthenticated(true);
      checkUserInfo();
      navigate("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message ?? "Signup failed");
    }
  };

  async function checkUserInfo(): Promise<boolean> {
    try {
      const user = await axiosInstance.get("/users/me");
      localStorage.setItem("user", JSON.stringify(user?.data.data));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
        <span>
          You don't have any account? <Link to="/signup">Signup here</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
