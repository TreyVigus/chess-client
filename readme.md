## About
This provides a user interface to play against a chess bot that runs the minimax algorithm in a web worker.  This was written to improve my TypeScript abilities, so custom implementations have been favored over external dependencies in many cases.  Since the game tree is so large, clean-code best practices have been violated in favor of performance optimizations.

The bot implements alpha-beta pruning, a transposition table, and a simple move-ordering heuristic: captures have the highest priority, followed by forward moves, and then backward moves.  The search depth has been capped at 5 ply since deeper searches become very slow.  The evaluation function simply calculates material, breaking ties by counting the number of attacked squares.  This bot can easily beat novice players, but experienced players will have no difficulty defeating it.  The low search depth and lack of quiescent search cause horizon effects, which become readily apparent in the endgame.

Inspired by section 3.5 of http://aima.cs.berkeley.edu/.

## Running
**npm run start**
- This starts nodemon, which will watch for changes to files (see nodemon.json).
- When nodemon detects a file, it will 
    - run 'tsc', which makes typescript compile .ts files in the src directory and output to the build directory.
    - run moveFiles.js, which moves files tsc didn't handle to the build directory.
    - Serve the app by running server.js from the build directory (compiled from server.ts).
## Testing
**npm run test**
- This starts nodemon, just like npm run start.
- When nodemon detects a file, it will 
    - run 'tsc', which will compile all spec.ts files to spec.js files.
    - execute runTests.js, which executes all files of the form .test.js from the build/app directory.
