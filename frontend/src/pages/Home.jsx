import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="p-5 mb-4 bg-primary text-white rounded-3">
        <div className="container-fluid py-3">
          <h1 className="display-5 fw-bold">Welcome to MediBook 🏥</h1>
          <p className="col-md-8 fs-4">
            Your trusted platform for booking healthcare appointments online.
            Find the right doctor and book your appointment in minutes.
          </p>
          {!user && (
            <div className="d-flex gap-2">
              <Link to="/register" className="btn btn-light btn-lg">
                Get Started
              </Link>
              <Link to="/doctors" className="btn btn-outline-light btn-lg">
                View Doctors
              </Link>
            </div>
          )}
          {user && (
            <Link to="/appointments" className="btn btn-light btn-lg">
              My Appointments
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="fs-1 mb-3">👨‍⚕️</div>
              <h5 className="card-title">Expert Doctors</h5>
              <p className="card-text text-muted">
                Browse our team of qualified specialists across multiple medical
                fields.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="fs-1 mb-3">📅</div>
              <h5 className="card-title">Easy Booking</h5>
              <p className="card-text text-muted">
                Book appointments online anytime, anywhere in just a few clicks.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="fs-1 mb-3">🔔</div>
              <h5 className="card-title">Instant Notifications</h5>
              <p className="card-text text-muted">
                Get email confirmations automatically when your appointment is
                booked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
