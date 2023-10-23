import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss'
import Appointments from '../../../components/appointments/Appointments';
import { getAppointments, getPastAppointments } from '../../../features/appointment/appointmentService';
import { toast } from 'react-toastify';
import { logout, logoutUser } from '../../../features/auth/authSlice';
import PastAppointments from '../../../components/pastAppointments/PastAppointments';

export default function VatandasHome() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
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

      
      const dispatch = useDispatch();
      const [appointments, setAppointments] = useState([]);
      const [pastAppointments, setPastAppointments] = useState([]);
      
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const response = await getAppointments();
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.message);
            }
            setAppointments(result);
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

      useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const response = await getPastAppointments();
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.message);
            }
            setPastAppointments(result);
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
                    <div className={styles['create-appointment']}>
                        <button onClick={() => navigate("/vatandas/randevual")}>Randevu Al</button>
                    </div>
                    <div className={styles['buttons']}>
                        <button className={styles[selectedTab === 0 ? 'selected' : ""]} onClick={() => setSelectedTab(0)}>Randevularım</button>
                        <button className={styles[selectedTab === 1 ? 'selected' : ""]} onClick={() => setSelectedTab(1)}>Geçmiş Randevularım</button>
                    </div>
                    {
                        selectedTab === 0 ?
                        <Appointments isLoading={isLoading} appointments={appointments} setIsLoading={setIsLoading} setAppointments={setAppointments}/>
                        :
                        <PastAppointments isLoading={isLoading} appointments={pastAppointments} setIsLoading={setIsLoading}/>
                    }
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
