import axios from "axios"; //importar a biblioteca axios, que é usada para fazer requisições, HTTP.

const api = axios.create({
     baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000" // define a url para todas as requisições com essa instancia 
});


export default api;