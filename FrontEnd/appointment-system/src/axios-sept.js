import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/',
  //baseURL: "http://54.144.245.48:8080/",
});

export default instance;
