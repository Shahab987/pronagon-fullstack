import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/auth/login`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success(res.data.message);
          sessionStorage.setItem("token", res.data.token);
        } else {
          // Login failed
          // Show error message
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form
        className="flex flex-col gap-5 max-w-100 mx-auto border px-5 py-10 rounded-xl mt-10"
        onSubmit={handleSubmit}
      >
        <input
          className="border-b p-2 bg-white"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="border-b p-2 bg-white"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button className="border p-2 bg-lime-600 text-lime-50" type="submit">
          Login
        </button>
        <div className="text-center">
          <span className="">Don't have an account? </span>

          <NavLink to="/auth/register" className="underline mx-auto">
            Register
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default Login;
