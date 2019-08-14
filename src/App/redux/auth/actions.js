const userActions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCEEDED: 'LOGIN_SUCCEEDED',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCEEDED: 'LOGOUT_SUCCEEDED',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
  
  loginSucceeded: (data) => ({type: userActions.LOGIN_SUCCEEDED, data}),
  loginFailed: () => ({type: userActions.LOGIN_FAILED}),
  
  logoutSucceeded: () => ({type: userActions.LOGOUT_SUCCEEDED}),
  logoutFailed: () => ({type: userActions.LOGOUT_FAILED}),
};

export default userActions;
