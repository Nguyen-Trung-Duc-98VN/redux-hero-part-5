import { select, call } from 'redux-saga/effects';
import { Monster } from '../types';
import { getMonster, getHealth, getMonsterHealth } from '../selectors/gameSelectors';
import { monsterAttackSaga } from './monsterAttackSaga';
import { playerFightOptionsSaga } from './playerFightOptionsSaga';

export function* fightSaga() {
    // for convenience, save a reference to the monster
    const monster: Monster = yield select(getMonster);

    while (true) {
        // monster attack sequence
        yield call(monsterAttackSaga, monster);

        // is player dead? return false
        const playerHealth = yield select(getHealth);
        if (playerHealth <= 0) return false;

        // player fight options
        yield call(playerFightOptionsSaga);

        // is monster dead? return true
        const monsterHealth = yield select(getMonsterHealth);
        if (monsterHealth <= 0) return true;
    }
}
