# Multi-agent Pac-Man

A dependency-free browser game with a human or heuristic Pac-Man agent and four independent ghost agents. All agents run locally; no API keys or LLM calls are needed.

## Run on your Mac

Put this folder at `/Users/marishasahay/dev/github/multi-agent-pacman`, then:

```sh
cd /Users/marishasahay/dev/github/multi-agent-pacman
python3 -m http.server 8000
```

Open http://localhost:8000. You can also open `index.html` directly without a server.

## Controls

- Arrow keys or WASD: move (turns are buffered until legal).
- Space: pause/resume. R: restart.
- Autopilot: a heuristic player balances nearby pellets against ghost danger.
- Show agent targets: visualize ghost targeting.
- Touch buttons: mobile controls.

## Agents

| Agent | Strategy |
| --- | --- |
| Blinky | Shortest-path pursuit of Pac-Man |
| Pinky | Targets four tiles ahead of Pac-Man |
| Inky | Flanks using a reflected target relative to Blinky |
| Clyde | Pursues at range and retreats to its corner nearby |

Ghosts alternate scatter/chase modes. Power pellets temporarily make ghosts flee. BFS routes to a reachable tile closest to each target if the exact target is a wall or outside the maze. Eating every pellet starts a new level. Three lives per game.

This is an original simplified Pac-Man-style implementation, not an exact emulation. Levels reuse the maze and speed. Autopilot is a simple baseline and is not guaranteed to win.

## Development

- `engine.js`: DOM-free simulation, pathfinding, agent policies and scoring.
- `app.js`: canvas rendering, controls and game loop.
- `style.css`: responsive arcade interface.
- `test.js`: simulation tests; run `node test.js`.

No installation or build step required.
