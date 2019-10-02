import Cookies from 'universal-cookie';
import { all, takeEvery } from 'redux-saga/effects';
import actions from './actions';
const cookies = new Cookies();

export function* loginSuccess(data) {
    const now = new Date();
    now.setDate(now.getDate() + 180);
    yield cookies.set('accessToken', data.data, { path: '/', expires: now });
}

export function* logoutSuccess() {
    yield cookies.remove('accessToken');
}

export default function* rootSaga() {
    yield all([
        yield takeEvery(actions.LOGIN_SUCCEEDED, loginSuccess),
        yield takeEvery(actions.LOGOUT_SUCCEEDED, logoutSuccess),
    ]);
}
