import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `https://medicalstore.mashupstack.com/api/register`,
        formData
      );

      // console.log(res);

      if (res.status === 200) {
        setIsLoading(false);
        navigate("/auth/login");
        toast.success("User registered successfully!");
      }
    } catch (err) {
      // console.log(err.response.data.errors);
      setIsLoading(false);
      if (err.response && err.response.data && err.response.data.errors) {
        const { errors } = err.response.data;

        // If errors is an object
        setErrors({
          name: errors.name || "",
          email: errors.email || "",
          password: errors.password || "",
          password_confirmation: errors.password_confirmation || "",
        });
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100 d-flex align-items-center justify-content-center">
        <div className="col-12 col-sm-8 col-md-4 ">
          <form
            onSubmit={registerHandler}
            className="bg-white p-3 rounded shadow-lg"
          >
            <h3 className="mb-3 fw-semibold text-start">Register</h3>

            <div className="mb-3">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-danger">{errors.name}</p>}
            </div>

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

            <div className="mb-3">
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm password"
                className="form-control"
                value={formData.password_confirmation}
                onChange={handleInputChange}
              />
              {errors.password_confirmation && (
                <p className="text-danger">{errors.password_confirmation}</p>
              )}
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                {isLoading ? <HashLoader size={20} color="#eee" /> : `Register`}
              </button>
            </div>
          </form>
          <p className="text-center">
            Already have an account? <Link to={"/auth/login"}>Login.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
