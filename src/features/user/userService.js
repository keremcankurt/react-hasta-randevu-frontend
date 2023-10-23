import {get} from '../request';
const BASE_URL = "https://hasta-randevu.onrender.com/api/user";

const getUser = () => get(`${BASE_URL}/profile`);

const userService = {
    getUser,
}

export default userService;
