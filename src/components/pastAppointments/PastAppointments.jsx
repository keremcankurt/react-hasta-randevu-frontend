import React from 'react'
import styles from './PastAppointments.module.scss'

export default function PastAppointments({setIsLoading, appointments}) {
    const openReport = (index) => {
        const fileUrl =  `${process.env.REACT_APP_API_BASE_URL}/reports/${appointments[index].patientReport}`;
        window.open(fileUrl, '_blank');
      };
    return (
    <>
        <div className={styles['appointments']}>
        {(
            appointments.length > 0 ? (
            appointments.map((appointment, index) => (
                <div key={appointment._id}>
                    {
                        <div  className={styles['appointment']}>
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
                            {
                                (appointment.patientReport !== undefined && appointment.prescription !== undefined) ?
                                <>
                                    <button onClick={() => openReport(index)}>Rapor</button>
                                    {
                                        appointment.prescription &&
                                        <div className={styles["prescription"]}>
                                            <strong className={styles["title"]}>Reçete</strong>
                                            <span className={styles["infos"]}>{appointment.prescription}</span>
                                        </div>
                                    }
                                    
                                </>
                                :
                                (appointment.prescription !== "Gelmedi") ?
                                <>
                                    <span style={{textAlign: 'center'}}>Sonuçlar bekleniyor...</span>
                                </>
                                :
                                <span style={{textAlign: 'center'}}>Randevuya saatinde gelmediniz.</span>
                            }
                        </div>
                    }
                </div>
            ))
            ) : (
            <span style={{ textAlign: 'center' }}>Geçmiş Randevunuz bulunmamaktadır.</span>
            )
        )}
        </div>
    </>
  )
}
