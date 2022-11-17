import jwt_decode from 'jwt-decode';

export const checkTokenExp = async token => {
 const decoded = await jwt_decode(token);

 console.log(decoded.exp, Date.now() / 1000);

 if (decoded.exp >= Date.now() / 1000) {
  return null;
 } else {
  return token;
 }
}