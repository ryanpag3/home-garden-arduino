import { configure } from 'axios-hooks';
import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

configure({ axios });

export default axios;