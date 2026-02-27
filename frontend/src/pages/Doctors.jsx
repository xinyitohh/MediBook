import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../services/doctorService";
import { useAuth } from "../context/AuthContext";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors()
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center mt-5">Loading doctors...</div>;

  return (
    <div>
      <h2 className="mb-4">👨‍⚕️ Our Doctors</h2>
      <div className="row g-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                    style={{ width: 80, height: 80, fontSize: 32 }}
                  >
                    👨‍⚕️
                  </div>
                </div>
                <h5 className="card-title text-center">{doctor.fullName}</h5>
                <p className="text-center text-primary fw-semibold">
                  {doctor.specialty}
                </p>
                <p className="card-text text-muted small">
                  {doctor.description}
                </p>
                <p className="small">📞 {doctor.phone}</p>
                <p className="small">✉️ {doctor.email}</p>
              </div>
              <div className="card-footer bg-transparent">
                {user ? (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate("/appointments")}
                  >
                    Book Appointment
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate("/login")}
                  >
                    Login to Book
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
