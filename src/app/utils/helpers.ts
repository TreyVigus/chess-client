import { ChessState, Color, Position, Square } from "../game/models.js";
import { BOARD_SIZE } from "../view/boardView.js";

export function oppositeColor(color: Color): Color {
    if(color === 2) {
        return 1;
    }
    return 2;
}

export function posColor(pos: Position): Color {
    const evenRow = pos[0] % 2 === 0;
    const evenCol = pos[1] % 2 === 0;
    if(evenRow) {
        return evenCol ? 2 : 1;
    } else {
        return evenCol ? 1 : 2;
    }
}

export function posEquals(pos1: Position, pos2: Position): boolean {
    return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

/** 
 * Return a list of positions representing the coordinates of an 8x8 board.
 * (0,0), (0,1), (0,2)...
 * */
export function posSequence(): Position[] {
    const seq: Position[] = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            seq.push([i, j]);
        }
    }
    return seq;
}

/**
 * @param next A function that generates the next element based on the current position.
 * @returns An 8x8 array populated with the generated elements.
 */
export function constructBoard<T>(next: (pos: Position) => T): T[][] {
    const board = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        let row = [];
        for(let j = 0; j < BOARD_SIZE; j++) {
            row.push(next([i, j]))
        }
        board.push(row);
    }
    return board;
}

export type BoardElement<T> = {
    index: Position,
    value: T
}

/**
 * @param board An 8x8 array
 * @todo this is a performance bottleneck
 * 
 * Converts the given 8x8 array to an Iterable, which can be used in a for...of or spread construct.
 */
export function flat<T>(board: T[][]): Iterable<BoardElement<T>> {
    const seq = posSequence();
    let currIndex = 0;
    const next: () => IteratorResult<{index: Position, value: T}> = function() {
        if(currIndex === seq.length) {
            return {done: true, value: null}
        }
        const currPos = seq[currIndex];
        const res =  { 
            done: false, 
            value: {
                index: seq[currIndex],
                value: itemAt(board, currPos)
            }
        }
        currIndex++;
        return res;
    }

    return {
        [Symbol.iterator]: function() {
            return { next }
        }
    }
}

/**
 * Faster flattening than flat<T>
 * @todo: could possibly store the flat version of the board as part of the state
 */
export function flatten<T>(board: T[][]): BoardElement<T>[] {
    const flat: BoardElement<T>[] = [];
    posSequence().forEach(pos => {
        const element = {
            index: pos,
            value: itemAt(board, pos)
        }
        flat.push(element);
    });
    return flat;
}

export function itemAt<T>(board: T[][], pos: Position): T {
    const [i, j] = pos;
    if(i < 0 || j < 0 || i >= BOARD_SIZE || j >= BOARD_SIZE) {
        throw `Position (${i}, ${j}) is invalid`;
    }
    return board[i][j];
}

/** Return a deep clone of the given object. */
export function clone<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/** Is the given position within the dimensions of the board? TODO: might as well unit test this. */
export function validPosition(pos: Position): boolean {
    return pos[0] > -1 && pos[1] > -1 && pos[0] < BOARD_SIZE && pos[1] < BOARD_SIZE;
}

/** Perform vector addition on the given positions. */
export function addPositions(...positions: Position[]): Position {
    let sum: Position = [0, 0];
    positions.forEach(pos => {
        sum[0] = sum[0] + pos[0];
        sum[1] = sum[1] + pos[1];
    });
    return sum;
}

/** 
 * Returns a deep copy of the given state.  
 * Faster than clone().
 * */
export function cloneState(state: ChessState): ChessState {
    const boardClone = constructBoard<Square>((pos: Position) => {
        const square = itemAt(state.board, pos);
        return cloneSquare(square);
    });

    return { board: boardClone }
}

export function cloneSquare(square: Square): Square {
    let squareClone: Square = { position: square.position };

    if(square.piece) {
        squareClone.piece = {
            color: square.piece.color,
            name: square.piece.name
        }
    }

    squareClone.touched = square.touched;

    return squareClone;
}

/** Shuffle array in place. */
export function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}