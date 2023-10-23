import React from 'react';
import styles from './AppointmentModal.module.scss';
import { createAppointment } from '../../features/appointment/appointmentService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const AppointmentModal = ({ isOpen, setIsLoading, doctorInfo, onClose, times, date }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!isOpen) {
    return null;
  }

  
  const isTimeDisabled = (time) => {
    const now = new Date(); // Şu anki tarih ve saat
    const selectedDateTime = new Date(date);
    const [hour, minute] = time.split(':');
    selectedDateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
  
    // Eğer seçilen tarih bugünkü tarih ve seçilen saat şu anki saatten önceyse true döndür
    return selectedDateTime < now || times.includes(time);;
  };
  

  
  const handleTimeClick = (formattedTime) => {
    const [hour, minute] = formattedTime.split(':');
  const selectedDateTime = new Date(date);
  selectedDateTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
    const data = {
      date: selectedDateTime,
      doctorId: doctorInfo?._id
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await createAppointment(JSON.stringify(data));
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        toast.success(result.message);
        navigate("/vatandas")

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
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <button className={styles.closeModalButton} onClick={onClose}>
          X
        </button>
        <h2>Dr. {doctorInfo.userId.name} {doctorInfo.userId.surname} - {doctorInfo.polyclinic}</h2>
        <span style={{ fontWeight: 'bold', fontSize: '12px', color: 'gray' }}>
          {date} tarihi için randevu saati seçiniz.
        </span>
        <div className={styles.timeSlots}>
          {Array.from({ length: 36 }, (_, index) => {
            const hour = Math.floor(index / 6) + 9;
            const minute = (index % 6) * 10;
            const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
            const formattedMinute = minute === 0 ? '00' : `${minute}`;
            const formattedTime = `${formattedHour}:${formattedMinute}`;
            const isDisabled = isTimeDisabled(formattedTime);

            return (
              <button
                key={index}
                className={`${styles.timeSlot} ${isDisabled ? styles.disabledTimeSlot : ''}`}
                disabled={isDisabled}
                onClick={() => handleTimeClick(formattedTime)}
              >
                {formattedTime}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
