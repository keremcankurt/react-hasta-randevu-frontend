import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss'
import { logout, logoutUser } from '../../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { getPatients } from '../../../features/doctor/doctorService';
import PatientsAppointments from '../../../components/patientsAppointments/PatientsAppointments';

export default function DoctorHome() {
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useSelector(
        (state) => state.auth
      );
      const navigate = useNavigate()
      useEffect(() => {
        if(user) {
            if(user.role === "user"){
                navigate("/vatandas")
            }
        }
        else{
            navigate("/doctor/login")
        }
      }, [user, navigate])

      
      const dispatch = useDispatch();
      const [patients, setPatients] = useState([]);
      useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const response = await getPatients();
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.message);
            }
            setPatients(result);
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

      const logoutHandle = () => {
        dispatch(logout())
      }
      
  return (
    <div className={styles["container"]}>
        {
            user &&
            <>
            {
                isLoading ? (
                <div className={styles["loading-overlay"]}>
                    <div className={styles["loading-spinner"]}></div>
                </div>
                )
                :
                <div id={styles['home']}>
                    <h2 style={{textAlign: 'center'}}>Hasta Kayıtları</h2>
                    <PatientsAppointments setPatients={setPatients} patients={patients} setIsLoading={setIsLoading}/>
                    <div className={styles["logout"]}>
                      <strong className={["name"]}>{user?.fullName}</strong>
                      <button onClick={() => logoutHandle()}>Çıkış Yap</button>
                    </div>
                </div>
            }
            </>
        }
    </div>
  )
}
