import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../../features/auth/authSlice';

export default function VatandasRegister() {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isSuccess} = useSelector(
        (state) => state.auth
    );
    useEffect(() => {
        if (user) {
          navigate("/vatandas")
        }
        if(isSuccess){
            dispatch(reset())
            navigate("/vatandas/login")
        }
    }, [user,navigate,isSuccess,dispatch]);

    const { name, surname, email, password, confirmPassword } = formData;
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
      dispatch(register(formData));
    }
  return (
    <div className={styles["container"]}>
        <div className={styles['register-container']}>
            <div className={styles['register']}>
                <form onSubmit={handleSubmit} className={styles['registerForm']}>
                    <h1 className={styles['register-logo']}>HASTANE RANDEVU MERKEZİ</h1>
                    <div className={styles["full-name"]}>
                        <input name='name' value={name} placeholder='İsim' required onChange={handleChange}/>
                        <input name='surname' value={surname} placeholder='Soyad' onChange={handleChange}/>

                    </div>
                    <input name='email' value={email} placeholder='Email' type='email' required onChange={handleChange}/>
                    <input name='password' value={password} placeholder='Şifre' type='password' required onChange={handleChange}/>
                    <input name='confirmPassword' value={confirmPassword} placeholder='Şifreyi Onayla' type='password' required onChange={handleChange}/>
                    {isLoading ? (
                    <button disabled className={styles['loading']}>Kayıt işlemi tamamlanıyor...</button>
                    ):(
                    <button type='submit'>Kayıt Ol</button>
                    )}
                    <Link to='/vatandas/login' className={styles['backToLogin']}>Giriş Yap</Link>
                </form>
                
                
            </div>
        </div>
    </div>
  )
}
