// Wouldn't do this in real app.
// Just for demo purposes
export type Action<T> = { type: T };
export type State = object;

export type Location = {
    safe: boolean;
    encounterThreshold: number;
};

export type Monster = {
    strength: number;
    critThreshold: number;
};

export interface Point {
    x: number;
    y: number;
}

