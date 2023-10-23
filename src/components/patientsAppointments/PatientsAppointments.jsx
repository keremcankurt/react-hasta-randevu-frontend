import React from 'react';
import styles from './PatientsAppointments.module.scss';
import Appointment from '../appointment/Appointment';

export default function PatientsAppointments({patients, setPatients, setIsLoading}) {
  const openReport = (index) => {
    const fileUrl =  `${process.env.REACT_APP_API_BASE_URL}/reports/${patients[index].patientReport}`;
    window.open(fileUrl, '_blank');
  };
  return (
    <>
        <div className={styles['appointments']}>
        {(
          patients?.length > 0 ? (
            patients.map((patient, index) => (
                <div key={patient._id} className={styles['appointment']}>
                <div className={styles['top']}>
                    <span style={{ paddingRight: '4px' }}>
                    <strong>Hasta </strong>
                    {patient?.patientId?.name} {patient?.patientId?.surname}
                    </span>
                  <span className={styles['date']}>
                      {new Date(patient.date).toLocaleString()}
                  </span>
                </div>
                {
                  (patient.patientReport !== undefined && patient.prescription !== undefined) ?
                  <>
                    {patient.patientReport 
                    && 
                    <button onClick={() => openReport(index)}>Rapor</button>
                    } 
                    {
                      patient.prescription &&
                      <div className={styles["prescription"]}>
                        <strong className={styles["title"]}>Reçete</strong>
                        <span className={styles["infos"]}>{patient.prescription}</span>
                      </div>
                    }
                                    
                  </>
                  :
                  (patient.prescription !== "Gelmedi") ?
                  <>
                    <Appointment patients={patients} setPatients={setPatients} id={patient._id} setIsLoading={setIsLoading}/>
                  </>
                  :
                  <span style={{textAlign: 'center'}}>Randevuya saatinde gelmedi.</span>
                }
                </div>

            ))
            ) : (
            <span style={{ textAlign: 'center' }}>Hasta kaydı bulunmamaktadır.</span>
            )
        )}
        </div>
    </>
  );
}
