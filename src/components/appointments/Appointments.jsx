import React from 'react';
import styles from './Appointments.module.scss';
import { delAppointment } from '../../features/appointment/appointmentService';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

export default function Appointments({setIsLoading, appointments, setAppointments}) {
    const dispatch = useDispatch()
    const deleteAppointment = (index) => {
        const fetchData = async () => {
            try {
              setIsLoading(true);
              const response = await delAppointment(appointments[index]._id);
              const result = await response.json();
              if (!response.ok) {
                throw new Error(result.message);
              }
              toast.success(result.message);
              const updatedAppointments = [...appointments];
              updatedAppointments.splice(index, 1);
              setAppointments(updatedAppointments);
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
    }
  return (
    <>
        <div className={styles['appointments']}>
        {(
            appointments.length > 0 ? (
            appointments.map((appointment, index) => (
                <div key={appointment._id} className={styles['appointment']}>
                <div className={styles['top']}>
                    <span style={{ paddingRight: '4px' }}>
                    <strong>Dr. </strong>
                    {appointment?.doctorId?.userId?.name} {appointment?.doctorId?.userId?.surname}
                    </span>
                    <span>{appointment?.doctorId.polyclinic}</span>
                </div>
                <span className={styles['date']}>
                    {new Date(appointment.date).toLocaleString()}
                </span>
                <button onClick={() => deleteAppointment(index)}>İptal Et</button>
                </div>
            ))
            ) : (
            <span style={{ textAlign: 'center' }}>Randevunuz bulunmamaktadır.</span>
            )
        )}
        </div>
    </>
  );
}
