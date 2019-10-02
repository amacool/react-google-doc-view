const docActions = {
    GET_DOCUMENT_REQUEST: 'GET_DOCUMENT_REQUEST',
    GET_DOCUMENT_SUCCEEDED: 'GET_DOCUMENT_SUCCEEDED',
    GET_DOCUMENT_FAILED: 'GET_DOCUMENT_FAILED',
  
    getDocumentRequest: (data) => ({ type: docActions.GET_DOCUMENT_REQUEST, data }),
    getDocumentSucceeded: (data) => ({ type: docActions.GET_DOCUMENT_SUCCEEDED, data }),
    getDocumentFailed: () => ({ type: docActions.GET_DOCUMENT_FAILED }),
};

export default docActions;
