import { useEffect, useRef, useState } from "react";
import { buildLevel, createGame, render, update, VIEW_H } from "./engine.js";

const STEP_MS = 1000 / 60;
const KEYS = {
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
    ArrowUp: "jump",
    KeyW: "jump",
    Space: "jump",
};

const pad = (n) => String(n).padStart(2, "0");

function press(input, key, pressed) {
    if (pressed && key === "jump" && !input.jump) input.jumpPressed = true;
    input[key] = pressed;
}

export default function CareerGame({ stops, skills, intro }) {
    const frameRef = useRef(null);
    const canvasRef = useRef(null);
    const inputRef = useRef({ left: false, right: false, jump: false });
    const statusRef = useRef("idle");
    const [status, setStatus] = useState("idle");
    const [stop, setStop] = useState(null);
    const [hud, setHud] = useState({ coins: 0, bugs: 0, year: null });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const game = createGame(buildLevel(stops, skills));
        let shown = {};
        let dirty = true;
        let last = performance.now();
        let lag = 0;
        let raf = 0;

        // Phones get bigger pixels (and a narrower view) so the art stays readable.
        function fit() {
            const width = frameRef.current.clientWidth;
            const scale = width < 560 ? 1.5 : width / 400;
            canvas.width = Math.round(width / scale);
            canvas.height = VIEW_H;
            dirty = true;
        }

        function loop(now) {
            lag = Math.min(lag + now - last, 250);
            last = now;
            while (lag >= STEP_MS) {
                if (statusRef.current === "playing") {
                    update(game, inputRef.current, canvas.width, setStop);
                    dirty = true;
                }
                lag -= STEP_MS;
            }
            if (dirty) {
                render(ctx, game, canvas.width);
                dirty = false;
            }
            const next = {
                coins: game.coinsTaken,
                bugs: game.bugsFixed,
                year: game.year,
            };
            if (
                next.coins !== shown.coins ||
                next.bugs !== shown.bugs ||
                next.year !== shown.year
            ) {
                shown = next;
                setHud(next);
            }
            raf = requestAnimationFrame(loop);
        }

        fit();
        document.fonts?.ready.then(() => (dirty = true));
        window.addEventListener("resize", fit);
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", fit);
        };
    }, [stops, skills]);

    function changeStatus(next) {
        statusRef.current = next;
        setStatus(next);
    }

    function start() {
        changeStatus("playing");
        frameRef.current.focus({ preventScroll: true });
        frameRef.current.scrollIntoView({ block: "start" });
    }

    function pause() {
        if (statusRef.current !== "playing") return;
        inputRef.current = { left: false, right: false, jump: false };
        changeStatus("paused");
    }

    function handleKey(event, pressed) {
        if (statusRef.current !== "playing") {
            if (pressed && (event.code === "Enter" || event.code === "Space")) {
                event.preventDefault();
                start();
            }
            return;
        }
        if (pressed && event.code === "Escape") return pause();
        const key = KEYS[event.code];
        if (!key) return;
        event.preventDefault();
        press(inputRef.current, key, pressed);
    }

    function touch(key, pressed) {
        return (event) => {
            event.preventDefault();
            press(inputRef.current, key, pressed);
        };
    }

    function touchButton(key, label, glyph) {
        return (
            <button
                type="button"
                tabIndex={-1}
                aria-label={label}
                className="touchButton"
                onPointerDown={touch(key, true)}
                onPointerUp={touch(key, false)}
                onPointerLeave={touch(key, false)}
                onPointerCancel={touch(key, false)}
                onContextMenu={(event) => event.preventDefault()}
            >
                {glyph}
            </button>
        );
    }

    return (
        <div
            className="game"
            ref={frameRef}
            tabIndex={0}
            role="application"
            aria-label="Jogo de plataforma com a carreira de Guilherme Honda"
            aria-describedby="game-help"
            onKeyDown={(event) => handleKey(event, true)}
            onKeyUp={(event) => handleKey(event, false)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) pause();
            }}
        >
            <div className="screen">
                <canvas
                    ref={canvasRef}
                    className="canvas"
                    width={400}
                    height={VIEW_H}
                />
                <div className="hud" aria-hidden="true">
                    <div>
                        <span>GUILHERME</span>
                        <span>DEV .NET</span>
                    </div>
                    <div>
                        <span>MOEDAS</span>
                        <span>
                            {pad(hud.coins)}/{pad(skills.length)}
                        </span>
                    </div>
                    <div>
                        <span>BUGS</span>
                        <span>{pad(hud.bugs)}</span>
                    </div>
                    <div>
                        <span>ANO</span>
                        <span>{hud.year}</span>
                    </div>
                </div>

                {status === "playing" ? (
                    <div className="touchControls">
                        <div>
                            {touchButton("left", "Andar para a esquerda", "◀")}
                            {touchButton("right", "Andar para a direita", "▶")}
                        </div>
                        {touchButton("jump", "Pular", "A")}
                    </div>
                ) : (
                    <div className="overlay">
                        <p className="overlayTitle">
                            {status === "paused" ? "PAUSADO" : "FASE 1-1"}
                        </p>
                        <p className="overlaySub">
                            {status === "paused"
                                ? "Seu progresso foi mantido"
                                : "Uma carreira em 8 bits"}
                        </p>
                        <button
                            type="button"
                            className="startButton"
                            onClick={start}
                        >
                            {status === "paused" ? "Continuar" : "Jogar"}
                        </button>
                    </div>
                )}
            </div>

            <section className="dialog" aria-live="polite">
                {stop ? (
                    <>
                        <p className="dialogMeta">{stop.period}</p>
                        <h2 className="dialogTitle">{stop.title}</h2>
                        <p className="dialogOrg">{stop.org}</p>
                        {stop.details.length > 0 && (
                            <ul className="dialogList">
                                {stop.details.map((detail) => (
                                    <li key={detail}>{detail}</li>
                                ))}
                            </ul>
                        )}
                        {stop.links && (
                            <ul className="dialogLinks">
                                {stop.links.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href}>{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : (
                    intro
                )}
            </section>
        </div>
    );
}
