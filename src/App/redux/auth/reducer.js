import Cookies from "universal-cookie";
import actions from './actions';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

const initState = {
  isAuthenticated: accessToken && accessToken !== 'undefined',
  isAuthenticating: false,
  accessToken: accessToken !== 'undefined' ? accessToken : false,
};

export default function userReducer(state = initState, { type, ...action }) {
  switch (type) {
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
      };
    case actions.LOGIN_SUCCEEDED:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        accessToken: action.data,
      };
    case actions.LOGIN_FAILED:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
      };
  
    case actions.LOGOUT_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
      };
    case actions.LOGOUT_SUCCEEDED:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
      };
    case actions.LOGOUT_FAILED:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
      };
      
    default:
      return state;
  }
}
