import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import docSagas from './doc/saga';

export default function* rootSaga(getState) {
  yield all([docSagas(), authSagas()]);
}
