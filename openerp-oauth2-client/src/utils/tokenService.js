// tokenService.js
import jwt_decode from 'jwt-decode';

export const getUserNameFromToken = (token) => {
    try {
        const decodedToken = jwt_decode(token);
        console.log(decodedToken);
        return decodedToken.preferred_username;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};