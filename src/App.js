import React, { useState, useEffect } from "react";
import "./App.css";

const initialAppointments = [
  {
    id: 1,
    name: "John Doe",
    age: "30",
    phone: "9876543210",
    drName: "Dr. Smith",
    gender: "Male",
    visitDate: "2025-09-10",
    visitTime: "09:30 AM",
    visitType: "Consultation"
  },
  {
    id: 2,
    name: "Jane Smith",
    age: "25",
    phone: "9123456780",
    drName: "Dr. Adams",
    gender: "Female",
    visitDate: "2025-09-12",
    visitTime: "11:00 AM",
    visitType: "Follow-up"
  }
];

const defaultForm = {
  name: "",
  age: "",
  phone: "",
  drName: "",
  gender: "",
  visitDate: "",
  visitTime: "",
  visitType: ""
};

function App() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [form, setForm] = useState(defaultForm);
  const [toast, setToast] = useState("");
  const [editId, setEditId] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-menu') && !event.target.closest('#action-btn')) {
        setShowMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const validate = () => {
    for (let key in form) {
      if (!form[key]) return "All fields are required.";
    }
    if (!/^\d{10}$/.test(form.phone)) return "Invalid phone number";
    if (!/^([0]?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(form.visitTime)) return "Invalid time format";
    return null;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [
      id === "dr-name" ? "drName" :
      id === "phone-number" ? "phone" :
      id === "visit-date" ? "visitDate" :
      id === "visit-time" ? "visitTime" :
      id === "visit-type" ? "visitType" :
      id
    ]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return showToast(error);
    if (editId) {
      setAppointments(appointments.map(a => a.id === editId ? { ...form, id: editId } : a));
      showToast("Appointment updated successfully.");
      setEditId(null);
    } else {
      setAppointments([...appointments, { ...form, id: Date.now() }]);
      showToast("Appointment booked successfully.");
    }
    setForm(defaultForm);
  };

  const handleEdit = (id) => {
    const appt = appointments.find(a => a.id === id);
    setForm({ ...appt });
    setEditId(id);
    setShowMenu(null);
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
    showToast("Appointment deleted successfully.");
    setShowMenu(null);
    if (editId === id) {
      setEditId(null);
      setForm(defaultForm);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Doctor Appointment Booking System</h1>
        <p>Book your appointment with ease</p>
      </header>
      <div className="form-container">
        <h2 className="form-title">Book Your Appointment Now</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Patient Name</label>
            <input id="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label>Age</label>
            <input id="age" value={form.age} onChange={handleChange} />
          </div>
          <div>
            <label>Phone Number</label>
            <input id="phone-number" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label>Doctor Name</label>
            <input id="dr-name" value={form.drName} onChange={handleChange} />
          </div>
          <div>
            <label>Gender</label>
            <select id="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Visit Date</label>
            <input id="visit-date" type="date" value={form.visitDate} onChange={handleChange} />
          </div>
          <div>
            <label>Visit Time</label>
            <input id="visit-time" value={form.visitTime} onChange={handleChange} placeholder="HH:MM AM/PM" />
          </div>
          <div>
            <label>Visit Type</label>
            <input id="visit-type" value={form.visitType} onChange={handleChange} />
          </div>
          <button id="book-btn" type="submit">{editId ? "Update Appointment" : "Book Appointment"}</button>
        </form>
        {toast && <div className="toast-message">{toast}</div>}
      </div>
      <div className="list-container">
        <h2>Appointment List</h2>
        <div className="table-wrapper">
          <table className="table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Phone Number</th>
              <th>Doctor Name</th>
              <th>Gender</th>
              <th>Visit Date</th>
              <th>Visit Time</th>
              <th>Visit Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, index) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.age}</td>
                <td>{a.phone}</td>
                <td>{a.drName}</td>
                <td>{a.gender}</td>
                <td>{a.visitDate}</td>
                <td>{a.visitTime}</td>
                <td>{a.visitType}</td>
                <td style={{ position: "relative" }}>
                  <span
                    id="action-btn"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(showMenu === a.id ? null : a.id);
                    }}
                  >
                    &#8942;
                  </span>
                  {showMenu === a.id && (
                    <div 
                      className="action-menu" 
                      style={{ 
                        position: "absolute", 
                        background: "#fff", 
                        border: "1px solid #e1e5e9", 
                        borderRadius: "8px",
                        boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
                        left: "-130px", 
                        top: index >= appointments.length - 1 ? "auto" : "50%",
                        bottom: index >= appointments.length - 1 ? "50%" : "auto",
                        transform: index >= appointments.length - 1 ? "translateY(-10px)" : "translateY(-30%)",
                        zIndex: 1000,
                        minWidth: "120px"
                      }}
                    >
                      <div 
                        id="edit-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(a.id);
                        }} 
                        style={{ padding: "10px 16px", cursor: "pointer", fontWeight: "500", transition: "all 0.3s ease" }}
                      >
                        Edit
                      </div>
                      <div 
                        id="delete-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(a.id);
                        }} 
                        style={{ padding: "10px 16px", cursor: "pointer", color: "#d32f2f", fontWeight: "500", transition: "all 0.3s ease" }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default App;
