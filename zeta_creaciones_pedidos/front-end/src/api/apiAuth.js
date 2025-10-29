// src/api/apiAuth.js
import AppRequest from '../helpers/AppRequest';

const apiAuth = {
  login: (credentials) => AppRequest.login(credentials),
  logout: () => AppRequest.logout(),
  verificarAuth: () => AppRequest.verificarAuth(),
};

export default apiAuth;
