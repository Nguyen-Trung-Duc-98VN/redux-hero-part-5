import { take, select, call } from 'redux-saga/effects';
import { Actions } from '../actions/gameActions';
import { getLocation } from '../selectors/gameSelectors';
import { fightSaga } from './fightSaga';

export function* gameSaga() {
    let playerAlive = true;
    while (playerAlive) {
        yield take(Actions.MOVE);

        const location = yield select(getLocation);
        if (location.safe) continue;

        const monsterProbability = yield call(Math.random);
        if (monsterProbability < location.encounterThreshold) continue;

        // fight the monster
        playerAlive = yield call(fightSaga);
    }
}
