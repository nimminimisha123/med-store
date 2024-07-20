import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";

const EditMedicine = () => {
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

  const handleInputChange = (e) => {
    setMedicineData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const editMedicineHandler = async (e) => {
    e.preventDefault();
    // console.log(medicineData);
    try {
      setIsLoading(true);
      const res = await axios.post(
        `https://medicalstore.mashupstack.com/api/medicine/${medicineId}`,
        medicineData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log(res.data);
      if (res.status === 200) {
        setIsLoading(false);
        navigate("/");
        toast.success(`Medicine updated successfully!`);
      }
    } catch (err) {
      setIsLoading(false);
      // console.log(err.message);
      toast.error(`Error while updating medicine`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container addMedicine d-flex flex-column align-itemscenter justify-content-center">
        {isLoading && <Loader />}

        {!isLoading && (
          <>
            <div className="row mt-4 ">
              <div className="col d-flex justify-content-start align-items-center">
                <Link
                  to={"/"}
                  className="btn btn-dark d-flex align-items-center"
                >
                  <MdOutlineKeyboardDoubleArrowLeft className="me-2" /> Back
                </Link>
              </div>
            </div>

            <div className="row mt-5 d-flex justify-content-center">
              <div className="col-md-5">
                <form
                  onSubmit={editMedicineHandler}
                  className="shadow-lg p-4 text-center rounded"
                >
                  <h3 className="mb-4">Edit Medicine</h3>

                  <div className="my-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Medicine name"
                      className="form-control"
                      value={medicineData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="my-3">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      className="form-control"
                      value={medicineData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="my-3">
                    <input
                      type="date"
                      name="expiry_date"
                      className="form-control"
                      value={medicineData.expiry_date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-success">
                      Update medicine
                    </button>
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

export default EditMedicine;
