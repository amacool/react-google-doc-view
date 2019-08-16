import actions from './actions';
import axios from 'axios';
import { all, takeEvery, put, call } from 'redux-saga/effects';
import { apiKey } from "../constants";

const loadDocument = ({ documentId, accessToken }) => {
  return axios.get(`https://cors-anywhere.herokuapp.com/https://docs.googleapis.com/v1/documents/${documentId}?key=${apiKey}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.log(err);
    return false;
  })
};

export function* getDocument(data) {
  let res = yield call(loadDocument, data.data);
  if (res) {
    yield put(actions.getDocumentSucceeded(res.data));
  } else {
    yield put(actions.getDocumentFailed());
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.GET_DOCUMENT_REQUEST, getDocument),
  ]);
}
