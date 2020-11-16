import { call, race, take } from 'redux-saga/effects';
import { Actions } from '../actions/gameActions';
import { playerAttackSaga, playerHealSaga, playerEscapeSaga } from './notImplemented';

export function* playerFightOptionsSaga() {
    // wait for player to select an action
    const { attack, heal, escape } = yield race({
        attack: take(Actions.ATTACK),
        heal: take(Actions.DRINK_POTION),
        escape: take(Actions.RUN_AWAY),
    });

    if (attack) yield call(playerAttackSaga);
    if (heal) yield call(playerHealSaga);
    if (escape) yield call(playerEscapeSaga);
}
