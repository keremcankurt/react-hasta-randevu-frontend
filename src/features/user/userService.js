import {get} from '../request';
const BASE_URL = "http://localhost:4000/api/user";

const getUser = () => get(`${BASE_URL}/profile`);

const userService = {
    getUser,
}

export default userService;