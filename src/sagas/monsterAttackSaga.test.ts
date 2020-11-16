import { delay } from 'redux-saga';
import { Monster } from '../types';
import { expectSaga } from 'redux-saga-test-plan';
import { monsterAttackSaga } from './monsterAttackSaga';
import * as matchers from 'redux-saga-test-plan/matchers';
import { call } from 'redux-saga/effects';
import { Matcher } from 'redux-saga-test-plan/matchers';
import { EffectProviders } from 'redux-saga-test-plan/providers';

const monster: Monster = {
    strength: 5,
    critThreshold: .15,
};

describe('monsterAttackSaga', () => {
    it('first waits a small delay', () => {
        // Since we're explicitly looking for the first effect, can do this the old-fashioned way
        const iter = monsterAttackSaga(monster);
        expect(iter.next().value).toEqual(expect.objectContaining({
            CALL: expect.objectContaining({
                fn: delay,
                args: [ 1000 ],
            }),
        }));
    });
    
    const cases = [
        { isCrit: true,  desc: 'when monster has critical hit' },
        { isCrit: false, desc: 'when monster has normal hit'   },
    ]
    cases.forEach(({ isCrit, desc }) => {
        describe(desc, () => {
            const expectedDamage = isCrit ? 10 : 5;
            const critProbability = isCrit ? 1 : 0;

            const dependencies: (EffectProviders | Matcher)[] = [
                // This matches any call to delay() regardless of the parameters used
                [ matchers.call.fn(delay), undefined ],
                [ call(Math.random), critProbability ],
            ];

            it('animates correct amount of damage', () => {
                // Note the saga takes a parameter. We can inject the parameter via expectSaga
                return expectSaga(monsterAttackSaga, monster)
                    .provide(dependencies)
                    .put({
                        type: 'ANIMATE_MONSTER_ATTACK',
                        payload: expectedDamage,
                    })
                    .run();
            });

            it('delays after the monster attack animation', () => {
                return expectSaga(monsterAttackSaga, monster)
                    .provide(dependencies)
                    .run()
                    .then(({ allEffects }) => {
                        // Find where the monster attack happened in the array of all effects
                        const iMonsterAttack = allEffects.findIndex(e => e.PUT && e.PUT.action === 'ANIMATE_MONSTER_ATTACK');

                        // Assert that the following effect is a call to Delay for 1000ms
                        expect(allEffects[iMonsterAttack + 1]).toEqual(
                            expect.objectContaining({
                                CALL: expect.objectContaining({
                                    fn: delay,
                                    args: [ 1000 ],
                                }),
                            }),
                        );
                    });
            });

            it('deals correct amount of damage to user', () => {
                return expectSaga(monsterAttackSaga, monster)
                    .provide(dependencies)
                    .put({
                        type: 'TAKE_DAMAGE',
                        payload: expectedDamage,
                    })
                    .run();
            });
        });
    });
});
