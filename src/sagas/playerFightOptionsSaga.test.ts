import { call } from 'redux-saga/effects';
import { playerAttackSaga, playerHealSaga, playerEscapeSaga } from './notImplemented';
import { expectSaga } from 'redux-saga-test-plan';
import { playerFightOptionsSaga } from './playerFightOptionsSaga';
import { Matcher } from 'redux-saga-test-plan/matchers';
import { EffectProviders } from 'redux-saga-test-plan/providers';

describe('playerFightOptionsSaga', () => {
    const dependencies: (EffectProviders | Matcher)[] = [
        [ call(playerAttackSaga), undefined ],
        [ call(playerHealSaga), undefined ],
        [ call(playerEscapeSaga), undefined ],
    ];

    describe('when player chooses attack', () => {
        it('attacks', () => {
            return expectSaga(playerFightOptionsSaga)
                .provide(dependencies)
                .dispatch({ type: 'ATTACK' })
                .call(playerAttackSaga)
                .not.call(playerHealSaga)
                .not.call(playerEscapeSaga)
                .run();
        });
    });

    describe('when player chooses heal', () => {
        it('heals', () => {
            return expectSaga(playerFightOptionsSaga)
                .provide(dependencies)
                .dispatch({ type: 'DRINK_POTION' })
                .not.call(playerAttackSaga)
                .call(playerHealSaga)
                .not.call(playerEscapeSaga)
                .run();
        });
    });

    describe('when player chooses escape', () => {
        it('escapes', () => {
            return expectSaga(playerFightOptionsSaga)
                .provide(dependencies)
                .dispatch({ type: 'RUN_AWAY' })
                .not.call(playerAttackSaga)
                .not.call(playerHealSaga)
                .call(playerEscapeSaga)
                .run();
        });
    });
});
