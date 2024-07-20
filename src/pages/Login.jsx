import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const { setIsLoggedIn } = useContext(UserContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://medicalstore.mashupstack.com/api/login`,
        formData
      );

      setIsLoading(false);
      const { token } = response.data;
      setIsLoggedIn(token);
      navigate("/");
      toast.success("Logged in");
      // console.log(token);
    } catch (err) {
      setIsLoading(false);
      if (err.response && err.response.data && err.response.data.errors) {
        // console.log(err.response.data.errors);
        const { errors } = err.response.data;
        if (typeof errors === "string") {
          // If errors is  a general error message
          setErrors({ ...errors, general: errors });
        } else {
          // If errors is an object
          setErrors({
            email: errors.email || "",
            password: errors.password || "",
            general: "",
          });
        }
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100 d-flex align-items-center justify-content-center">
        <div className="col-12 col-sm-8 col-md-4 ">
          <form
            onSubmit={loginHandler}
            className="bg-white p-3 rounded shadow-lg"
          >
            <h3 className="mb-3 fw-semibold text-start">Login</h3>

            {errors.general && (
              <p className="text-center text-danger">{errors.general}</p>
            )}

            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-danger">{errors.password}</p>
              )}
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                {isLoading ? <HashLoader size={20} color="#eee" /> : `Login`}
              </button>
            </div>
          </form>
          <p className="text-center">
            Don't have an account?{" "}
            <Link to={"/auth/register"}>Create one.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
