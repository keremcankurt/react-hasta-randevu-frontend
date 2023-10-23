import {del, get, post} from '../request';
const BASE_URL = "https://hasta-randevu.onrender.com/api/appointment";

export const getAppointments = () => get(`${BASE_URL}/`);
export const getPastAppointments = () => get(`${BASE_URL}/pastappointments`);
export const getDoctorAppointments = (data) => post(`${BASE_URL}/doctorappointments/${data.id}`,JSON.stringify(data.data),'application/json');
export const createAppointment = (data) => post(`${BASE_URL}/create`,data,'application/json');
export const delAppointment = (id) => del(`${BASE_URL}/${id}`);
