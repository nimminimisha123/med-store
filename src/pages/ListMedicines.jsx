import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../context/userContext";

import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ViewModal from "./ViewMedicine";

const ListMedicines = () => {
  const [medicineData, setMedicineData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [search, setSearch] = useState("");

  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const token = isLoggedIn;

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    } else {
      const listMedicines = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(
            `https://medicalstore.mashupstack.com/api/medicine`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setIsLoading(false);
          // console.log(res.data);
          setMedicineData(res.data);
        } catch (err) {
          setIsLoading(false);
          console.log(err);
        }
      };

      listMedicines();
    }
  }, [token, navigate]);

  const onSearch = (e) => {
    let text = e.target.value;
    setSearch(text);
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://medicalstore.mashupstack.com/api/medicine/search?keyword=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMedicineData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const timeout = setTimeout(() => {
      fetchMedicines();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const handleDeleteClick = (medicineId) => {
    setSelectedMedicineId(medicineId);
  };

  const deleteMedicineHandler = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `https://medicalstore.mashupstack.com/api/medicine/${selectedMedicineId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(res);

      setMedicineData((prevMedicineData) =>
        prevMedicineData.filter(
          (medicine) => medicine.id !== selectedMedicineId
        )
      );
      setIsLoading(false);

      setSelectedMedicineId(null);
      navigate("/");
      toast.success(`Medicine deleted successfully!`);
    } catch (err) {
      // console.log(err);
      toast.error(`Error while deleting medicine`);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="row my-5">
          <div className="col-md-3 mb-3 mb-md-0">
            <div className="input-group mb-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search medicine..."
                aria-label="Search medicine"
                aria-describedby="search-medicine"
                onChange={onSearch}
              />
            </div>
          </div>
          <div className="col-md-9 d-flex justify-content-center justify-content-md-end align-items-center">
            <Link
              to={"/add-medicine"}
              className="btn btn-primary d-flex align-items-center"
            >
              <MdAdd className="me-2" />
              Add medicine
            </Link>
          </div>
        </div>

        <div className="row mt-5 d-flex justify-content-center">
          <div className="col-12 col-md-10">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Medicine name</th>
                    <th scope="col">Company</th>
                    <th scope="col">Expiry date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>

                {isLoading && (
                  <tbody>
                    <tr>
                      <td colSpan={5}>
                        <Loader />
                      </td>
                    </tr>
                  </tbody>
                )}

                <tbody>
                  {!isLoading && medicineData.length === 0 && (
                    <tr className="align-middle">
                      <td colSpan={5}>
                        <p className="text-center mb-0">No data found.</p>
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    medicineData?.map((medicine, index) => (
                      <tr key={index} className="align-middle">
                        <th scope="row">{index + 1}</th>
                        <td>{medicine.name}</td>
                        <td>{medicine.company}</td>
                        <td>{medicine.expiry_date}</td>
                        <td className="d-flex flex-column flex-md-row gap-3">
                          <Link
                            to={`/view-medicine/${medicine.id}`}
                            className="btn btn-light"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit-medicine/${medicine.id}`}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteClick(medicine.id)}
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal onConfirm={deleteMedicineHandler} />
    </>
  );
};

export default ListMedicines;
