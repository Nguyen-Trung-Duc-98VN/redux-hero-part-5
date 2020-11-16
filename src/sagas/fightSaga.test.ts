import { expectSaga } from 'redux-saga-test-plan';
import { select, CallEffect } from 'redux-saga/effects';
import { fightSaga } from './fightSaga';
import { getMonster, getHealth, getMonsterHealth } from '../selectors/gameSelectors';
import { Monster } from '../types';
import { monsterAttackSaga } from './monsterAttackSaga';
import { playerFightOptionsSaga } from './playerFightOptionsSaga';
import { call } from 'redux-saga-test-plan/matchers';

const monster = {} as Monster;

describe('fightSaga', () => {
    it('allows the monster to attack first', () => {
        return expectSaga(fightSaga)
            .provide([
                [ select(getMonster), monster ],
                [ select(getHealth), 0 ], // Player is dead
                [ call(monsterAttackSaga, monster), undefined ],
            ])
            .call(monsterAttackSaga, monster) // The monster has attacked
            .not.call(playerFightOptionsSaga) // and the player hasn't
            .run();
    });
    
    it('exits if the player died', () => {
        return expectSaga(fightSaga)
            .provide([
                [ select(getMonster), monster ],
                [ select(getHealth), 0 ], // Player is dead
                [ call(monsterAttackSaga, monster), undefined ],
            ])
            .run()
            .then(({ effects }) => {
                // Assert that the monster attack sequence only happened once
                const monsterAttacks = effects.call.filter(e => e.CALL.fn === monsterAttackSaga);
                expect(monsterAttacks).toHaveLength(1);
            });
    });

    it('allows the player to attack, if still alive', () => {
        return expectSaga(fightSaga)
            .provide([
                [ select(getMonster), monster ],
                [ select(getHealth), 50 ], // Player is alive
                [ select(getMonsterHealth), 0 ], // Monster is dead
                [ call(monsterAttackSaga, monster), undefined ],
                [ call(playerFightOptionsSaga), undefined ],
            ])
            .call(playerFightOptionsSaga) // Assert that the player attacked
            .run();
    });

    it('exits if the monster died', () => {
        return expectSaga(fightSaga)
            .provide([
                [ select(getMonster), monster ],
                [ select(getHealth), 50 ], // Player is alive
                [ select(getMonsterHealth), 0 ], // Monster is dead
                [ call(monsterAttackSaga, monster), undefined ],
                [ call(playerFightOptionsSaga), undefined ],
            ])
            .call(playerFightOptionsSaga) // Assert that the player attacked
            .run()
            .then(result => {
                // TODO: this *should* work but looks like a bug in redux-saga-test-plan.
                //       the effect we're looking for shows up in allEffects but not effects.
                //// Assert that the player attack sequence only happened once
                //const { effects } = result;
                //const playerAttacks = effects.call.filter(e => e.CALL.fn === playerFightOptionsSaga);
                //expect(playerAttacks).toHaveLength(1);

                const { allEffects } = result;
                const playerAttacks = allEffects.filter((e: CallEffect) => e.CALL && e.CALL.fn === playerFightOptionsSaga);
                expect(playerAttacks).toHaveLength(1);
            });

    });

    it('allows the monster to attack again if still alive', () => {
        return expectSaga(fightSaga)
            .provide([
                [ select(getMonster), monster ],
                [ select(getHealth), 50 ], // Player is alive
                [ select(getMonsterHealth), 100 ], // Monster is alive
                [ call(monsterAttackSaga, monster), undefined ],
                [ call(playerFightOptionsSaga), undefined ],
            ])
            .silentRun(50)
            .then(result => {
                // TODO: this *should* work but looks like a bug in redux-saga-test-plan.
                //       the effect we're looking for shows up in allEffects but not effects.
                //// Assert that the player attack sequence only happened once
                //const { effects } = result;
                //const monsterAttacks = effects.call.filter(e => e.CALL && e.CALL.fn === monsterAttackSaga);
                //expect(monsterAttacks.length).toBeGreaterThan(1);

                // Assert that the monster attack sequence happened more than once
                const { allEffects } = result;
                const monsterAttacks = allEffects.filter((e: CallEffect) => e.CALL && e.CALL.fn === monsterAttackSaga);
                expect(monsterAttacks.length).toBeGreaterThan(1);
            });
    });
});
