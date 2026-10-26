import Head from "next/head";
import CareerGame from "components/careerGame";

const contacts = [
    {
        label: "E-mail",
        href: "mailto:guilhermehonda@gmail.com",
        text: "guilhermehonda@gmail.com",
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/guilherme-honda",
        text: "linkedin.com/in/guilherme-honda",
    },
    {
        label: "GitHub",
        href: "https://github.com/ghonda",
        text: "github.com/ghonda",
    },
];

const repositories = [
    {
        href: "https://github.com/ghonda/hondanews.com",
        text: "hondanews.com",
        note: "JavaScript · este site",
    },
    {
        href: "https://github.com/ghonda/Fiap5NETT",
        text: "Fiap5NETT",
        note: "C#",
    },
    {
        href: "https://github.com/ghonda/MM-SOLID",
        text: "MM-SOLID",
        note: "C#",
    },
    {
        href: "https://github.com/ghonda/DesignerPatters",
        text: "DesignerPatters",
        note: "C#",
    },
];

const skills = [
    "C#",
    ".NET",
    "ASP.NET MVC",
    ".NET Core",
    "SQL Server",
    "PostgreSQL",
    "MySQL",
    "Azure",
    "C++",
    "Delphi",
    "JavaScript",
    "Python",
];

// Order matters: the game lays these out left to right as the level.
const stops = [
    {
        kind: "education",
        year: 2008,
        label: "UNINOVE",
        title: "Gestão em Redes de Computadores",
        org: "UNINOVE",
        period: "2008 – 2010",
        details: [],
    },
    {
        kind: "education",
        year: 2009,
        label: "FATEC",
        title: "Análise de Sistemas",
        org: "FATEC São Caetano do Sul",
        period: "2009 – 2012",
        details: [],
    },
    {
        kind: "course",
        label: "CURSOS",
        title: "Cursos e certificações",
        org: "Impacta Certificações · BFBiz",
        period: "Formação complementar",
        details: [
            "SQL Server 2008",
            "Programação Orientada a Objeto",
            "C# Módulos I e II",
            "Programming in C# with Microsoft VS 2010",
            "Developing Data Access Solutions",
            "Developing ASP.NET MVC 4 Web Applications",
        ],
    },
    {
        kind: "job",
        year: 2011,
        label: "LEVELUP!",
        title: "Desenvolvedor .NET",
        org: "LevelUP! Interactive S.A.",
        period: "Dez 2011 – Abr 2015",
        details: [
            "Softwares web internos e externos e serviços Windows",
            "Manutenção e novas implementações em sistemas legados e front-end",
            "Relatórios e procedures em SQL Server e MySQL",
        ],
    },
    {
        kind: "trip",
        year: 2015,
        label: "DUBLIN",
        title: "Intercâmbio na Irlanda",
        org: "Seda College · Dublin",
        period: "Abr 2015 – Dez 2015",
        details: ["Curso de imersão no idioma inglês"],
    },
    {
        kind: "job",
        year: 2016,
        label: "FUNÇÃO",
        title: "Desenvolvedor C# / Delphi",
        org: "Função Informática",
        period: "Jan 2016 – Abr 2016",
        details: [
            "Novas aplicações e manutenção do legado em ASP.NET Web Forms, Windows Forms e Delphi",
            "Relatórios para bancos",
            "Procedures em SQL Server",
            "Documentação de software e testes",
        ],
    },
    {
        kind: "job",
        year: 2016,
        label: "EVAL",
        title: "Desenvolvedor C# e C++",
        org: "Eval Tecnologia",
        period: "Ago 2016 – Abr 2018",
        details: [
            "Novas funções e manutenção do sistema de assinatura e certificados digitais",
            "Suporte a sistemas legados",
            "Testes integrados",
        ],
    },
    {
        kind: "job",
        year: 2018,
        label: "FULLBAR",
        title: "Desenvolvedor .NET",
        org: "Fullbar Digital",
        period: "Abr 2018 – Nov 2018",
        details: [
            "APIs para aplicativos mobile",
            "Websites com ASP.NET MVC Core",
            "Testes unitários",
        ],
    },
    {
        kind: "job",
        year: 2018,
        label: "NEGOCIE",
        title: "Desenvolvedor .NET",
        org: "Negocie Online",
        period: "Nov 2018 – Mai 2019",
        details: [
            "APIs com .NET Core",
            "Arquitetura de banco de dados PostgreSQL",
        ],
    },
    {
        kind: "job",
        year: 2019,
        label: "MINDMINERS",
        title: "Desenvolvedor .NET",
        org: "MindMiners",
        period: "Mai 2019 – atual",
        details: ["Novas features e manutenção das aplicações MeSeems"],
    },
    {
        kind: "education",
        year: 2022,
        label: "UNINOVE",
        title: "Análise e Desenvolvimento de Sistemas",
        org: "UNINOVE",
        period: "2022 – 2024",
        details: [],
    },
    {
        kind: "education",
        year: 2024,
        label: "FIAP",
        title: "Arquitetura de Sistemas .NET com Azure",
        org: "FIAP",
        period: "2024 – 2025",
        details: [],
    },
    {
        kind: "github",
        label: "GITHUB",
        title: "Código aberto",
        org: "Estudos e projetos públicos no GitHub",
        period: "Repositórios",
        details: [],
        links: repositories.map((repo) => ({
            href: repo.href,
            text: `${repo.text} · ${repo.note}`,
        })),
    },
    {
        kind: "contact",
        label: "CONTATO",
        title: "Fim da fase!",
        org: "Obrigado por jogar. Vamos conversar?",
        period: "Contato",
        details: [],
        links: contacts,
    },
];

const experience = stops.filter((s) => s.kind === "job" || s.kind === "trip");
const education = stops.filter((s) => s.kind === "education");
const courses = stops.find((s) => s.kind === "course");

const gameIntro = (
    <>
        <p className="dialogMeta">Como jogar</p>
        <h2 className="dialogTitle">Bata nos blocos ? por baixo</h2>
        <p className="dialogOrg">
            Cada bloco guarda uma etapa da minha carreira. Os canos são a
            formação, as moedas são as tecnologias que uso e os bugs pelo
            caminho você corrige pulando em cima.
        </p>
    </>
);

export default function Home() {
    return (
        <>
            <Head>
                <title>Guilherme Honda — Desenvolvedor .NET</title>
                <meta
                    name="description"
                    content="Portfólio de Guilherme Honda, desenvolvedor .NET em São Paulo, apresentado como um jogo de plataforma."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="theme-color" content="#14101e" />
            </Head>

            <a className="skipLink" href="#curriculo">
                Pular o jogo e ler o currículo
            </a>

            <header className="siteHeader">
                <a className="wordmark" href="#top">
                    HONDA NEWS
                </a>
                <nav aria-label="Links">
                    <a href="#curriculo">Currículo</a>
                    {contacts.map((contact) => (
                        <a key={contact.href} href={contact.href}>
                            {contact.label}
                        </a>
                    ))}
                </nav>
            </header>

            <main id="top">
                <section className="intro">
                    <h1>Guilherme Honda</h1>
                    <p>
                        Desenvolvedor .NET em São Paulo. Minha trajetória virou
                        uma fase: ande, bata nos blocos{" "}
                        <span className="qMark" aria-hidden="true">
                            ?
                        </span>{" "}
                        e colete as tecnologias.
                    </p>
                </section>

                <CareerGame stops={stops} skills={skills} intro={gameIntro} />
                <p id="game-help" className="gameHelp">
                    <kbd>←</kbd> <kbd>→</kbd> ou <kbd>A</kbd> <kbd>D</kbd> para
                    andar · <kbd>Espaço</kbd> para pular · <kbd>Esc</kbd> para
                    pausar
                </p>

                <section
                    id="curriculo"
                    className="resume"
                    aria-labelledby="resume-title"
                >
                    <h2 id="resume-title">Currículo</h2>
                    <p className="resumeLead">
                        Tudo o que está no jogo, em texto corrido.
                    </p>

                    <div className="resumeGrid">
                        <article className="panel">
                            <h3>Experiência</h3>
                            <ol className="timeline">
                                {[...experience].reverse().map((item) => (
                                    <li key={item.org}>
                                        <span className="period">
                                            {item.period}
                                        </span>
                                        <span className="role">
                                            {item.title}
                                        </span>
                                        <span className="org">{item.org}</span>
                                        <ul>
                                            {item.details.map((detail) => (
                                                <li key={detail}>{detail}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ol>
                        </article>

                        <div className="sideStack">
                            <article className="panel">
                                <h3>Formação</h3>
                                <ol className="timeline">
                                    {[...education].reverse().map((item) => (
                                        <li key={item.title}>
                                            <span className="period">
                                                {item.period}
                                            </span>
                                            <span className="role">
                                                {item.title}
                                            </span>
                                            <span className="org">
                                                {item.org}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </article>

                            <article className="panel">
                                <h3>Tecnologias</h3>
                                <ul className="chips">
                                    {skills.map((skill) => (
                                        <li key={skill}>{skill}</li>
                                    ))}
                                </ul>
                            </article>

                            <article className="panel">
                                <h3>{courses.title}</h3>
                                <p className="org">{courses.org}</p>
                                <ul className="plainList">
                                    {courses.details.map((detail) => (
                                        <li key={detail}>{detail}</li>
                                    ))}
                                </ul>
                            </article>

                            <article className="panel">
                                <h3>Idiomas</h3>
                                <ul className="plainList">
                                    <li>Português — nativo</li>
                                    <li>Inglês — intermediário</li>
                                </ul>
                            </article>

                            <article className="panel">
                                <h3>No GitHub</h3>
                                <ul className="plainList">
                                    {repositories.map((repo) => (
                                        <li key={repo.href}>
                                            <a href={repo.href}>{repo.text}</a>{" "}
                                            <span className="org">
                                                {repo.note}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </article>

                            <article className="panel" id="contato">
                                <h3>Contato</h3>
                                <ul className="plainList">
                                    {contacts.map((contact) => (
                                        <li key={contact.href}>
                                            <a href={contact.href}>
                                                {contact.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="siteFooter">
                <span>© {new Date().getFullYear()} Guilherme Honda</span>
                <span>Personagem e cenário originais em pixel art.</span>
            </footer>

            <style jsx global>{`
                :root {
                    --night: #14101e;
                    --night-raised: #2a2440;
                    --paper: #fff8e7;
                    --ink: #14101e;
                    --muted: #5b5670;
                    --soft: #a9a3c2;
                    --coin: #f8d030;
                    --brick: #c0602f;
                    --blue: #1565c0;
                    --question: #f6b40e;
                    --question-edge: #7a3e00;
                    --sky: #6b8cff;
                    --pixel: "Press Start 2P", monospace;
                    --sans: "Archivo", system-ui, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }

                html {
                    scroll-behavior: smooth;
                }

                @media (prefers-reduced-motion: reduce) {
                    html {
                        scroll-behavior: auto;
                    }
                }

                body {
                    margin: 0;
                    background: var(--night);
                    color: #fff;
                    font-family: var(--sans);
                    font-size: 16px;
                    line-height: 1.55;
                    -webkit-font-smoothing: antialiased;
                }

                a {
                    color: inherit;
                }

                :focus-visible {
                    outline: 3px solid var(--coin);
                    outline-offset: 3px;
                }

                .skipLink {
                    position: absolute;
                    left: 16px;
                    top: -100px;
                    z-index: 10;
                    padding: 12px 14px;
                    background: var(--coin);
                    color: var(--ink);
                    font-family: var(--pixel);
                    font-size: 10px;
                }

                .skipLink:focus {
                    top: 12px;
                }

                .siteHeader,
                main,
                .siteFooter {
                    max-width: 960px;
                    margin: 0 auto;
                    padding-left: 16px;
                    padding-right: 16px;
                }

                .siteHeader {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px 24px;
                    padding-top: 20px;
                    padding-bottom: 20px;
                }

                .wordmark {
                    color: var(--coin);
                    font-family: var(--pixel);
                    font-size: 14px;
                    text-decoration: none;
                    text-shadow: 2px 2px 0 var(--brick);
                }

                .siteHeader nav {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px 18px;
                }

                .siteHeader nav a {
                    padding: 8px 0;
                    font-family: var(--pixel);
                    font-size: 10px;
                    text-decoration: none;
                }

                .siteHeader nav a:hover {
                    color: var(--coin);
                    text-decoration: underline;
                    text-underline-offset: 4px;
                }

                main {
                    padding-bottom: 64px;
                }

                .intro {
                    padding: 24px 0 28px;
                }

                .intro h1 {
                    margin: 0 0 16px;
                    font-family: var(--pixel);
                    font-size: clamp(22px, 5vw, 40px);
                    font-weight: 400;
                    line-height: 1.3;
                    text-shadow: 4px 4px 0 var(--blue);
                }

                .intro p {
                    max-width: 60ch;
                    margin: 0;
                    color: #d9d4ea;
                    font-size: 18px;
                }

                .qMark {
                    display: inline-grid;
                    place-items: center;
                    width: 1.4em;
                    height: 1.4em;
                    background: var(--question);
                    color: var(--question-edge);
                    box-shadow: inset 0 0 0 2px var(--question-edge);
                    font-family: var(--pixel);
                    font-size: 0.7em;
                    vertical-align: 0.15em;
                }

                .game {
                    outline: none;
                    scroll-margin-top: 16px;
                }

                /* Keep screen + dialog inside one viewport on laptops. */
                @media (min-width: 560px) {
                    .game {
                        max-width: max(560px, calc((100svh - 290px) * 16 / 9));
                        margin: 0 auto;
                    }

                    .dialog {
                        height: 230px;
                        overflow-y: auto;
                    }
                }

                .game:focus-visible .screen {
                    box-shadow:
                        0 0 0 4px var(--coin),
                        8px 8px 0 4px rgba(0, 0, 0, 0.6);
                }

                .screen {
                    position: relative;
                    border: 4px solid #000;
                    background: var(--sky);
                    box-shadow:
                        0 0 0 4px #fff,
                        8px 8px 0 4px rgba(0, 0, 0, 0.6);
                    line-height: 0;
                }

                .canvas {
                    display: block;
                    width: 100%;
                    height: auto;
                    image-rendering: pixelated;
                }

                .hud {
                    position: absolute;
                    inset: 0 0 auto 0;
                    display: flex;
                    justify-content: space-between;
                    gap: 8px;
                    padding: 8px 12px;
                    color: #fff;
                    font-family: var(--pixel);
                    font-size: clamp(7px, 1.3vw, 12px);
                    line-height: 1.7;
                    text-shadow: 2px 2px 0 #000;
                    pointer-events: none;
                }

                .hud div {
                    display: flex;
                    flex-direction: column;
                }

                .overlay {
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-content: center;
                    justify-items: center;
                    gap: 14px;
                    padding: 16px;
                    background: rgba(20, 16, 30, 0.55);
                    line-height: 1.4;
                    text-align: center;
                }

                .overlayTitle {
                    margin: 0;
                    color: var(--coin);
                    font-family: var(--pixel);
                    font-size: clamp(16px, 4vw, 32px);
                    text-shadow: 3px 3px 0 #000;
                }

                .overlaySub {
                    margin: 0;
                    font-family: var(--pixel);
                    font-size: clamp(8px, 1.6vw, 12px);
                    text-shadow: 2px 2px 0 #000;
                }

                .startButton {
                    min-height: 44px;
                    padding: 14px 22px;
                    border: 0;
                    background: var(--brick);
                    color: #fff;
                    box-shadow:
                        inset -4px -4px 0 rgba(0, 0, 0, 0.35),
                        inset 4px 4px 0 rgba(255, 255, 255, 0.3),
                        0 0 0 3px #000;
                    font-family: var(--pixel);
                    font-size: clamp(10px, 2vw, 14px);
                    cursor: pointer;
                }

                .startButton:hover {
                    background: #d8743f;
                }

                .startButton:active {
                    transform: translate(2px, 2px);
                }

                .touchControls {
                    display: none;
                }

                @media (hover: none) and (pointer: coarse) {
                    .touchControls {
                        position: absolute;
                        inset: auto 8px 8px 8px;
                        display: flex;
                        justify-content: space-between;
                        pointer-events: none;
                    }

                    .touchControls div {
                        display: flex;
                        gap: 10px;
                    }

                    .gameHelp {
                        display: none;
                    }
                }

                .touchButton {
                    width: 56px;
                    height: 56px;
                    border: 3px solid rgba(0, 0, 0, 0.6);
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    color: #000;
                    font-family: var(--pixel);
                    font-size: 14px;
                    pointer-events: auto;
                    touch-action: none;
                    user-select: none;
                    -webkit-user-select: none;
                    -webkit-touch-callout: none;
                }

                .touchButton:active {
                    background: rgba(255, 255, 255, 0.7);
                }

                .dialog {
                    min-height: 200px;
                    margin-top: 24px;
                    padding: 18px 20px;
                    border: 4px solid #fff;
                    background: #000;
                    box-shadow: 0 0 0 4px #000;
                }

                .dialogMeta {
                    margin: 0 0 10px;
                    color: var(--coin);
                    font-family: var(--pixel);
                    font-size: 10px;
                    line-height: 1.6;
                    text-transform: uppercase;
                }

                .dialogTitle {
                    margin: 0 0 8px;
                    font-family: var(--pixel);
                    font-size: clamp(12px, 2.2vw, 16px);
                    font-weight: 400;
                    line-height: 1.6;
                }

                .dialogOrg {
                    margin: 0 0 10px;
                    color: #cfc9e4;
                }

                .dialogList {
                    margin: 0;
                    padding-left: 20px;
                }

                .dialogList li::marker {
                    color: var(--coin);
                }

                .dialogLinks {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px 20px;
                    margin: 12px 0 0;
                    padding: 0;
                    list-style: none;
                }

                .dialogLinks a {
                    color: var(--coin);
                    text-underline-offset: 4px;
                }

                .gameHelp {
                    margin: 14px 0 0;
                    color: var(--soft);
                    font-size: 14px;
                    line-height: 2.2;
                }

                .gameHelp kbd {
                    padding: 2px 6px;
                    border: 2px solid #4a4266;
                    border-bottom-width: 4px;
                    background: var(--night-raised);
                    color: #fff;
                    font-family: var(--pixel);
                    font-size: 9px;
                }

                .resume {
                    margin-top: 80px;
                    scroll-margin-top: 24px;
                }

                .resume > h2 {
                    margin: 0 0 8px;
                    color: var(--coin);
                    font-family: var(--pixel);
                    font-size: clamp(16px, 3vw, 22px);
                    font-weight: 400;
                }

                .resumeLead {
                    margin: 0 0 32px;
                    color: var(--soft);
                }

                .resumeGrid,
                .sideStack {
                    display: grid;
                    gap: 28px;
                }

                @media (min-width: 820px) {
                    .resumeGrid {
                        grid-template-columns: 1.4fr 1fr;
                        align-items: start;
                    }
                }

                .panel {
                    padding: 24px;
                    background: var(--paper);
                    color: var(--ink);
                    box-shadow:
                        0 0 0 4px #000,
                        8px 8px 0 4px rgba(0, 0, 0, 0.45);
                }

                .panel h3 {
                    margin: 0 0 18px;
                    color: var(--blue);
                    font-family: var(--pixel);
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 1.6;
                }

                .timeline {
                    display: grid;
                    gap: 22px;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .timeline > li {
                    position: relative;
                    display: grid;
                    gap: 2px;
                    padding-left: 22px;
                }

                .timeline > li::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 4px;
                    width: 10px;
                    height: 10px;
                    background: var(--brick);
                    box-shadow: 0 0 0 2px var(--ink);
                }

                .period {
                    color: var(--muted);
                    font-family: var(--pixel);
                    font-size: 9px;
                    line-height: 1.8;
                }

                .role {
                    font-weight: 700;
                }

                .org {
                    color: var(--muted);
                }

                .panel > .org {
                    margin: -8px 0 12px;
                }

                .timeline ul,
                .plainList {
                    margin: 6px 0 0;
                    padding-left: 18px;
                    font-size: 15px;
                }

                .plainList li + li {
                    margin-top: 4px;
                }

                .panel a {
                    color: var(--blue);
                    font-weight: 600;
                    text-underline-offset: 3px;
                }

                .chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .chips li {
                    padding: 4px 10px;
                    background: #fff;
                    box-shadow: 0 0 0 2px var(--ink);
                    font-size: 14px;
                    font-weight: 600;
                }

                .siteFooter {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    gap: 8px 24px;
                    padding-top: 24px;
                    padding-bottom: 40px;
                    border-top: 4px dashed var(--night-raised);
                    color: var(--soft);
                    font-size: 14px;
                }
            `}</style>
        </>
    );
}
