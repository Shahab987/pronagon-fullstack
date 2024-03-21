import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authActions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import LoaderButton from "../ui/LoaderButton";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [seePassword, setSeePassword] = useState(false);

  const dispatch = useDispatch();

  const { loading, success, error, userToken, user } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSeePassword(false);

    if (!formData.email) {
      toast.error("Email required...");
      return;
    }
    if (!formData.password) {
      toast.error("Password required...");
      return;
    }
    dispatch(loginUser(formData));
  };

  useEffectAfterMount(() => {
    if (success && user.id) {
      navigate("/words");
    }
  }, [success]);

  return (
    <div className="max-w-100 mx-auto border px-5 pb-10 pt-5 rounded-xl mt-10">
      <h1 className="mb-5 ms-2 text-xl text-gray-400">Login</h1>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          className="border-b p-2 bg-white"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <div className="relative w-full ">
          <input
            className="border-b p-2 bg-white w-full"
            type={seePassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <div onClick={() => setSeePassword((p) => !p)}>
            {seePassword ? (
              <FaEye className="absolute text-xl  text-lime-600  top-3 right-3" />
            ) : (
              <FaEyeSlash className="absolute text-xl text-gray-500 top-3 right-3" />
            )}
          </div>
        </div>

        <LoaderButton
          loading={loading}
          style="border p-2 bg-lime-600 text-lime-50"
          type="submit"
          text="Login"
        />
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
