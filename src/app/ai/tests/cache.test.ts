import { createTestGroup } from "../../../testing/test-execution.js";
import { ChessState } from "../../game/models.js";
import { cloneState } from "../../utils/helpers.js";
import { getEmptyCache } from "../cache.js";
import { EvalResult } from "../minimaxBot.js";

const tg = createTestGroup('Cache testing', ()=> {});

const state1: ChessState = {"board":[[{"position":[0,0],"touched":true},{"position":[0,1],"touched":true},{"position":[0,2],"touched":true},{"position":[0,3],"touched":true,"piece":{"color":"black","name":"king"}},{"position":[0,4],"touched":true},{"position":[0,5],"touched":true,"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"touched":true},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"touched":true},{"position":[1,2],"touched":true},{"position":[1,3],"touched":true},{"position":[1,4],"touched":true},{"position":[1,5],"touched":true},{"position":[1,6],"touched":true},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0],"piece":{"color":"white","name":"queen"},"touched":true},{"position":[2,1]},{"position":[2,2],"touched":true,"piece":{"color":"white","name":"bishop"}},{"position":[2,3]},{"position":[2,4],"touched":true},{"position":[2,5],"touched":true},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,2],"touched":true},{"position":[3,3],"touched":true},{"position":[3,4],"touched":true,"piece":{"color":"white","name":"knight"}},{"position":[3,5],"touched":true},{"position":[3,6],"touched":true},{"position":[3,7],"touched":true}],[{"position":[4,0],"piece":{"color":"white","name":"knight"},"touched":true},{"position":[4,1]},{"position":[4,2],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[4,3],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[4,4],"piece":{"color":"black","name":"knight"},"touched":true},{"position":[4,5],"touched":true},{"position":[4,6],"touched":true,"piece":{"color":"black","name":"pawn"}},{"position":[4,7]}],[{"position":[5,0],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,1],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,2],"touched":true},{"position":[5,3],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,4],"touched":true},{"position":[5,5],"touched":true},{"position":[5,6],"touched":true},{"position":[5,7]}],[{"position":[6,0],"touched":true},{"position":[6,1],"touched":true},{"position":[6,2],"touched":true},{"position":[6,3],"touched":true},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"touched":true},{"position":[7,1],"touched":true},{"position":[7,2],"touched":true,"piece":{"color":"white","name":"rook"}},{"position":[7,3],"touched":true},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"touched":true},{"position":[7,6],"touched":true,"piece":{"color":"white","name":"rook"}},{"position":[7,7],"touched":true}]]};

tg.add('get returns undefined if state is not present', () => {
    const cache = getEmptyCache(); 
    if(cache.get('white', state1) !== undefined || cache.get('black', state1) !== undefined) {
        return false;
    }
    return true;
});

tg.add('get returns eval if state is present', () => {
    const cache = getEmptyCache(); 
    const evaluation: EvalResult = {
        eval: 5,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation);
    
    const stored = cache.get('white', state1);
    return !!stored && stored.eval === 5 && cache.size() == 1;
});

tg.add('only stores in correct color map', () => {
    const cache = getEmptyCache(); 
    const evaluation: EvalResult = {
        eval: 5,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation);
    
    const blackStored = cache.get('black', state1);
    const whiteStored = cache.get('white', state1);

    return !!whiteStored && whiteStored.eval === 5 && cache.size() == 1 && !blackStored;
});

tg.add('add same state many times', () => {
    const cache = getEmptyCache(); 
    const evaluation: EvalResult = {
        eval: 5,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation);
    cache.add('white', state1, evaluation);
    cache.add('white', state1, evaluation);

    const stored = cache.get('white', state1);
    return !!stored && stored.eval === 5 && cache.size() == 1;
});

tg.add('update state', () => {
    const cache = getEmptyCache(); 
    const evaluation: EvalResult = {
        eval: 5,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation);

    const evaluation2: EvalResult = {
        eval: 6,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation2);

    const stored = cache.get('white', state1);
    return !!stored && stored.eval === 6 && cache.size() == 1;
});

tg.add('update state', () => {
    const cache = getEmptyCache(); 
    const evaluation: EvalResult = {
        eval: 5,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    const evaluation2: EvalResult = {
        eval: 6,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation);
    cache.add('black', state1, evaluation2);

    return cache.size() == 2;
});

tg.add('cloned state serializes the same as original', () => {
    const cache = getEmptyCache(); 
    const evaluation: EvalResult = {
        eval: 5,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation);
    cache.add('white', cloneState(state1), evaluation);
    cache.add('white', cloneState(state1), evaluation);

    const stored = cache.get('white', state1);
    return !!stored && stored.eval === 5 && cache.size() == 1;
});

tg.add('same state, but different property order serializes the same', () => {
    const state2: ChessState = {"board":[[{"position":[0,0],"touched":true},{"position":[0,1],"touched":true},{"touched":true, "position":[0,2]},{"position":[0,3],"touched":true,"piece":{"color":"black","name":"king"}},{"position":[0,4],"touched":true},{"position":[0,5],"touched":true,"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"touched":true},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"touched":true},{"position":[1,2],"touched":true},{"position":[1,3],"touched":true},{"position":[1,4],"touched":true},{"position":[1,5],"touched":true},{"position":[1,6],"touched":true},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0],"piece":{"color":"white","name":"queen"},"touched":true},{"position":[2,1]},{"position":[2,2],"touched":true,"piece":{"color":"white","name":"bishop"}},{"position":[2,3]},{"position":[2,4],"touched":true},{"position":[2,5],"touched":true},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,2],"touched":true},{"position":[3,3],"touched":true},{"position":[3,4],"touched":true,"piece":{"color":"white","name":"knight"}},{"position":[3,5],"touched":true},{"position":[3,6],"touched":true},{"position":[3,7],"touched":true}],[{"position":[4,0],"piece":{"color":"white","name":"knight"},"touched":true},{"position":[4,1]},{"position":[4,2],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[4,3],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[4,4],"piece":{"color":"black","name":"knight"},"touched":true},{"position":[4,5],"touched":true},{"position":[4,6],"touched":true,"piece":{"color":"black","name":"pawn"}},{"position":[4,7]}],[{"position":[5,0],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,1],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,2],"touched":true},{"position":[5,3],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,4],"touched":true},{"position":[5,5],"touched":true},{"position":[5,6],"touched":true},{"position":[5,7]}],[{"position":[6,0],"touched":true},{"position":[6,1],"touched":true},{"position":[6,2],"touched":true},{"position":[6,3],"touched":true},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"touched":true},{"position":[7,1],"touched":true},{"position":[7,2],"touched":true,"piece":{"color":"white","name":"rook"}},{"position":[7,3],"touched":true},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"touched":true},{"position":[7,6],"touched":true,"piece":{"name":"rook", "color":"white"}},{"position":[7,7],"touched":true}]]};
    const cache = getEmptyCache(); 
    const evaluation: EvalResult = {
        eval: 5,
        ply: {
            startPos: [0, 3],
            endPos: [6, 4]
        }
    };
    cache.add('white', state1, evaluation);
    cache.add('white', state2, evaluation);
    cache.add('white', state2, evaluation);

    const stored = cache.get('white', state2);
    return !!stored && stored.eval === 5 && cache.size() == 1;
});

tg.execute();