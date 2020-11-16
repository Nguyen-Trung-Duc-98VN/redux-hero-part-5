import { call } from 'redux-saga/effects';

//
//  This file contains declarations of the other sagas that
//  weren't implemented in the article. They are included
//  here only to make the TypeScript type checker happy.
//

export function* playerAttackSaga() {
    yield call([ console, 'error' ], 'not implemented');
}

export function* playerHealSaga() {
    yield call([ console, 'error' ], 'not implemented');
}

export function* playerEscapeSaga() {
    yield call([ console, 'error' ], 'not implemented');
}
