import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const capabilities = [
    {
        title: "Produto digital",
        description:
            "Traduzo problemas em fluxos simples, com atenção ao valor e ao uso.",
        diagram: "product",
    },
    {
        title: "Arquitetura",
        description:
            "Organizo responsabilidades, integrações e decisões para reduzir complexidade.",
        diagram: "architecture",
    },
    {
        title: "Interfaces",
        description:
            "Transformo regras e dados em experiências claras, rápidas e acessíveis.",
        diagram: "interface",
    },
];

const processSteps = [
    {
        title: "Ler o contexto",
        description:
            "Antes do código, entendo o problema, as pessoas e os limites do sistema.",
    },
    {
        title: "Desenhar a estrutura",
        description:
            "Organizo ideias em fluxos, responsabilidades e decisões que podem ser explicadas.",
    },
    {
        title: "Construir com clareza",
        description:
            "Transformo a estrutura em software legível, testável e pronto para evoluir.",
    },
    {
        title: "Refinar no uso",
        description:
            "Observo o que funciona, removo atrito e faço a solução amadurecer.",
    },
];

const focusNotes = [
    {
        label: "Estrutura",
        title: "Antes da solução, o mapa do problema.",
    },
    {
        label: "Sistemas",
        title: "Complexidade sob controle, sem esconder o essencial.",
    },
    {
        label: "Interfaces",
        title: "Quando a experiência explica o produto.",
    },
];

const flowSteps = [
    {
        id: "code",
        label: "Código",
        description: "A ideia ganha uma primeira forma executável.",
    },
    {
        id: "structure",
        label: "Estrutura",
        description: "Responsabilidades e relações organizam o sistema.",
    },
    {
        id: "interface",
        label: "Interface",
        description: "A lógica se torna clara para quem usa.",
    },
    {
        id: "product",
        label: "Produto",
        description: "O conjunto resolve um problema no mundo real.",
    },
];

const flowPermutations = [
    ["interface", "code", "product", "structure"],
    ["product", "structure", "code", "interface"],
    ["structure", "interface", "product", "code"],
];

function ArrowIcon({ diagonal = false }) {
    return (
        <svg
            aria-hidden="true"
            className="arrowIcon"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d={diagonal ? "M7 17 17 7M8 7h9v9" : "M5 12h14M14 7l5 5-5 5"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
            />
        </svg>
    );
}

function CapabilityDiagram({ type }) {
    if (type === "product") {
        return (
            <svg aria-hidden="true" viewBox="0 0 240 150" className="diagram">
                <circle cx="94" cy="75" r="48" />
                <circle cx="146" cy="75" r="48" strokeDasharray="5 7" />
                <circle className="diagramDot" cx="120" cy="75" r="5" />
                <path d="M120 18v114" strokeDasharray="2 9" />
            </svg>
        );
    }

    if (type === "architecture") {
        return (
            <svg aria-hidden="true" viewBox="0 0 240 150" className="diagram">
                <path d="m120 22 68 32-68 32-68-32 68-32Z" />
                <path d="m188 76-68 32-68-32" />
                <path d="m188 98-68 32-68-32" />
                <path d="M120 86v44" strokeDasharray="3 7" />
                <circle className="diagramDot" cx="120" cy="86" r="5" />
            </svg>
        );
    }

    return (
        <svg aria-hidden="true" viewBox="0 0 240 150" className="diagram">
            <rect x="56" y="49" width="82" height="72" />
            <rect x="103" y="28" width="82" height="72" strokeDasharray="5 7" />
            <path d="M38 75h164" strokeDasharray="2 9" />
            <rect
                className="diagramFill"
                x="116"
                y="68"
                width="10"
                height="10"
            />
        </svg>
    );
}

function FlowGame() {
    const [round, setRound] = useState(0);
    const [selected, setSelected] = useState([]);
    const [status, setStatus] = useState("idle");
    const [mistakes, setMistakes] = useState(0);
    const [elapsedTenths, setElapsedTenths] = useState(0);
    const [message, setMessage] = useState(
        "O cronômetro começa na primeira escolha.",
    );
    const startedAt = useRef(0);

    useEffect(() => {
        if (status !== "playing") {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setElapsedTenths(
                Math.max(
                    1,
                    Math.round((performance.now() - startedAt.current) / 100),
                ),
            );
        }, 100);

        return () => window.clearInterval(timer);
    }, [status]);

    const orderedChoices = flowPermutations[round].map((id) =>
        flowSteps.find((step) => step.id === id),
    );
    const score = Math.max(100, 1000 - mistakes * 100 - elapsedTenths * 2);

    function chooseStep(step) {
        if (status === "complete" || selected.includes(step.id)) {
            return;
        }

        const now = performance.now();

        if (status === "idle") {
            startedAt.current = now;
            setStatus("playing");
        }

        const expectedStep = flowSteps[selected.length];

        if (step.id !== expectedStep.id) {
            setMistakes((current) => current + 1);
            setMessage(
                `${step.label} entra depois. Procure a etapa ${String(selected.length + 1).padStart(2, "0")}.`,
            );
            return;
        }

        const nextSelected = [...selected, step.id];
        setSelected(nextSelected);

        if (nextSelected.length === flowSteps.length) {
            const finalTime = Math.max(
                1,
                Math.round((now - startedAt.current) / 100),
            );
            setElapsedTenths(finalTime);
            setStatus("complete");
            setMessage("Fluxo resolvido. Cada etapa preparou a próxima.");
            return;
        }

        setMessage(
            `Etapa ${String(nextSelected.length).padStart(2, "0")} certa. Continue o fluxo.`,
        );
    }

    function restartGame() {
        setRound((current) => (current + 1) % flowPermutations.length);
        setSelected([]);
        setStatus("idle");
        setMistakes(0);
        setElapsedTenths(0);
        setMessage("O cronômetro começa na primeira escolha.");
        startedAt.current = 0;
    }

    return (
        <section className="flowGame" aria-labelledby="flow-game-title">
            <div className="gameIntro">
                <h2 id="flow-game-title">Monte o fluxo.</h2>
                <p>
                    Selecione os quatro blocos na ordem em que uma ideia se
                    transforma em uma experiência útil.
                </p>

                <dl className="gameStats" aria-label="Placar da rodada">
                    <div>
                        <dt>Tempo</dt>
                        <dd>{(elapsedTenths / 10).toFixed(1)}s</dd>
                    </div>
                    <div>
                        <dt>Erros</dt>
                        <dd>{String(mistakes).padStart(2, "0")}</dd>
                    </div>
                    <div>
                        <dt>Pontos</dt>
                        <dd>{status === "complete" ? score : "—"}</dd>
                    </div>
                </dl>
            </div>

            <div
                className={`gameBoard ${status === "complete" ? "isComplete" : ""}`}
            >
                <div className="gameBoardHeader">
                    <p>Escolha a próxima etapa</p>
                    <span aria-live="polite">{message}</span>
                </div>

                <ol className="flowSlots" aria-label="Fluxo montado">
                    {flowSteps.map((step, index) => {
                        const isFilled = selected[index] === step.id;

                        return (
                            <li
                                className={isFilled ? "isFilled" : ""}
                                key={step.id}
                            >
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <strong>
                                    {isFilled ? step.label : "Aguardando"}
                                </strong>
                            </li>
                        );
                    })}
                </ol>

                <div className="gameChoices" aria-label="Etapas disponíveis">
                    {orderedChoices.map((step) => {
                        const isSelected = selected.includes(step.id);

                        return (
                            <button
                                type="button"
                                disabled={isSelected || status === "complete"}
                                onClick={() => chooseStep(step)}
                                key={step.id}
                            >
                                <span>{step.label}</span>
                                <small>{step.description}</small>
                            </button>
                        );
                    })}
                </div>

                <div className="gameBoardFooter">
                    <span>
                        {selected.length} de {flowSteps.length} etapas
                    </span>
                    <button type="button" onClick={restartGame}>
                        {status === "complete"
                            ? "Jogar novamente"
                            : "Reiniciar"}
                        <ArrowIcon />
                    </button>
                </div>
            </div>
        </section>
    );
}

function Home() {
    const designContract = `<!--
THESIS: A developer portfolio reads like a confident editorial cover and refuses the floating-card hero.
OWN-WORLD: Off-white, graphite and cobalt fields; sharp modular regions, hairline rules and exact geometric diagrams.
STORY: Visitors identify a software developer, understand three practice areas, follow a four-step approach and encounter themes worth discussing.
FIRST VIEWPORT: A thin navigation sits above a nine-column headline, right-anchored support copy, a cobalt action strip and the beginning of a dark practice section.
FORM: Category canon, editorial stack; seed key 0ca7f44b.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

    return (
        <>
            <Head>
                <title>Honda News — Desenvolvimento de Software</title>
                <meta
                    name="description"
                    content="Honda News é uma página autoral sobre desenvolvimento de software, arquitetura, produto e interfaces."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>

            <main id="top">
                <div
                    className="designContract"
                    dangerouslySetInnerHTML={{ __html: designContract }}
                />

                <header className="siteHeader">
                    <a
                        className="wordmark"
                        href="#top"
                        aria-label="Honda News, início"
                    >
                        Honda News
                        <span aria-hidden="true" className="wordmarkDot" />
                    </a>

                    <nav aria-label="Navegação principal">
                        <a href="#trabalho">Trabalho</a>
                        <a href="#sobre">Sobre</a>
                        <a href="#notas">Notas</a>
                    </nav>

                    <a className="headerAction" href="#contato">
                        <span>Contato</span>
                        <ArrowIcon diagonal />
                    </a>
                </header>

                <section className="hero" aria-labelledby="hero-title">
                    <h1 id="hero-title">
                        <span>Software</span>
                        <span className="heroSecondLine">
                            <span>com</span>{" "}
                            <span className="titleEnd">
                                contexto
                                <span className="titleDot" aria-hidden="true" />
                            </span>
                        </span>
                    </h1>

                    <p className="heroIntro">
                        Sou desenvolvedor de software. Crio produtos digitais
                        com estrutura, clareza e intenção.
                    </p>
                </section>

                <div className="actionRail">
                    <a href="#sobre" className="primaryAction">
                        Ver abordagem <ArrowIcon />
                    </a>

                    <div className="route" aria-label="Do código ao produto">
                        <span>código</span>
                        <i aria-hidden="true" />
                        <span>estrutura</span>
                        <i aria-hidden="true" />
                        <span>interface</span>
                        <i aria-hidden="true" />
                        <span>produto</span>
                    </div>
                </div>

                <section
                    id="trabalho"
                    className="capabilities"
                    aria-labelledby="work-title"
                >
                    <div className="sectionIntro darkIntro">
                        <h2 id="work-title">O que eu faço</h2>
                        <p>
                            Da primeira pergunta ao detalhe final, cada decisão
                            precisa ajudar o produto a fazer sentido.
                        </p>
                    </div>

                    <div className="capabilityGrid">
                        {capabilities.map((capability) => (
                            <article
                                className="capability"
                                key={capability.title}
                            >
                                <div>
                                    <h3>{capability.title}</h3>
                                    <p>{capability.description}</p>
                                </div>
                                <CapabilityDiagram type={capability.diagram} />
                            </article>
                        ))}
                    </div>
                </section>

                <section
                    id="sobre"
                    className="process"
                    aria-labelledby="process-title"
                >
                    <div className="sectionIntro lightIntro">
                        <h2 id="process-title">Como eu trabalho</h2>
                        <p>
                            Um processo direto para transformar contexto em
                            decisões e decisões em software.
                        </p>
                    </div>

                    <ol className="processGrid">
                        {processSteps.map((step, index) => (
                            <li key={step.title}>
                                <span className="stepNumber" aria-hidden="true">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <FlowGame />

                <section
                    id="notas"
                    className="notes"
                    aria-labelledby="notes-title"
                >
                    <div className="notesHeading">
                        <h2 id="notes-title">Ideias, sistemas e detalhes.</h2>
                        <p>
                            Temas que orientam meu olhar sobre software — sem
                            atalhos, jargão vazio ou complexidade por aparência.
                        </p>
                    </div>

                    <div className="noteIndex" aria-label="Temas em foco">
                        {focusNotes.map((note, index) => (
                            <article key={note.label}>
                                <span className="noteMeta">
                                    {String(index + 1).padStart(2, "0")} ·{" "}
                                    {note.label}
                                </span>
                                <h3>{note.title}</h3>
                                <span className="noteMark" aria-hidden="true" />
                            </article>
                        ))}
                    </div>
                </section>

                <footer id="contato" className="footer">
                    <p>Honda News</p>
                    <h2>Software bom começa com uma pergunta bem feita.</h2>
                    <a href="#top">
                        Voltar ao início <ArrowIcon diagonal />
                    </a>
                    <span className="footerNote">
                        Desenvolvimento de software · Produto · Arquitetura ·
                        Interfaces
                    </span>
                </footer>
            </main>

            <style jsx global>{`
                :root {
                    --paper: #f7f7f5;
                    --ink: #111111;
                    --blue: #2f5bff;
                    --line: #d7d9de;
                    --muted: #666a73;
                    --dark-muted: #b5b7bd;
                }

                * {
                    box-sizing: border-box;
                }

                html {
                    scroll-behavior: smooth;
                    background: var(--paper);
                }

                body {
                    margin: 0;
                    background: var(--paper);
                    color: var(--ink);
                    font-family: "Archivo", "Helvetica Neue", sans-serif;
                    font-synthesis: none;
                    text-rendering: optimizeLegibility;
                }

                a {
                    color: inherit;
                    text-decoration: none;
                }

                a:focus-visible {
                    outline: 3px solid var(--blue);
                    outline-offset: 5px;
                }

                ::selection {
                    background: var(--blue);
                    color: white;
                }

                .designContract {
                    display: contents;
                }

                .siteHeader {
                    align-items: center;
                    background: rgba(247, 247, 245, 0.96);
                    border-bottom: 1px solid var(--line);
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    min-height: 76px;
                    padding: 0 4.5vw;
                    position: relative;
                    z-index: 10;
                }

                .wordmark {
                    align-items: center;
                    display: inline-flex;
                    font-size: 1.2rem;
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    width: max-content;
                }

                .wordmarkDot {
                    background: var(--blue);
                    display: inline-block;
                    height: 6px;
                    margin-left: 8px;
                    width: 6px;
                }

                nav {
                    display: flex;
                    gap: clamp(1.75rem, 4vw, 4.5rem);
                    justify-content: center;
                }

                nav a {
                    color: #3b3d42;
                    font-size: 0.91rem;
                    position: relative;
                }

                nav a::after {
                    background: var(--ink);
                    bottom: -7px;
                    content: "";
                    height: 1px;
                    left: 0;
                    position: absolute;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 220ms ease;
                    width: 100%;
                }

                nav a:hover::after,
                nav a:focus-visible::after {
                    transform: scaleX(1);
                }

                .headerAction {
                    align-items: center;
                    border: 1px solid var(--ink);
                    display: flex;
                    font-size: 0.72rem;
                    font-weight: 650;
                    gap: 0.8rem;
                    height: 46px;
                    justify-self: end;
                    justify-content: center;
                    letter-spacing: 0.12em;
                    min-width: 124px;
                    padding: 0 1rem;
                    text-transform: uppercase;
                    transition:
                        background 180ms ease,
                        color 180ms ease;
                }

                .headerAction:hover {
                    background: var(--ink);
                    color: white;
                }

                .arrowIcon {
                    height: 20px;
                    width: 20px;
                }

                .hero {
                    display: grid;
                    grid-template-columns: repeat(12, minmax(0, 1fr));
                    min-height: clamp(390px, 44vh, 500px);
                    padding: clamp(3.5rem, 6vw, 6rem) 5.25vw
                        clamp(2.5rem, 4vw, 4rem);
                    position: relative;
                }

                .hero::before {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
                    content: "";
                    inset: 0;
                    opacity: 0.035;
                    pointer-events: none;
                    position: absolute;
                }

                .hero h1 {
                    align-self: start;
                    font-size: clamp(5rem, 8.35vw, 7.5rem);
                    font-stretch: 120%;
                    font-weight: 790;
                    grid-column: 1 / 11;
                    letter-spacing: -0.04em;
                    line-height: 0.92;
                    margin: 0;
                    max-width: none;
                    text-wrap: balance;
                }

                .hero h1 > span {
                    display: block;
                }

                .heroSecondLine {
                    position: relative;
                    width: max-content;
                }

                .titleEnd {
                    white-space: nowrap;
                }

                .titleDot {
                    background: var(--blue);
                    display: inline-block;
                    height: 0.22em;
                    margin-left: 0.08em;
                    width: 0.22em;
                }

                .heroIntro {
                    align-self: end;
                    color: #33363c;
                    font-size: clamp(1.15rem, 1.75vw, 1.65rem);
                    font-weight: 360;
                    grid-column: 9 / 13;
                    line-height: 1.3;
                    margin: 0 0 0.35rem;
                    max-width: 24ch;
                }

                .actionRail {
                    align-items: stretch;
                    background: var(--blue);
                    color: white;
                    display: grid;
                    grid-template-columns: minmax(280px, 29%) 1fr;
                    min-height: 92px;
                }

                .primaryAction {
                    align-items: center;
                    border-right: 1px solid rgba(255, 255, 255, 0.32);
                    display: flex;
                    font-size: 0.78rem;
                    font-weight: 650;
                    gap: 1.2rem;
                    justify-content: space-between;
                    letter-spacing: 0.18em;
                    padding: 0 5.25vw;
                    text-transform: uppercase;
                }

                .primaryAction .arrowIcon {
                    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
                }

                .primaryAction:hover .arrowIcon {
                    transform: translateX(8px);
                }

                .primaryAction:focus-visible,
                .footer a:focus-visible {
                    outline-color: white;
                    outline-offset: -6px;
                }

                .route {
                    align-items: center;
                    display: grid;
                    font-size: 1rem;
                    gap: clamp(0.75rem, 2vw, 2.1rem);
                    grid-template-columns: auto 1fr auto 1fr auto 1fr auto;
                    padding: 0 5.25vw;
                }

                .route i {
                    background: rgba(255, 255, 255, 0.62);
                    height: 1px;
                    overflow: visible;
                    position: relative;
                }

                .route i::after {
                    border-right: 1px solid white;
                    border-top: 1px solid white;
                    content: "";
                    height: 6px;
                    position: absolute;
                    right: 0;
                    top: -3px;
                    transform: rotate(45deg);
                    width: 6px;
                }

                .capabilities {
                    background: var(--ink);
                    color: white;
                    padding: clamp(3rem, 4vw, 4rem) 5.25vw 0;
                }

                .capabilities .sectionIntro {
                    margin-bottom: clamp(2rem, 2.5vw, 3rem);
                }

                .sectionIntro {
                    align-items: end;
                    display: grid;
                    gap: 3rem;
                    grid-template-columns: 2fr 1fr;
                    margin-bottom: clamp(3rem, 5vw, 5rem);
                }

                .sectionIntro h2,
                .notes h2,
                .footer h2 {
                    font-size: clamp(2.9rem, 5vw, 5.4rem);
                    font-stretch: 105%;
                    font-weight: 720;
                    letter-spacing: -0.04em;
                    line-height: 0.98;
                    margin: 0;
                    text-wrap: balance;
                }

                .sectionIntro p {
                    font-size: clamp(1rem, 1.35vw, 1.25rem);
                    line-height: 1.5;
                    margin: 0;
                    max-width: 33ch;
                }

                .darkIntro p {
                    color: var(--dark-muted);
                }

                .capabilityGrid {
                    border-left: 1px solid #4c4d52;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                }

                .capability {
                    border-right: 1px solid #4c4d52;
                    border-top: 1px solid #4c4d52;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 420px;
                    padding: clamp(2rem, 3.2vw, 3.75rem);
                    transition: background-color 220ms ease;
                }

                .capability:hover {
                    background: #181818;
                }

                .capability h3,
                .process h3,
                .notes h3 {
                    font-size: clamp(1.55rem, 2.3vw, 2.3rem);
                    font-weight: 520;
                    letter-spacing: -0.035em;
                    line-height: 1.05;
                    margin: 0;
                }

                .capability p {
                    color: var(--dark-muted);
                    font-size: 1rem;
                    line-height: 1.55;
                    margin: 1.1rem 0 0;
                    max-width: 29ch;
                }

                .diagram {
                    align-self: center;
                    fill: none;
                    height: auto;
                    margin-top: 3rem;
                    max-width: 260px;
                    stroke: #dfe0e4;
                    stroke-width: 1;
                    width: 74%;
                }

                .diagramDot,
                .diagramFill {
                    fill: var(--blue);
                    stroke: var(--blue);
                }

                .process {
                    padding: clamp(6rem, 10vw, 10rem) 5.25vw;
                }

                .lightIntro p {
                    color: var(--muted);
                }

                .processGrid {
                    border-left: 1px solid var(--line);
                    border-top: 1px solid var(--line);
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .processGrid li {
                    border-bottom: 1px solid var(--line);
                    border-right: 1px solid var(--line);
                    display: grid;
                    gap: 2.25rem;
                    grid-template-rows: auto 1fr;
                    min-height: 300px;
                    padding: 2rem;
                }

                .stepNumber {
                    color: var(--blue);
                    font-size: 0.82rem;
                    font-weight: 650;
                    letter-spacing: 0.08em;
                }

                .process h3 {
                    font-size: clamp(1.3rem, 1.8vw, 1.8rem);
                }

                .process li p {
                    color: var(--muted);
                    line-height: 1.55;
                    margin: 1rem 0 0;
                }

                .flowGame {
                    border-top: 1px solid var(--line);
                    display: grid;
                    gap: clamp(3rem, 6vw, 7rem);
                    grid-template-columns: 0.82fr 1.68fr;
                    padding: clamp(6rem, 10vw, 10rem) 5.25vw;
                }

                .gameIntro h2 {
                    font-size: clamp(2.9rem, 5vw, 5.4rem);
                    font-stretch: 105%;
                    font-weight: 720;
                    letter-spacing: -0.04em;
                    line-height: 0.98;
                    margin: 0;
                    max-width: 8ch;
                    text-wrap: balance;
                }

                .gameIntro > p {
                    color: var(--muted);
                    line-height: 1.55;
                    margin: 2rem 0 0;
                    max-width: 35ch;
                }

                .gameStats {
                    border-top: 1px solid var(--ink);
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    margin: clamp(3rem, 5vw, 5rem) 0 0;
                }

                .gameStats div {
                    border-bottom: 1px solid var(--line);
                    min-width: 0;
                    padding: 1.1rem 0;
                }

                .gameStats dt {
                    color: var(--muted);
                    font-size: 0.68rem;
                    font-weight: 650;
                    letter-spacing: 0.12em;
                    margin-bottom: 0.55rem;
                    text-transform: uppercase;
                }

                .gameStats dd {
                    font-size: clamp(1.15rem, 1.8vw, 1.6rem);
                    font-weight: 520;
                    letter-spacing: -0.03em;
                    margin: 0;
                }

                .gameBoard {
                    background: var(--ink);
                    color: white;
                    min-width: 0;
                    padding: clamp(1.5rem, 3vw, 3rem);
                    position: relative;
                }

                .gameBoard::after {
                    background: var(--blue);
                    content: "";
                    height: 8px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
                    width: 0;
                }

                .gameBoard.isComplete::after {
                    width: 100%;
                }

                .gameBoardHeader {
                    align-items: start;
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: 0.8fr 1.2fr;
                    margin-bottom: clamp(2rem, 4vw, 4rem);
                }

                .gameBoardHeader p {
                    font-size: 0.72rem;
                    font-weight: 650;
                    letter-spacing: 0.12em;
                    margin: 0;
                    text-transform: uppercase;
                }

                .gameBoardHeader span {
                    color: var(--dark-muted);
                    line-height: 1.45;
                    min-height: 2.9em;
                }

                .flowSlots {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    list-style: none;
                    margin: 0 0 clamp(2rem, 4vw, 4rem);
                    padding: 0;
                }

                .flowSlots li {
                    border-bottom: 1px solid #4c4d52;
                    color: #777980;
                    display: grid;
                    gap: 0.65rem;
                    min-width: 0;
                    padding: 0 0.8rem 1rem 0;
                    position: relative;
                    transition:
                        border-color 220ms ease,
                        color 220ms ease;
                }

                .flowSlots li::after {
                    background: #4c4d52;
                    bottom: -4px;
                    content: "";
                    height: 7px;
                    position: absolute;
                    right: 0;
                    width: 7px;
                }

                .flowSlots li.isFilled {
                    border-color: var(--blue);
                    color: white;
                }

                .flowSlots li.isFilled::after {
                    background: var(--blue);
                }

                .flowSlots li > span {
                    font-size: 0.68rem;
                    letter-spacing: 0.08em;
                }

                .flowSlots strong {
                    font-size: clamp(0.8rem, 1.2vw, 1rem);
                    font-weight: 520;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .gameChoices {
                    border-left: 1px solid #4c4d52;
                    border-top: 1px solid #4c4d52;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                }

                .gameChoices button {
                    align-items: start;
                    appearance: none;
                    background: transparent;
                    border: 0;
                    border-bottom: 1px solid #4c4d52;
                    border-radius: 0;
                    border-right: 1px solid #4c4d52;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    font: inherit;
                    gap: 0.7rem;
                    min-height: 132px;
                    padding: 1.4rem;
                    text-align: left;
                    transition:
                        background-color 180ms ease,
                        color 180ms ease;
                }

                .gameChoices button:hover:not(:disabled) {
                    background: var(--blue);
                }

                .gameChoices button:focus-visible,
                .gameBoardFooter button:focus-visible {
                    outline: 3px solid white;
                    outline-offset: -6px;
                }

                .gameChoices button:disabled {
                    color: #777980;
                    cursor: default;
                }

                .gameChoices button:disabled small {
                    color: #66686e;
                }

                .gameChoices button > span {
                    font-size: clamp(1.2rem, 1.8vw, 1.65rem);
                    font-weight: 520;
                    letter-spacing: -0.03em;
                }

                .gameChoices small {
                    color: var(--dark-muted);
                    font-size: 0.88rem;
                    line-height: 1.4;
                    max-width: 30ch;
                    transition: color 180ms ease;
                }

                .gameChoices button:hover:not(:disabled) small {
                    color: white;
                }

                .gameBoardFooter {
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1.5rem;
                }

                .gameBoardFooter > span {
                    color: var(--dark-muted);
                    font-size: 0.75rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .gameBoardFooter button {
                    align-items: center;
                    appearance: none;
                    background: transparent;
                    border: 1px solid #6a6c72;
                    border-radius: 0;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    font: inherit;
                    font-size: 0.72rem;
                    font-weight: 650;
                    gap: 1.25rem;
                    justify-content: space-between;
                    letter-spacing: 0.12em;
                    min-height: 48px;
                    padding: 0 1rem;
                    text-transform: uppercase;
                    transition:
                        background-color 180ms ease,
                        color 180ms ease;
                }

                .gameBoardFooter button:hover {
                    background: white;
                    color: var(--ink);
                }

                .notes {
                    border-top: 1px solid var(--line);
                    display: grid;
                    gap: clamp(3rem, 6vw, 7rem);
                    grid-template-columns: 0.9fr 1.6fr;
                    padding: clamp(6rem, 10vw, 10rem) 5.25vw;
                }

                .notesHeading p {
                    color: var(--muted);
                    line-height: 1.55;
                    margin: 2rem 0 0;
                    max-width: 38ch;
                }

                .noteIndex {
                    border-top: 1px solid var(--ink);
                }

                .noteIndex article {
                    align-items: center;
                    border-bottom: 1px solid var(--line);
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: 8rem 1fr auto;
                    min-height: 145px;
                    padding: 1.5rem 0;
                }

                .noteMeta {
                    color: var(--muted);
                    font-size: 0.72rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }

                .notes h3 {
                    font-size: clamp(1.35rem, 2vw, 2rem);
                    max-width: 27ch;
                }

                .noteMark {
                    background: var(--blue);
                    display: block;
                    height: 12px;
                    width: 12px;
                }

                .footer {
                    background: var(--blue);
                    color: white;
                    display: grid;
                    gap: 3rem;
                    grid-template-columns: 1fr auto;
                    padding: clamp(4rem, 7vw, 7rem) 5.25vw 2.5rem;
                }

                .footer > p {
                    font-size: 1rem;
                    font-weight: 650;
                    grid-column: 1 / -1;
                    margin: 0;
                }

                .footer h2 {
                    max-width: 14ch;
                }

                .footer > a {
                    align-items: center;
                    align-self: end;
                    border: 1px solid rgba(255, 255, 255, 0.72);
                    display: flex;
                    gap: 2rem;
                    min-height: 56px;
                    padding: 0 1.5rem;
                    transition:
                        background 180ms ease,
                        color 180ms ease;
                }

                .footer > a:hover {
                    background: white;
                    color: var(--blue);
                }

                .footerNote {
                    border-top: 1px solid rgba(255, 255, 255, 0.35);
                    font-size: 0.76rem;
                    grid-column: 1 / -1;
                    letter-spacing: 0.08em;
                    padding-top: 1.5rem;
                    text-transform: uppercase;
                }

                @keyframes titleReveal {
                    from {
                        clip-path: inset(0 0 100% 0);
                        filter: blur(5px);
                        transform: translateY(18px);
                    }
                    to {
                        clip-path: inset(0 0 0 0);
                        filter: blur(0);
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: no-preference) {
                    .heroSecondLine {
                        animation: titleReveal 800ms
                            cubic-bezier(0.16, 1, 0.3, 1) 100ms both;
                    }
                }

                @media (max-width: 980px) {
                    .hero {
                        min-height: 540px;
                    }

                    .hero h1 {
                        grid-column: 1 / 11;
                    }

                    .heroIntro {
                        grid-column: 8 / 13;
                    }

                    .route {
                        font-size: 0.85rem;
                        gap: 0.8rem;
                    }

                    .capability {
                        min-height: 370px;
                    }

                    .processGrid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .notes {
                        grid-template-columns: 1fr;
                    }

                    .flowGame {
                        grid-template-columns: 1fr;
                    }

                    .gameIntro {
                        display: grid;
                        gap: 2rem;
                        grid-template-columns: 1fr 1fr;
                    }

                    .gameIntro > p,
                    .gameStats {
                        margin-top: 0;
                    }

                    .gameStats {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 720px) {
                    .siteHeader {
                        grid-template-columns: 1fr auto;
                        min-height: 68px;
                        padding: 0 1.25rem;
                    }

                    nav {
                        display: none;
                    }

                    .headerAction {
                        height: 44px;
                        min-width: 112px;
                    }

                    .hero {
                        display: block;
                        min-height: 580px;
                        padding: 4rem 1.25rem 3rem;
                    }

                    .hero h1 {
                        font-size: clamp(3.55rem, 16vw, 5rem);
                        line-height: 0.93;
                    }

                    .heroSecondLine {
                        width: auto;
                    }

                    .heroIntro {
                        font-size: 1.25rem;
                        margin-top: 5rem;
                        max-width: 24ch;
                    }

                    .actionRail {
                        display: flex;
                        flex-direction: column;
                    }

                    .primaryAction {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.32);
                        border-right: 0;
                        min-height: 76px;
                        padding: 0 1.25rem;
                    }

                    .route {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.55rem;
                        justify-content: space-between;
                        min-height: 88px;
                        padding: 1.25rem;
                    }

                    .route i {
                        flex: 1;
                        min-width: 20px;
                    }

                    .capabilities,
                    .process,
                    .flowGame,
                    .notes {
                        padding-left: 1.25rem;
                        padding-right: 1.25rem;
                    }

                    .sectionIntro {
                        align-items: start;
                        grid-template-columns: 1fr;
                    }

                    .sectionIntro h2,
                    .gameIntro h2,
                    .notes h2,
                    .footer h2 {
                        font-size: clamp(2.8rem, 13vw, 4.5rem);
                    }

                    .gameIntro {
                        display: block;
                    }

                    .gameIntro > p {
                        margin-top: 1.5rem;
                    }

                    .gameStats {
                        margin-top: 2.5rem;
                    }

                    .gameBoard {
                        margin-left: -1.25rem;
                        margin-right: -1.25rem;
                        padding: 2rem 1.25rem;
                    }

                    .gameBoardHeader {
                        grid-template-columns: 1fr;
                    }

                    .flowSlots {
                        grid-template-columns: repeat(2, 1fr);
                        row-gap: 1.5rem;
                    }

                    .gameChoices {
                        grid-template-columns: 1fr;
                    }

                    .gameChoices button {
                        min-height: 112px;
                    }

                    .gameBoardFooter {
                        align-items: stretch;
                        flex-direction: column;
                        gap: 1.25rem;
                    }

                    .gameBoardFooter button {
                        width: 100%;
                    }

                    .capabilityGrid {
                        grid-template-columns: 1fr;
                    }

                    .capability {
                        min-height: 360px;
                    }

                    .processGrid {
                        grid-template-columns: 1fr;
                    }

                    .processGrid li {
                        gap: 1.5rem;
                        grid-template-columns: 3.5rem 1fr;
                        grid-template-rows: auto;
                        min-height: 0;
                        padding: 1.5rem;
                    }

                    .noteIndex article {
                        align-items: start;
                        grid-template-columns: 1fr auto;
                    }

                    .noteMeta {
                        grid-column: 1 / -1;
                    }

                    .footer {
                        grid-template-columns: 1fr;
                        padding-left: 1.25rem;
                        padding-right: 1.25rem;
                    }

                    .footer > p,
                    .footerNote {
                        grid-column: 1;
                    }

                    .footer > a {
                        justify-content: space-between;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    html {
                        scroll-behavior: auto;
                    }

                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </>
    );
}

export default Home;
