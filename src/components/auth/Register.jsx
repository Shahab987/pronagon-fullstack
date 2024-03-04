import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoaderButton from "../ui/LoaderButton";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authActions";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [seePassword, setSeePassword] = useState(false);
  const navigate = useNavigate();
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

    if (!formData.email || !formData.password) {
      toast.error("All fields are required...");
    } else {
      dispatch(registerUser(formData));
    }
  };

  useEffectAfterMount(() => {
    if (success && user.id) {
      navigate("/words");
    }
  }, [success]);

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
          text="Register"
        />
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
