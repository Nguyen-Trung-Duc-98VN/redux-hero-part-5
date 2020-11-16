import { expectSaga } from 'redux-saga-test-plan';
import { gameSaga } from './gameSaga';
import { select, call } from 'redux-saga/effects';
import { fightSaga } from './fightSaga';
import { getLocation } from '../selectors/gameSelectors';

const safeLocation = {
    safe: true,
    encounterThreshold: 1,
};
const unsafeLocation = {
    safe: false,
    encounterThreshold: .5,
};

describe('gameSaga', () => {
    describe('when player is in a safe location', () => {
        it('allows player to move freely', () => {
            return expectSaga(gameSaga)
                .provide([
                    [ select(getLocation), safeLocation ],
                ])
                .dispatch({ type: 'MOVE' })
                .dispatch({ type: 'MOVE' })
                .dispatch({ type: 'MOVE' })
                .not.call(Math.random)
                .silentRun(50);
        });
    });
    
    describe('when a monster is not encountered', () => {
        it('does not start a fight', () => {
            return expectSaga(gameSaga)
                .provide([
                    [ select(getLocation), unsafeLocation ],
                    [ call(Math.random), 0 ],
                ])
                .dispatch({ type: 'MOVE' })
                .not.call(fightSaga)
                .silentRun(50);
        });
    });
    
    describe('when a monster is encountered', () => {
        it('starts a fight', () => {
            return expectSaga(gameSaga)
                .provide([
                    [ select(getLocation), unsafeLocation ],
                    [ call(Math.random), 1 ],
                    [ call(fightSaga), false ],
                ])
                .dispatch({ type: 'MOVE' })
                .call(fightSaga)
                .run();
        });
        
        describe('after the fight', () => {
            it('exits if the player died', () => {
                return expectSaga(gameSaga)
                    .provide([
                        [ select(getLocation), unsafeLocation ],
                        [ call(Math.random), 1 ],
                        [ call(fightSaga), false ],
                    ])
                    .dispatch({ type: 'MOVE' })
                    .call(fightSaga)
                    .run()
                    .then(({ effects }) => {
                        expect(effects.take).toHaveLength(1);
                    });
            });

            it('continues if the player lives', () => {
                return expectSaga(gameSaga)
                    .provide([
                        [ select(getLocation), unsafeLocation ],
                        [ call(Math.random), 1 ],
                        [ call(fightSaga), true ],
                    ])
                    .dispatch({ type: 'MOVE' })
                    .call(fightSaga)
                    .silentRun(50)
                    .then(({ effects }) => {
                        const takeMoves = effects.take.filter(o => o.TAKE.pattern === 'MOVE');
                        expect(takeMoves).toHaveLength(2);
                    });
            });
        });
    });
});