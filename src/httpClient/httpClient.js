import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./errorHandling";

const httpClient = axios.create({
    url: 'https://wordsapiv1.p.rapidapi.com/words/',
    headers: {
        'x-rapidapi-key': 'eab2bb900dmshbbf80355c6e3a53p11defdjsn665b2c824e38',
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        "Content-Type": "application/json",
    }
});

httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);
export default httpClient;