import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000',
  // baseURL: 'https://ponno-khata-server.onrender.com',
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
