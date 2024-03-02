import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/api/users/register`, formData)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <div>
      <form
        className="flex flex-col gap-5 max-w-100 mx-auto border px-5 py-10 rounded-xl mt-10"
        onSubmit={handleSubmit}
      >
        <input
          className="border-b p-2 bg-white"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
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
        <input
          className="border-b p-2 bg-white"
          type="password"
          name="passwordRepeat"
          value={formData.passwordRepeat}
          onChange={handleChange}
          placeholder="Repeat Password"
        />
        <button className="border p-2 bg-lime-600 text-lime-50" type="submit">
          Register
        </button>
        <div className="text-center">
          <span className="text-center">Already have an account? </span>

          <NavLink to="/auth/login" className="underline mx-auto">
            Login
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default Register;
