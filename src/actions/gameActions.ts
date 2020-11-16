import { Point } from 'src/types';

export const Actions = {
    MOVE: 'MOVE',
    ATTACK: 'ATTACK',
    DRINK_POTION: 'DRINK_POTION',
    RUN_AWAY: 'RUN_AWAY',
    LOAD_GAME: 'LOAD_GAME',
    ANIMATE_MONSTER_ATTACK: 'ANIMATE_MONSTER_ATTACK',
    TAKE_DAMAGE: 'TAKE_DAMAGE',
};

export const move = ({ x, y }: Point) => ({
    type: Actions.MOVE,
    payload: { x, y }
});

export const animateMonsterAttack = (damage: number) => ({
    type: Actions.ANIMATE_MONSTER_ATTACK,
    payload: damage,
});

export const takeDamage = (damage: number) => ({
    type: Actions.TAKE_DAMAGE,
    payload: damage,
});
