import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const ViewMedicine = () => {
  const [medicineData, setMedicineData] = useState({
    name: "",
    company: "",
    expiry_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { medicineId } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const token = isLoggedIn;

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    } else {
      const getMedicineData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `https://medicalstore.mashupstack.com/api/medicine/${medicineId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsLoading(false);
          setMedicineData(response.data);
        } catch (err) {
          setIsLoading(false);
          console.log(err);
        }
      };

      getMedicineData();
    }
  }, [medicineId, token, navigate]);

  return (
    <>
      <Navbar />
      <div className="container addMedicine d-flex flex-column align-itemscenter justify-content-center">
        {isLoading && <Loader />}

        {!isLoading && (
          <>
            <div className="row mt-5 d-flex justify-content-center">
              <div className="col-md-5">
                <form className="shadow-lg p-4 text-center rounded">
                  <h3 className="mb-4">Medicine details</h3>

                  <div className=" row my-3">
                    <div className="col-6 text-end">Medicine Name:</div>
                    <div className="col-6 text-start">{medicineData.name}</div>
                  </div>

                  <div className=" row my-3">
                    <div className="col-6 text-end">Company:</div>
                    <div className="col-6 text-start">
                      {medicineData.company}
                    </div>
                  </div>

                  <div className=" row my-3">
                    <div className="col-6 text-end">Expiry date:</div>
                    <div className="col-6 text-start">
                      {medicineData.expiry_date}
                    </div>
                  </div>

                  <div>
                    <Link to={"/"} className="btn btn-success">
                      Back
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewMedicine;
