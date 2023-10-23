import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RandevuAl.module.scss';
import { getDoctors } from '../../../features/doctor/doctorService';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '../../../features/auth/authSlice';
import AppointmentModal from '../../../modal/appointmentModal/AppointmentModal';
import { getDoctorAppointments } from '../../../features/appointment/appointmentService';

export default function RandevuAl() {
  const [selectedPolyclinic, setSelectedPolyclinic] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState(null);


  const dispatch = useDispatch();

  const {user} = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate()
  useEffect(() => {
    if(user) {
        if(user.role === "doctor"){
            navigate("/doctor")
        }
    }
    else{
        navigate("/vatandas/login")
    }
  }, [user, navigate])

  const handlePolyclinicChange = (event) => {
    const selectedPolyclinic = event.target.value;
    setSelectedPolyclinic(selectedPolyclinic);
    setSelectedDoctor('');
  }

  const handleDoctorChange = (event) => {
    const selectedDoctor = event.target.value;
    setSelectedDate("")
    setSelectedDoctor(selectedDoctor);
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  }
  const [times, setTimes] = useState([])
  const showAppointments = () => {
    const today = new Date().toISOString().split('T')[0]; // Günümüzün tarihi (örneğin, "2023-10-19")

    if (selectedDate < today) {
      toast.error('Geçerli bir tarih seçmelisiniz.');
      return;
    } else {
      setSelectedDate(selectedDate);
    }
    setSelectedDoctorInfo(doctors.find((doctor) => doctor._id === selectedDoctor))
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log(selectedDate)
        const response = await getDoctorAppointments({id: doctors.find((doctor) => doctor._id === selectedDoctor)._id, data: {date: selectedDate}});
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setTimes(result);
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
    setIsModalOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getDoctors();
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setDoctors(result);
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
  }, [dispatch]);

  const polyclinics = Array.from(new Set(doctors.map((doctor) => doctor.polyclinic)));
  const doctorsByPolyclinic = {};
  doctors.forEach((doctor) => {
    if (!doctorsByPolyclinic[doctor.polyclinic]) {
      doctorsByPolyclinic[doctor.polyclinic] = [];
    }
    doctorsByPolyclinic[doctor.polyclinic].push(doctor);
  });

  return (
    isLoading ? (
      <div className={styles["loading-overlay"]}>
          <div className={styles["loading-spinner"]}></div>
      </div>
      )
      :
    <div className={styles.container}>
      <div className={styles.randevu}>
        <Link className={styles["backtohome"]} to="/vatandas">Ana Sayfaya Dön</Link>
        <div className={styles.dropdown}>
          <label htmlFor="polyclinic">Poliklinik:</label>
          <select id="polyclinic" value={selectedPolyclinic} onChange={handlePolyclinicChange}>
            <option value="">Seçiniz</option>
            {polyclinics.map((polyclinic) => (
              <option key={polyclinic} value={polyclinic}>
                {polyclinic}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.dropdown}>
          <label htmlFor="doctor">Doktor:</label>
          <select disabled={selectedPolyclinic === ""} id="doctor" value={selectedDoctor} onChange={handleDoctorChange}>
            <option value="">Seçiniz</option>
            {doctorsByPolyclinic[selectedPolyclinic] && doctorsByPolyclinic[selectedPolyclinic].map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.userId.name} {doctor.userId.surname}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.datePicker}>
          <label htmlFor="date">Tarih:</label>
          <input disabled={selectedDoctor === ""} type="date" id="date" value={selectedDate} onChange={handleDateChange} />
        </div>
        <button disabled={selectedDate === ""} className={styles.showAppointmentsButton} onClick={showAppointments}>
          Randevuları Göster
        </button>
      </div>
      <AppointmentModal
        setIsLoading={setIsLoading}
        date={selectedDate}
        times={times}
        isOpen={isModalOpen}
        doctorInfo={selectedDoctorInfo}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
