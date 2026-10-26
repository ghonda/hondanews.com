---
name: Honda News
description: Um sistema editorial preciso para comunicar desenvolvimento de software com contexto.
colors:
    cobalt: "#2f5bff"
    paper: "#f7f7f5"
    ink: "#111111"
    rule: "#d7d9de"
    muted: "#666a73"
    dark-muted: "#b5b7bd"
    dark-hover: "#181818"
typography:
    display:
        fontFamily: '"Archivo", "Helvetica Neue", sans-serif'
        fontSize: "clamp(5rem, 8.35vw, 7.5rem)"
        fontWeight: 790
        lineHeight: 0.92
        letterSpacing: "-0.04em"
        fontVariation: '"wdth" 120'
    headline:
        fontFamily: '"Archivo", "Helvetica Neue", sans-serif'
        fontSize: "clamp(2.9rem, 5vw, 5.4rem)"
        fontWeight: 720
        lineHeight: 0.98
        letterSpacing: "-0.04em"
    title:
        fontFamily: '"Archivo", "Helvetica Neue", sans-serif'
        fontSize: "clamp(1.55rem, 2.3vw, 2.3rem)"
        fontWeight: 520
        lineHeight: 1.05
        letterSpacing: "-0.035em"
    body:
        fontFamily: '"Archivo", "Helvetica Neue", sans-serif'
        fontSize: "1rem"
        fontWeight: 400
        lineHeight: 1.55
        letterSpacing: "normal"
    label:
        fontFamily: '"Archivo", "Helvetica Neue", sans-serif'
        fontSize: "0.72rem"
        fontWeight: 650
        lineHeight: 1
        letterSpacing: "0.12em"
rounded:
    none: "0px"
spacing:
    page-gutter: "5.25vw"
    mobile-gutter: "1.25rem"
    section-block: "clamp(6rem, 10vw, 10rem)"
    control: "1rem"
components:
    header-action:
        backgroundColor: "{colors.paper}"
        textColor: "{colors.ink}"
        typography: "{typography.label}"
        rounded: "{rounded.none}"
        padding: "0 1rem"
        height: "46px"
    action-rail:
        backgroundColor: "{colors.cobalt}"
        textColor: "#ffffff"
        typography: "{typography.label}"
        rounded: "{rounded.none}"
        padding: "0 5.25vw"
        height: "92px"
    capability-panel:
        backgroundColor: "{colors.ink}"
        textColor: "#ffffff"
        rounded: "{rounded.none}"
        padding: "clamp(2rem, 3.2vw, 3.75rem)"
---

# Design System: Honda News

## Overview

**Creative North Star: "Capa Editorial de Sistemas"**

Honda News combina a autoridade de uma capa editorial contemporânea com a precisão de um diagrama de software. O sistema é direto, técnico e humano: tipografia de grande escala comunica o assunto primeiro; campos inteiros de papel, grafite e cobalto organizam a narrativa sem depender de decoração ou promessas vazias.

O ritmo alterna impacto e explicação. Áreas densas usam geometria contável, regras finas e módulos alinhados; áreas de leitura recebem espaço generoso. A identidade deve parecer autoral e profissional, nunca automotiva, nostálgica ou semelhante a um terminal genérico.

**Key Characteristics:**

-   Tipografia Archivo ampla, pesada e altamente hierárquica.
-   Cobalto reservado para ação, progressão e pequenos pontos de sinal.
-   Campos de cor em largura total, separados por regras de um pixel.
-   Diagramas SVG exatos no lugar de ilustrações decorativas.
-   Cantos rigorosamente quadrados e profundidade sem sombras.

## Colors

A paleta usa um único cobalto energético sobre uma base editorial de papel e grafite, com cinzas frios para hierarquia e separação.

### Primary

-   **Cobalto de ação:** ocupa faixas completas, pontos de sinal, numeração de processo e estados de foco; sua função é conduzir, não ornamentar.

### Neutral

-   **Papel frio:** superfície principal e espaço de leitura.
-   **Grafite integral:** texto dominante, seção de capacidades e contraste estrutural.
-   **Regra fria:** bordas e divisores de um pixel.
-   **Cinza de apoio:** texto secundário em superfícies claras.
-   **Cinza noturno:** texto secundário sobre grafite.
-   **Grafite de resposta:** mudança tonal discreta no hover dos painéis escuros.

**The Field Color Rule.** Cor entra como campo que organiza uma região inteira ou como sinal geométrico preciso; não deve ser espalhada em pequenos enfeites.

**The One Accent Rule.** Cobalto é o único acento cromático. Novas cores só entram quando uma necessidade semântica real exigir outro papel.

## Typography

**Display Font:** Archivo variável (com Helvetica Neue e sans-serif como fallback)
**Body Font:** Archivo variável (com Helvetica Neue e sans-serif como fallback)

**Character:** uma família neo-grotesca larga e precisa resolve toda a interface. A personalidade vem de largura, peso, escala e alinhamento — não de misturar famílias ou simular linguagem de código.

### Hierarchy

-   **Display** (790, fluido até 7.5rem, 0.92): capa da superfície e frases de máxima importância; largura expandida e tracking no limite de -0.04em.
-   **Headline** (720, fluido até 5.4rem, 0.98): títulos de seção e fechamento.
-   **Title** (520, fluido até 2.3rem, 1.05): capacidades, etapas e temas.
-   **Body** (400, 1rem, 1.55): explicação e narrativa curta; manter blocos em medidas de aproximadamente 24–38 caracteres quando possível.
-   **Label** (650, 0.72rem, 0.12em, uppercase): ações compactas, metadados e numeração.

**The Headline Carries the Page Rule.** Não adicionar eyebrow sobre títulos; a escala, o peso e a posição do próprio título definem sua importância.

## Layout

A estrutura desktop parte de uma grade editorial de doze colunas com gutter lateral de 5.25vw. O hero faz o display ocupar aproximadamente nove colunas e ancora o apoio no terço direito; uma faixa de ação cruza toda a largura antes do campo escuro de capacidades.

Seções alternam duas colunas para título e contexto, três colunas para capacidades, quatro colunas para etapas e uma composição 0.9/1.6 para o índice de temas. O ritmo vertical usa intervalos amplos entre capítulos e agrupamento apertado dentro de cada capítulo.

Em 980px, etapas passam de quatro para duas colunas e áreas editoriais se empilham. Em 720px, a navegação central desaparece, o gutter torna-se 1.25rem, capacidades e etapas viram sequências verticais, e o hero abandona a altura de viewport em favor de uma composição controlada de 580px.

**The First Fold Rule.** Em qualquer largura, headline, apoio, faixa cobalto e o começo do campo grafite precisam aparecer como uma única sequência contínua.

## Elevation & Depth

O sistema é plano por princípio e não usa sombras. Profundidade vem da alternância entre campos claros, escuros e cobalto, das regras de um pixel e da sobreposição temporal sugerida pelos diagramas.

**The Flat Structure Rule.** Superfícies não flutuam; hierarquia espacial deve ser construída com cor, escala, borda e posição.

## Shapes

Cantos permanecem quadrados. Controles, painéis e faixas usam retângulos puros; círculos aparecem somente dentro dos diagramas ou como nós de sistema. Bordas têm um pixel e nunca competem com o campo que delimitam.

Os diagramas são compostos por círculos, retângulos, linhas, camadas e tracejados que possam ser descritos e animados com precisão. Ícones de ação são SVGs autorais com stroke de 1.5px e terminações quadradas.

## Components

### Buttons

-   **Shape:** retangular e sem raio.
-   **Primary:** faixa cobalto com texto branco em label uppercase; ocupa uma região, em vez de parecer um botão solto.
-   **Hover / Focus:** seta avança 8px; foco usa contorno cobalto de 3px ou branco dentro de campos azuis.
-   **Header action:** contorno grafite, rótulo “Contato” e seta diagonal; inverte para fundo grafite no hover.

### Cards / Containers

-   **Corner Style:** quadrado.
-   **Background:** papel ou grafite conforme a seção.
-   **Shadow Strategy:** nenhuma sombra.
-   **Border:** regra fria ou grafite médio de 1px.
-   **Internal Padding:** fluido entre 2rem e 3.75rem nas capacidades.

### Navigation

A palavra-marca fica à esquerda, links centrais usam texto discreto e a ação nomeada fica à direita. Hover desenha uma regra de um pixel da esquerda para a direita. Em mobile, os links centrais somem, mas palavra-marca e ação “Contato” permanecem.

### Capability Panel

Painel grafite alto com título, descrição e um diagrama SVG centralizado. O hover muda apenas o tom da superfície. Três painéis dividem a largura no desktop e formam uma sequência contínua no mobile.

### Process Step

Etapa numerada com índice cobalto, título e texto. Os números expressam uma sequência real e devem permanecer; as células compartilham bordas e nunca recebem sombra ou raio.

### Motion

O único momento de entrada autoral revela o segundo verso do display em 800ms com curva exponencial e blur decrescente. Respostas de hover permanecem curtas, entre 180ms e 240ms. Quando `prefers-reduced-motion` está ativo, a entrada não é aplicada e todas as transições são reduzidas.

## Do's and Don'ts

### Do:

-   **Do** usar campos inteiros de papel, grafite e cobalto para controlar o ritmo da página.
-   **Do** manter tracking de display em -0.04em ou mais aberto.
-   **Do** criar diagramas com SVG geométrico, stroke fino e um único ponto cobalto.
-   **Do** preservar foco visível, alvos de pelo menos 44px e fallback para movimento reduzido.
-   **Do** fazer títulos carregarem a hierarquia sem depender de labels introdutórios.

### Don't:

-   **Don't** usar logotipos, cores, símbolos ou linguagem ligados à fabricante de veículos Honda.
-   **Don't** transformar a interface em uma coleção de cartões arredondados, vidro, gradientes ou sombras difusas.
-   **Don't** usar monospace, terminal, snippets de código ou brilho neon como atalho para parecer técnico.
-   **Don't** inventar clientes, métricas, projetos, depoimentos ou canais de contato.
-   **Don't** adicionar cor fora de um papel semântico claro; o cobalto deve continuar sendo a única voz de acento.
