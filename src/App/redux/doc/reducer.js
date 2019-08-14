import actions from './actions';

const initState = {
  isLoading: false,
  isLoadingSucceeded: false,
  isLoadingFinished: false,
  docContent: null,
};

export default function userReducer(state = initState, { type, ...action }) {
  switch (type) {
    case actions.GET_DOCUMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.GET_DOCUMENT_SUCCEEDED:
      return {
        ...state,
        docContent: action.data,
        isLoading: false,
        isLoadingSucceeded: true,
        isLoadingFinished: true,
      };
    case actions.GET_DOCUMENT_FAILED:
      return {
        ...state,
        isLoading: false,
        isLoadingSucceeded: false,
        isLoadingFinished: true,
      };

    default:
      return state;
  }
}
