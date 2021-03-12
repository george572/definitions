import store from "../store";
export const errorInterceptor = error => {
    // check if it's a server error
    if (!error.response) {
        return Promise.reject(error);
    }

    // all the other error responses
    switch(error.response.status) {
        case 400:
            console.error(error.response.status, error.message, "sss");
            break;
        case 401: // authentication error, logout the user
            console.error(error)
            break;
        case 404: // authentication error, logout the user
             store.commit("showError", true);
            break;
        default:
            console.error(error.response.status, error.message);
    }
    return Promise.reject(error);
}
// Interceptor for responses
export const responseInterceptor = response => {
    switch(response.status) {
        case 200:
            // yay!
            break;
        // any other cases
        default:
        // default case
    }

    return response;
}
