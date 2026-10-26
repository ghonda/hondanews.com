import {
    createGame,
    moveAndCollide,
    update,
    GROUND_Y,
    VIEW_H,
} from "components/careerGame/engine.js";

const ground = (x, w) => ({ type: "ground", x, y: GROUND_Y, w, h: 32 });
const idle = () => ({ left: false, right: false, jump: false });
const body = (props) => ({ x: 0, y: 0, w: 10, h: 16, vx: 0, vy: 0, ...props });

function levelWith(props) {
    return {
        solids: [ground(0, 400)],
        coins: [],
        bugs: [],
        flag: null,
        labels: [],
        stops: [],
        worldW: 400,
        ...props,
    };
}

describe("components/careerGame/engine.js", () => {
    describe("moveAndCollide()", () => {
        test("lands on top of the ground", () => {
            const result = moveAndCollide(body({ y: GROUND_Y - 18, vy: 5 }), [
                ground(-100, 300),
            ]);

            expect(result.body.y).toBe(GROUND_Y - 16);
            expect(result.body.vy).toBe(0);
            expect(result.body.onGround).toBe(true);
        });

        test("bumps the block closest to the head when jumping", () => {
            const left = { type: "brick", x: 96, y: 40, w: 16, h: 16 };
            const right = { type: "question", x: 112, y: 40, w: 16, h: 16 };

            const result = moveAndCollide(body({ x: 110, y: 60, vy: -6 }), [
                left,
                right,
            ]);

            expect(result.bumped).toBe(right);
            expect(result.body.y).toBe(56);
            expect(result.body.vy).toBe(0);
        });

        test("stops against a wall", () => {
            const pipe = { type: "pipe", x: 20, y: 0, w: 32, h: 100 };

            const result = moveAndCollide(body({ x: 8, y: 50, vx: 3 }), [pipe]);

            expect(result.body.x).toBe(10);
            expect(result.hitWall).toBe(true);
        });
    });

    describe("update()", () => {
        test("bumping a question block shows its stop", () => {
            const stop = { title: "MindMiners" };
            const block = {
                type: "question",
                x: 40,
                y: GROUND_Y - 40,
                w: 16,
                h: 16,
                stop,
            };
            const game = createGame(
                levelWith({ solids: [ground(0, 400), block] }),
            );
            game.player.x = 43;
            const shown = [];

            update(
                game,
                { ...idle(), jump: true, jumpPressed: true },
                400,
                (s) => shown.push(s),
            );
            for (let i = 0; i < 20; i++) {
                update(game, { ...idle(), jump: true }, 400, (s) =>
                    shown.push(s),
                );
            }

            expect(shown).toContain(stop);
            expect(block.used).toBe(true);
        });

        test("stomping a bug fixes it", () => {
            const bug = { x: 60, y: GROUND_Y - 12, w: 12, h: 12, dir: -1 };
            const game = createGame(levelWith({ bugs: [bug] }));
            Object.assign(game.player, { x: 60, y: GROUND_Y - 40, vy: 2 });

            for (let i = 0; i < 20; i++) update(game, idle(), 400, () => {});

            expect(game.bugsFixed).toBe(1);
            expect(game.player.hurt).toBe(0);
        });

        test("falling into a pit respawns on the last safe ground", () => {
            const game = createGame(
                levelWith({ solids: [ground(0, 100), ground(148, 252)] }),
            );
            Object.assign(game.player, { x: 120, y: 100 });

            for (let i = 0; i < 300; i++) update(game, idle(), 400, () => {});

            expect(game.player.y).toBeLessThan(VIEW_H);
            expect(game.player.onGround).toBe(true);
            expect(game.player.x).toBe(game.checkpoint);
        });

        test("does not save a checkpoint at the edge of a pit", () => {
            const game = createGame(
                levelWith({ solids: [ground(0, 100), ground(148, 252)] }),
            );
            Object.assign(game.player, { x: 88, y: GROUND_Y - 16 });

            update(game, idle(), 400, () => {});

            expect(game.player.onGround).toBe(true);
            expect(game.checkpoint).toBe(40);
        });
    });
});
