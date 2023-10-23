import {get, put} from '../request';
const BASE_URL = "http://localhost:4000/api/doctor";

export const getDoctors = () => get(`${BASE_URL}/`);
export const getPatients = () => get(`${BASE_URL}/patients`);
export const addReportAndPrescription = (data, id) => put(`${BASE_URL}/addreportandprescription/${id}`,data);
