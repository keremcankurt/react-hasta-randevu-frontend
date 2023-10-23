import React, { useEffect, useState } from 'react'
import styles from '../../vatandas/login/Login.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../features/auth/authSlice';


export default function DoctorLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading} = useSelector(
      (state) => state.auth
    );
    useEffect(() => {
        if (user) {
            user.role === "user" ?
            navigate("/vatandas")
            :
            navigate("/doctor")
          }
      }, [user,navigate]);

      const {email, password} = formData;
    const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
      e.preventDefault();
      const userData = {
        email,
        password,
      };
      dispatch(login(userData));
    };
  return (
    <div className={styles["container"]}>
        <div id={styles['login-container']}>
        <div className={styles['login']}>
            <form onSubmit={onSubmit} className={styles['loginForm']}>
            <h1 className={styles['login-logo']}>HASTANE RANDEVU MERKEZİ</h1>
                <input name='email' placeholder='Email' type='email' value={email} onChange={onChange} required/>
                <input name='password' placeholder='Şifre' type='password' value={password} onChange={onChange} required/>
                {isLoading ? (
                <button disabled className={styles['loading']}>Giriş Yapılıyor...</button>
                ):(
                <button type='submit'>Giriş Yap</button>
                )}
                
                <Link to='/doctor/register' className={styles['goToRegister']}>Kayıt Ol</Link>
            </form>
        </div>
        </div>
    </div>
  )
}
