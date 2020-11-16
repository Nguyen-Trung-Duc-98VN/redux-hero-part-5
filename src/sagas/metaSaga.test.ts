import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { call } from 'redux-saga/effects';
import { metaSaga } from './metaSaga';
import { gameSaga } from './gameSaga';

describe('metaSaga', () => {
    // Note: There is really no reason to unit test metaSaga as it currently exists
    //       because there is essentially no logic in it.
    //       But I'll demonstrate some tests for illustrative purposes.

    it('loops when the game ends', () => {
        return expectSaga(metaSaga)
            .provide([
                // Prevent the real gameSaga from executing
                [ call(gameSaga), undefined ],

                // Declare the 'play' branch of the race will win (and return nothing)
                [ matchers.race, { play: undefined }],
            ])
            .silentRun(50)
            .then(({ effects }) => {
                // Assert that we did more than 1 race, i.e. we looped around
                expect(effects.race.length).toBeGreaterThan(1);
            });
    });

    it('loops when LOAD_GAME happens', () => {
        return expectSaga(metaSaga)
            .provide([
                // Prevent the real gameSaga from executing
                [ call(gameSaga), undefined ],

                // Declare the 'load' branch of the race will win (and return an action object)
                [ matchers.race, { load: { type: 'LOAD_GAME' } }],
            ])
            .silentRun(50)
            .then(({ effects }) => {
                // Assert that we did more than 1 race, i.e. we looped around
                expect(effects.race.length).toBeGreaterThan(1);
            });
    });
});
