import jwt_decode from 'jwt-decode';

export const checkTokenExp = async token => {
 const decoded = await jwt_decode(token);

 if (decoded.exp >= Date.now() / 1000) {
  return null;
 } else {
  return token;
 }
}