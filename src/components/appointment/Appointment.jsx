import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import styles from './Appointment.module.scss'
import { addReportAndPrescription } from '../../features/doctor/doctorService';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authSlice';

export default function Appointment({patients, setPatients, id, setIsLoading}) {
  const [rapor, setRapor] = useState(null);
  const [recete, setRecete] = useState("");
  
  const dispatch = useDispatch()
  const handleReceteChange = (e) => {
    setRecete(e.target.value);
  };

  const handleReportChange = (e) => {
    const file = e.target.files[0];
    setRapor(file)
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('report', rapor);
        formData.append('prescription', (recete));
        const response = await addReportAndPrescription(formData, id);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setPatients((patients) => {
          return patients.map((patient) => {
            if (patient._id === id) {
              return result.updatedAppointment;
            }
            return patient;
          });
        });
        toast.success(result.message);
      } catch (error) {
        toast.error(error.message);
        if (error.message === "You are not authorized to access this route") {
          dispatch(logoutUser());
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };
  return (
    <form className={styles["form"]} onSubmit={handleFormSubmit}>
        <input type="file" id="pdf"  name="pdf" onChange={handleReportChange} />
        <input
            placeholder='Reçeteyi yazın...'
            type="text"
            value={recete}
            onChange={handleReceteChange}
        />
        <button>Kaydet</button>
    </form>
  )
}
