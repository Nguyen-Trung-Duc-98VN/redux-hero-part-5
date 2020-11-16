import { call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { Monster } from '../types';
import { animateMonsterAttack, takeDamage } from '../actions/gameActions';

export function* monsterAttackSaga(monster: Monster) {
    // wait a small delay
    yield call(delay, 1000);

    // generate random damage amount
    let damage = monster.strength;
    const critProbability = yield call(Math.random);
    if (critProbability >= monster.critThreshold) damage *= 2;

    // play an attack animation
    yield put(animateMonsterAttack(damage));
    yield call(delay, 1000);

    // apply damage to the player
    yield put(takeDamage(damage));
}
