import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/userContext";

const Logout = () => {
  const { setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth/login");
    setIsLoggedIn(null);
  }, [navigate, setIsLoggedIn]);

  return null;
};

export default Logout;
