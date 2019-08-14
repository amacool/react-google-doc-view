import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import userActions from './redux/auth/actions';
import docActions from "./redux/doc/actions";
import ReactGoogleDocView, { getSectionBlocks } from './react-google-doc-view/index';
import { clientId, apiKey, documentId } from "./redux/constants";

const DocViewContainer = (
  { isAuthenticated,
    isAuthenticating,
    accessToken,
    loginSucceeded,
    loginFailed,
    logoutSucceeded,
    logoutFailed,
    isLoading,
    isLoadingFinished,
    isLoadingSucceeded,
    getDocumentRequest,
    docContent,
  }) => {

  isAuthenticated &&
  accessToken &&
  !isLoading &&
  !isLoadingFinished &&
  !isLoadingSucceeded &&
  getDocumentRequest({
    accessToken,
    apiKey,
    documentId,
  });

  return (
    <div>
      <header className="App-header">
        <h1>Using React Google Doc</h1>
      </header>
      <div className="App-body">
        {!isAuthenticated &&
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          scope="https://www.googleapis.com/auth/documents.readonly"
          onSuccess={(data) => {
            loginSucceeded(data.accessToken);
            getDocumentRequest({
              apiKey,
              documentId,
              accessToken: data.accessToken,
            });
          }}
          onFailure={() => {
            loginFailed();
          }}
        />}
        
        {isAuthenticated &&
        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={() => {
            logoutSucceeded();
          }}
          onFailure={() => {
            logoutFailed();
          }}
        >
        </GoogleLogout>}
        
        {isAuthenticated && isLoadingSucceeded &&
        <ReactGoogleDocView
          docContent={getSectionBlocks(docContent)}
        />}
        
        {isLoading &&
        <div>Loading...</div>}
        
        {isLoadingFinished && !isLoadingSucceeded &&
        <div>Loading Failed</div>}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.User.isAuthenticated,
  isAuthenticating: state.User.isAuthenticating,
  accessToken: state.User.accessToken,
  isLoading: state.Doc.isLoading,
  isLoadingFinished: state.Doc.isLoadingFinished,
  isLoadingSucceeded: state.Doc.isLoadingSucceeded,
  docContent: state.Doc.docContent,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators({
      loginSucceeded: userActions.loginSucceeded,
      loginFailed: userActions.loginFailed,
      logoutSucceeded: userActions.logoutSucceeded,
      logoutFailed: userActions.logoutFailed,
      getDocumentRequest: docActions.getDocumentRequest,
    }, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DocViewContainer);