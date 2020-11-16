import { call, race, take } from 'redux-saga/effects';
import { gameSaga } from './gameSaga';
import { Actions } from '../actions/gameActions';

export function* metaSaga() {
    // wait for assets to load
    // show intro screen
    // wait for player to start the game
    
    // play the game and also watch for load game
    while (true) {
        yield race({
            play: call(gameSaga),
            load: take(Actions.LOAD_GAME),
        });
    }
}
