// Pure game logic and drawing for the career platformer. No React here, so it can be unit-tested.

export const TILE = 16;
export const VIEW_H = 225;
export const GROUND_Y = VIEW_H - 2 * TILE;

const STOP_GAP = 240;
const FIRST_STOP_X = 220;
const BLOCK_Y = GROUND_Y - 5 * TILE;
const SPAWN_X = 40;

const GRAVITY = 0.45;
const JUMP_SPEED = 7.6;
const SHORT_HOP_SPEED = 3;
const MAX_FALL = 8;
const RUN_SPEED = 2.2;
const ACCEL = 0.22;
const FRICTION = 0.25;
const BUG_SPEED = 0.5;
const GRACE_FRAMES = 6; // coyote time and jump buffer
const HURT_FRAMES = 60;

const C = {
    sky: "#6b8cff",
    ink: "#14101e",
    white: "#ffffff",
    coin: "#f8d030",
    coinEdge: "#a05a00",
    dirt: "#b5532a",
    dirtDark: "#5a2410",
    grass: "#3cb043",
    grassDark: "#1f6e2a",
    brick: "#c0602f",
    mortar: "#4a1e0a",
    question: "#f6b40e",
    questionShine: "#ffd25a",
    questionEdge: "#7a3e00",
    used: "#a0603a",
    usedEdge: "#4a2410",
    github: "#8250df",
    githubEdge: "#2d1160",
    pipe: "#1fa83a",
    pipeLight: "#7ee08a",
    pipeDark: "#0b5d1e",
    pipeEdge: "#06300f",
    stone: "#9e9e9e",
    stoneEdge: "#5c5c5c",
    hill: "#3a9d55",
    bush: "#57c74b",
    cloudShade: "#c8d8ff",
    flag: "#1565c0",
    pole: "#e8f5e9",
    door: "#1a0d06",
};

const HEAD = [
    "...HHHHH....",
    "..HHHHHHHH..",
    "..HHHSSSSS..",
    "..HHSGGSGG..",
    "..HSSSSSSS..",
    "...SSSSSS...",
];
const TORSO = [
    "....SSSS....",
    "..BBBBBBBB..",
    ".BBBBBBBBBB.",
    ".SBBBBBBBBS.",
    ".SBDDDDDDBS.",
    "..BBBBBBBB..",
];
const PLAYER = {
    stand: [
        ...HEAD,
        ...TORSO,
        "..PPPPPPPP..",
        "..PPP..PPP..",
        "..PPP..PPP..",
        ".KKKK..KKKK.",
    ],
    walkA: [
        ...HEAD,
        ...TORSO,
        "..PPPPPPPP..",
        ".PPP....PPP.",
        ".PP......PP.",
        "KKK......KKK",
    ],
    walkB: [
        ...HEAD,
        ...TORSO,
        "..PPPPPPPP..",
        "...PPPPPP...",
        "...PPP.PP...",
        "..KKKK.KKK..",
    ],
    jump: [
        ...HEAD,
        "S...SSSS...S",
        "SBBBBBBBBBBS",
        ".BBBBBBBBBB.",
        "..BBBBBBBB..",
        "..BDDDDDDB..",
        "..BBBBBBBB..",
        "..PPPPPPPP..",
        ".PPP...PPPP.",
        ".KKK....KKK.",
        "............",
    ],
};
const PLAYER_PALETTE = {
    H: "#2a1a10",
    S: "#f0c088",
    G: "#1b1b1b",
    B: "#1565c0",
    D: "#0d3c80",
    P: "#2b2f3a",
    K: "#111111",
};

const BUG_BODY = [
    "..K......K..",
    "...K....K...",
    "...RRRRRR...",
    "..RWKRRWKR..",
    ".RRRRRRRRRR.",
    ".RKRRKKRRKR.",
    ".RRRRRRRRRR.",
    "..RRRRRRRR..",
];
const BUG = [
    [...BUG_BODY, "..K.K..K.K..", "............"],
    [...BUG_BODY, ".K..K..K..K.", "............"],
];
const BUG_PALETTE = { K: C.ink, R: "#e53935", W: C.white };

const QMARK = [".###.", "#...#", "....#", "..##.", "..#..", ".....", "..#.."];

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function overlaps(a, b) {
    return (
        a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
}

function solidAt(solids, x, y) {
    return solids.some((s) => overlaps({ x, y, w: 1, h: 1 }, s));
}

function closestTo(body, solids) {
    const center = body.x + body.w / 2;
    const distance = (s) => Math.abs(s.x + s.w / 2 - center);
    return solids.reduce((best, s) =>
        distance(s) < distance(best) ? s : best,
    );
}

// Axis-separated move: horizontal first, then vertical, snapping to the touched edges.
export function moveAndCollide(body, solids) {
    const next = { ...body, x: body.x + body.vx, onGround: false };
    let hitWall = false;
    let bumped = null;
    let landedOn = null;

    const sideHits = solids.filter((s) => overlaps(next, s));
    if (sideHits.length) {
        next.x =
            body.vx > 0
                ? Math.min(...sideHits.map((s) => s.x)) - next.w
                : Math.max(...sideHits.map((s) => s.x + s.w));
        next.vx = 0;
        hitWall = true;
    }

    next.y += next.vy;
    const verticalHits = solids.filter((s) => overlaps(next, s));
    if (verticalHits.length) {
        if (body.vy < 0) {
            next.y = Math.max(...verticalHits.map((s) => s.y + s.h));
            bumped = closestTo(next, verticalHits);
        } else {
            next.y = Math.min(...verticalHits.map((s) => s.y)) - next.h;
            next.onGround = true;
            landedOn = closestTo(next, verticalHits);
        }
        next.vy = 0;
    }

    return { body: next, hitWall, bumped, landedOn };
}

// Lays the career out left to right: pipes for education, ? blocks for everything else,
// a flag and a castle for the contact stop, one coin per skill between stops.
export function buildLevel(stops, skills) {
    const solids = [];
    const labels = [];
    const bugs = [];
    const pits = [];
    let flag = null;
    let castle = null;

    stops.forEach((stop, i) => {
        const x = FIRST_STOP_X + i * STOP_GAP;
        let top = BLOCK_Y;

        if (stop.kind === "education") {
            const h = i % 2 ? 3 * TILE : 2 * TILE;
            top = GROUND_Y - h;
            solids.push({
                type: "pipe",
                x: x - TILE,
                y: top,
                w: 2 * TILE,
                h,
                stop,
            });
        } else if (stop.kind === "contact") {
            top = GROUND_Y - 9 * TILE;
            solids.push({
                type: "stone",
                x: x - 8,
                y: GROUND_Y - TILE,
                w: TILE,
                h: TILE,
            });
            flag = { x: x - 1, y: top, w: 2, h: GROUND_Y - TILE - top, stop };
            castle = { x: x + 6 * TILE, y: GROUND_Y - 5 * TILE };
        } else {
            const type = stop.kind === "github" ? "github" : "question";
            solids.push(
                { type: "brick", x: x - 24, y: BLOCK_Y, w: TILE, h: TILE },
                { type, x: x - 8, y: BLOCK_Y, w: TILE, h: TILE, stop },
                { type: "brick", x: x + 8, y: BLOCK_Y, w: TILE, h: TILE },
            );
        }

        labels.push({ x, y: top - 8, text: stop.label, year: stop.year });
        if (i % 3 === 2) pits.push(x + 100);
        if (i % 3 === 0 && i > 0) {
            bugs.push({ x: x + 170, y: GROUND_Y - 10, w: 12, h: 10, dir: -1 });
        }
    });

    const coins = skills.map((label, i) => ({
        x: FIRST_STOP_X + i * STOP_GAP + 116,
        y: GROUND_Y - (i % 2 ? 56 : 36),
        w: 8,
        h: 12,
        label,
    }));

    const worldW = FIRST_STOP_X + stops.length * STOP_GAP + 8 * TILE;
    let start = 0;
    for (const pitX of pits) {
        solids.push({
            type: "ground",
            x: start,
            y: GROUND_Y,
            w: pitX - start,
            h: 2 * TILE,
        });
        start = pitX + 3 * TILE;
    }
    solids.push({
        type: "ground",
        x: start,
        y: GROUND_Y,
        w: worldW - start,
        h: 2 * TILE,
    });

    return { solids, labels, bugs, coins, flag, castle, worldW };
}

export function createGame(level) {
    return {
        ...level,
        bugs: level.bugs.map((b) => ({
            vx: 0,
            vy: 0,
            alive: true,
            active: false,
            squash: 0,
            ...b,
        })),
        coins: level.coins.map((c) => ({ ...c, taken: false })),
        flag: level.flag && { ...level.flag, drop: 0 },
        player: {
            x: SPAWN_X,
            y: GROUND_Y - 16,
            w: 10,
            h: 16,
            vx: 0,
            vy: 0,
            onGround: false,
            facing: 1,
            coyote: 0,
            jumpBuffer: 0,
            hurt: 0,
        },
        camX: 0,
        tick: 0,
        coinsTaken: 0,
        bugsFixed: 0,
        checkpoint: SPAWN_X,
        popups: [],
        finished: false,
        current: null,
        year: level.labels.find((l) => l.year)?.year ?? null,
    };
}

function popup(game, x, y, text) {
    game.popups.push({ x, y, text, ttl: 50 });
}

export function update(game, input, viewW, onStop) {
    const p = game.player;
    const show = (stop) => {
        game.current = stop;
        onStop(stop);
    };
    game.tick += 1;

    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const inControl = p.hurt <= HURT_FRAMES - 20;
    if (inControl && dir) {
        p.vx = clamp(p.vx + dir * ACCEL, -RUN_SPEED, RUN_SPEED);
        p.facing = dir;
    } else if (inControl) {
        p.vx = Math.sign(p.vx) * Math.max(0, Math.abs(p.vx) - FRICTION);
    }

    p.jumpBuffer = input.jumpPressed
        ? GRACE_FRAMES
        : Math.max(0, p.jumpBuffer - 1);
    input.jumpPressed = false;
    p.coyote = p.onGround ? GRACE_FRAMES : Math.max(0, p.coyote - 1);
    if (p.jumpBuffer && p.coyote) {
        p.vy = -JUMP_SPEED;
        p.jumpBuffer = 0;
        p.coyote = 0;
    }
    if (!input.jump && p.vy < -SHORT_HOP_SPEED) p.vy = -SHORT_HOP_SPEED;
    p.vy = Math.min(p.vy + GRAVITY, MAX_FALL);

    const prevBottom = p.y + p.h;
    const moved = moveAndCollide(p, game.solids);
    Object.assign(p, moved.body);
    p.x = clamp(p.x, 0, game.worldW - p.w);
    p.hurt = Math.max(0, p.hurt - 1);

    if (moved.bumped) {
        moved.bumped.bounce = 8;
        if (moved.bumped.stop) {
            moved.bumped.used = true;
            show(moved.bumped.stop);
        }
    }
    if (moved.landedOn) {
        // Only save spots with a tile of ground on both sides, so a respawn never starts on a ledge.
        const feet = p.y + p.h + 1;
        const safe =
            solidAt(game.solids, p.x - TILE, feet) &&
            solidAt(game.solids, p.x + p.w + TILE, feet);
        if (safe) game.checkpoint = p.x;
        const stop = moved.landedOn.stop;
        if (stop && stop !== game.current) show(stop);
    }
    if (p.y > VIEW_H + 32) {
        Object.assign(p, {
            x: game.checkpoint,
            y: -p.h,
            vx: 0,
            vy: 0,
            hurt: HURT_FRAMES,
        });
    }

    for (const bug of game.bugs) {
        if (!bug.alive) {
            bug.squash = Math.max(0, bug.squash - 1);
            continue;
        }
        if (!bug.active) {
            if (bug.x > game.camX + viewW + TILE) continue;
            bug.active = true;
        }
        bug.vx = bug.dir * BUG_SPEED;
        bug.vy = Math.min(bug.vy + GRAVITY, MAX_FALL);
        const result = moveAndCollide(bug, game.solids);
        Object.assign(bug, result.body);
        const ahead = bug.dir > 0 ? bug.x + bug.w + 1 : bug.x - 1;
        const ledge =
            bug.onGround && !solidAt(game.solids, ahead, bug.y + bug.h + 1);
        if (result.hitWall || ledge) bug.dir *= -1;
        if (bug.y > VIEW_H) bug.alive = false;

        if (!bug.alive || !overlaps(p, bug)) continue;
        if (prevBottom <= bug.y + 6) {
            bug.alive = false;
            bug.squash = 30;
            p.vy = -5;
            game.bugsFixed += 1;
            popup(game, bug.x + 6, bug.y, "BUG CORRIGIDO!");
        } else if (!p.hurt) {
            p.hurt = HURT_FRAMES;
            p.vx = p.x < bug.x ? -2.5 : 2.5;
            p.vy = -4;
            popup(game, p.x + 5, p.y, "BUG!");
        }
    }

    for (const coin of game.coins) {
        if (coin.taken || !overlaps(p, coin)) continue;
        coin.taken = true;
        game.coinsTaken += 1;
        popup(game, coin.x + 4, coin.y, coin.label);
    }

    if (game.flag && !game.finished && overlaps(p, game.flag)) {
        game.finished = true;
        show(game.flag.stop);
        popup(game, game.flag.x, game.flag.y + 24, "FIM DE FASE!");
    }
    if (game.finished && game.flag.drop < game.flag.h - 12) game.flag.drop += 2;

    for (const s of game.solids) if (s.bounce) s.bounce -= 1;
    for (const pp of game.popups) {
        pp.ttl -= 1;
        pp.y -= 0.4;
    }
    game.popups = game.popups.filter((pp) => pp.ttl > 0);

    game.camX = clamp(p.x - viewW * 0.4, 0, Math.max(0, game.worldW - viewW));
    for (const label of game.labels) {
        if (label.year && label.x <= p.x + 40) game.year = label.year;
    }
}

function drawSprite(ctx, rows, palette, x, y, flip) {
    rows.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
            const color = palette[row[c]];
            if (!color) continue;
            ctx.fillStyle = color;
            ctx.fillRect(x + (flip ? row.length - 1 - c : c), y + r, 1, 1);
        }
    });
}

function drawBitmap(ctx, rows, x, y, color) {
    ctx.fillStyle = color;
    rows.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
            if (row[c] === "#") ctx.fillRect(x + c, y + r, 1, 1);
        }
    });
}

function drawText(ctx, text, x, y, color) {
    ctx.fillStyle = C.ink;
    ctx.fillText(text, x + 1, y + 1);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function drawDome(ctx, cx, baseY, r, color) {
    ctx.fillStyle = color;
    for (let row = 0; row < r; row += 2) {
        const h = r - row;
        const half = Math.round(Math.sqrt(r * r - h * h));
        ctx.fillRect(cx - half, baseY - h, half * 2, 2);
    }
}

function drawCloud(ctx, x, y) {
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 10, y, 14, 4);
    ctx.fillRect(x + 4, y + 3, 30, 6);
    ctx.fillRect(x, y + 8, 40, 6);
    ctx.fillStyle = C.cloudShade;
    ctx.fillRect(x + 2, y + 13, 36, 2);
}

function drawScenery(ctx, game, cam, viewW) {
    for (
        let k = Math.floor((cam * 0.25) / 230) - 1;
        k * 230 < cam * 0.25 + viewW;
        k++
    ) {
        drawCloud(ctx, Math.round(k * 230 - cam * 0.25), 28 + ((k * 37) % 36));
    }
    for (
        let k = Math.floor((cam * 0.5) / 420) - 1;
        k * 420 < cam * 0.5 + viewW + 60;
        k++
    ) {
        drawDome(
            ctx,
            Math.round(k * 420 + 60 - cam * 0.5),
            GROUND_Y,
            k % 2 ? 28 : 44,
            C.hill,
        );
    }
    for (let k = Math.floor(cam / 300) - 1; k * 300 < cam + viewW + 40; k++) {
        const x = k * 300 + 150 + ((k * 97) % 80);
        if (!solidAt(game.solids, x, GROUND_Y + 1)) continue;
        drawDome(ctx, x - cam, GROUND_Y, 14, C.bush);
    }
}

function drawGroundTile(ctx, x, y, w, isTop) {
    ctx.fillStyle = C.dirt;
    ctx.fillRect(x, y, w, TILE);
    ctx.fillStyle = C.dirtDark;
    ctx.fillRect(x, y + 15, w, 1);
    ctx.fillRect(x, y + 7, w, 1);
    if (w > 15) ctx.fillRect(x + 15, y, 1, TILE);
    if (w > 7) ctx.fillRect(x + 7, y + 8, 1, 7);
    if (!isTop) return;
    ctx.fillStyle = C.grass;
    ctx.fillRect(x, y, w, 4);
    ctx.fillStyle = C.grassDark;
    ctx.fillRect(x, y + 4, w, 1);
    if (w > 12) ctx.fillRect(x + 4, y + 5, 2, 1);
}

function drawBrick(ctx, x, y) {
    ctx.fillStyle = C.brick;
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = C.mortar;
    ctx.fillRect(x, y + 7, TILE, 1);
    ctx.fillRect(x, y + 15, TILE, 1);
    ctx.fillRect(x + 4, y, 1, 7);
    ctx.fillRect(x + 12, y + 8, 1, 7);
}

function drawBlock(ctx, x, y, fill, edge, withGlyph) {
    ctx.fillStyle = edge;
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = fill;
    ctx.fillRect(x + 1, y + 1, 14, 14);
    ctx.fillStyle = edge;
    for (const [dx, dy] of [
        [2, 2],
        [13, 2],
        [2, 13],
        [13, 13],
    ]) {
        ctx.fillRect(x + dx, y + dy, 1, 1);
    }
    if (withGlyph) drawBitmap(ctx, QMARK, x + 5, y + 4, edge);
}

function drawPipe(ctx, x, y, w, h) {
    const rim = 12;
    ctx.fillStyle = C.pipeEdge;
    ctx.fillRect(x + 2, y + rim, w - 4, h - rim);
    ctx.fillRect(x, y, w, rim);
    ctx.fillStyle = C.pipe;
    ctx.fillRect(x + 3, y + rim, w - 6, h - rim);
    ctx.fillRect(x + 1, y + 1, w - 2, rim - 2);
    ctx.fillStyle = C.pipeLight;
    ctx.fillRect(x + 6, y + rim, 3, h - rim);
    ctx.fillRect(x + 4, y + 1, 3, rim - 2);
    ctx.fillStyle = C.pipeDark;
    ctx.fillRect(x + w - 10, y + rim, 4, h - rim);
    ctx.fillRect(x + w - 8, y + 1, 4, rim - 2);
}

function drawSolid(ctx, s, sx, tick, viewW) {
    const lift = s.bounce
        ? Math.round(Math.sin((s.bounce / 8) * Math.PI) * 4)
        : 0;
    const y = s.y - lift;
    if (s.type === "ground") {
        for (let tx = 0; tx < s.w; tx += TILE) {
            const x = sx + tx;
            if (x < -TILE || x > viewW) continue;
            const w = Math.min(TILE, s.w - tx);
            drawGroundTile(ctx, x, s.y, w, true);
            drawGroundTile(ctx, x, s.y + TILE, w, false);
        }
    } else if (s.type === "pipe") {
        drawPipe(ctx, sx, s.y, s.w, s.h);
    } else if (s.type === "brick") {
        drawBrick(ctx, sx, y);
    } else if (s.type === "stone") {
        drawBlock(ctx, sx, y, C.stone, C.stoneEdge, false);
    } else if (s.type === "github") {
        drawBlock(
            ctx,
            sx,
            y,
            s.used ? C.githubEdge : C.github,
            s.used ? C.ink : C.githubEdge,
            !s.used,
        );
    } else if (s.used) {
        drawBlock(ctx, sx, y, C.used, C.usedEdge, false);
    } else {
        const shine = tick % 60 >= 45;
        drawBlock(
            ctx,
            sx,
            y,
            shine ? C.questionShine : C.question,
            C.questionEdge,
            true,
        );
    }
}

function drawCastle(ctx, x, y) {
    for (let ty = 0; ty < 3; ty++) {
        for (let tx = 0; tx < 5; tx++)
            drawBrick(ctx, x + tx * TILE, y + 32 + ty * TILE);
    }
    for (let ty = 0; ty < 2; ty++) {
        for (let tx = 1; tx < 4; tx++)
            drawBrick(ctx, x + tx * TILE, y + ty * TILE);
    }
    ctx.fillStyle = C.brick;
    for (const tx of [0, 4]) ctx.fillRect(x + tx * TILE + 3, y + 26, 10, 6);
    for (const tx of [1, 2, 3]) ctx.fillRect(x + tx * TILE + 3, y - 6, 10, 6);
    ctx.fillStyle = C.door;
    ctx.fillRect(x + 32, y + 56, 16, 24);
    ctx.fillRect(x + 34, y + 53, 12, 3);
    ctx.fillRect(x + 36, y + 8, 8, 12);
}

function drawFlag(ctx, flag, cam) {
    const px = flag.x - cam;
    ctx.fillStyle = C.pole;
    ctx.fillRect(px, flag.y, 2, flag.h);
    ctx.fillStyle = C.grass;
    ctx.fillRect(px - 2, flag.y - 6, 6, 6);
    ctx.fillStyle = C.flag;
    const top = flag.y + 4 + flag.drop;
    for (let r = 0; r < 12; r++) {
        const w = Math.round(18 * (1 - Math.abs(r - 5.5) / 6));
        ctx.fillRect(px - w, top + r, w, 1);
    }
}

function drawCoin(ctx, coin, cam, tick) {
    const w = [8, 6, 2, 6][Math.floor(tick / 8) % 4];
    const x = Math.round(coin.x - cam + (8 - w) / 2);
    ctx.fillStyle = C.coinEdge;
    ctx.fillRect(x, coin.y, w, 12);
    ctx.fillStyle = C.coin;
    if (w > 2) ctx.fillRect(x + 1, coin.y + 1, w - 2, 10);
    ctx.fillStyle = C.white;
    if (w > 4) ctx.fillRect(x + 2, coin.y + 2, 1, 4);
}

export function render(ctx, game, viewW) {
    const cam = Math.round(game.camX);
    const visible = (x, w) => x + w > cam - TILE && x < cam + viewW + TILE;
    ctx.fillStyle = C.sky;
    ctx.fillRect(0, 0, viewW, VIEW_H);
    drawScenery(ctx, game, cam, viewW);

    if (game.castle && visible(game.castle.x, 80)) {
        drawCastle(ctx, game.castle.x - cam, game.castle.y);
    }
    if (game.flag && visible(game.flag.x, 20)) drawFlag(ctx, game.flag, cam);

    for (const s of game.solids) {
        if (visible(s.x, s.w)) drawSolid(ctx, s, s.x - cam, game.tick, viewW);
    }

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    for (const label of game.labels) {
        if (!visible(label.x - 48, 96)) continue;
        drawText(ctx, label.text, label.x - cam, label.y, C.white);
        if (label.year)
            drawText(
                ctx,
                String(label.year),
                label.x - cam,
                label.y - 12,
                C.coin,
            );
    }

    for (const coin of game.coins) {
        if (!coin.taken && visible(coin.x, coin.w))
            drawCoin(ctx, coin, cam, game.tick);
    }

    for (const bug of game.bugs) {
        const x = Math.round(bug.x - cam);
        if (bug.alive && bug.active) {
            const frame = BUG[Math.floor(game.tick / 10) % 2];
            drawSprite(
                ctx,
                frame,
                BUG_PALETTE,
                x,
                Math.round(bug.y),
                bug.dir > 0,
            );
        } else if (bug.squash) {
            ctx.fillStyle = BUG_PALETTE.R;
            ctx.fillRect(x, Math.round(bug.y) + bug.h - 3, bug.w, 3);
            ctx.fillStyle = C.ink;
            ctx.fillRect(x + 3, Math.round(bug.y) + bug.h - 2, 2, 1);
            ctx.fillRect(x + 7, Math.round(bug.y) + bug.h - 2, 2, 1);
        }
    }

    const p = game.player;
    if (!p.hurt || game.tick % 6 < 3) {
        let frame = "stand";
        if (!p.onGround) frame = "jump";
        else if (Math.abs(p.vx) > 0.3)
            frame = Math.floor(game.tick / 6) % 2 ? "walkA" : "walkB";
        drawSprite(
            ctx,
            PLAYER[frame],
            PLAYER_PALETTE,
            Math.round(p.x - cam) - 1,
            Math.round(p.y),
            p.facing < 0,
        );
    }

    for (const pp of game.popups) {
        drawText(
            ctx,
            pp.text,
            Math.round(pp.x - cam),
            Math.round(pp.y),
            C.white,
        );
    }
}
