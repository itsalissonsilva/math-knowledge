# math-knowledge

A knowledge graph of mathematics based on Wikipedia, connecting foundations, branches, concepts, formulas, and source articles. This interactive map of mathematics is built for mental clarity and coherence. It places individual ideas within a larger structure, making it easier to see how concepts fit together, trace connections across fields, and move from the foundations toward more specialized topics.

**[Explore the live graph](https://math-knowledge.org/)**

## Demo

Navigate the map of mathematics to see how its ideas connect. Start with the full graph, unfold a branch, and follow its subbranches into deeper concepts. Double-click the centered node to read its definition, formulas, and Wikipedia source.

https://github.com/user-attachments/assets/ff6f5063-fbee-436b-b0c9-14229c17c69a

[Download the MP4](docs/demo/math-knowledge.mp4) · [Open the interactive graph](https://math-knowledge.org/)

## Explore mathematics

Foundations sit at the center, surrounded by eight connected areas:

| Core | Outer areas |
| --- | --- |
| Sets, logic, proof, categories, and types | Algebra; calculus and analysis; geometry and topology; numbers and number theory; discrete mathematics; probability; statistics; computation and optimization |

The bundled snapshot contains **7,690 concepts**, more than **5,000 concepts with formulas**, and over **150,000 Wikipedia references**. It is organized from 60 Wikipedia outlines, topic lists, glossaries, and overview articles.

Clicking a subject zooms to it and centers it before its spiral branches grow outward. Each selection repeats the same interaction at the next level. Main areas can have up to five choices; deeper subjects have at most four. Larger lists unfold through named mathematical themes, Wikipedia subject categories, and related concepts.

Algebra opens into elementary algebra, abstract algebra, algebraic geometry, and linear algebra. Computation has five initial branches, keeping algorithms, computability and complexity, information and coding, optimization, and numerical methods accessible.

Formulas appear alongside their concepts. Notes contain definitions, hypotheses, examples, related ideas, and links to the relevant Wikipedia articles. For example, Euclidean, taxicab, and Hausdorff distance each have their own definition and explanatory conditions.

The interface stays focused on the graph: breadcrumbs, search, optional notes, and a theme toggle. Dark mode is the default; a saved light or dark preference is respected.

## Controls

| Action | Result |
| --- | --- |
| Click `math-knowledge.org` in the header | Open the GitHub repository |
| Click a branch | Center the concept and reveal its next level |
| Double-click the centered node | Open its note and Wikipedia source |
| Click the centered node, Shift-click, or use the book icon | Read the concept's note |
| Drag or use arrow keys | Pan the canvas |
| Scroll, pinch, or press `+` / `-` | Zoom |
| Press `0` or choose Fit entire map | Show visited context |
| Choose Center selected node | Return to the current subgraph |
| Click a breadcrumb | Return to an earlier level |
| Press `Ctrl+K` / `Cmd+K` | Search all concepts |
| Press `Escape` | Close notes or dialogs |

Browser navigation preserves the exploration path. Reduced-motion preferences skip the camera and branch-growth animations.

## Contributing

Contributions are welcome: improve mathematical explanations, add missing concepts and connections, correct formulas, or refine the interface and accessibility. Include the relevant Wikipedia sources and formula assumptions when changing mathematical content.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, content guidelines, validation steps, and pull request instructions.

## Run locally

Use a recent Node.js release that supports TypeScript type stripping for the tests; Node.js 24 was used for validation.

```sh
git clone https://github.com/itsalissonsilva/math-knowledge.git
cd math-knowledge
npm ci
npm run dev
```

Open [http://127.0.0.1:3002/](http://127.0.0.1:3002/).

```sh
npm test
npm run build
```

The production build is written to `dist/`. The graph and its mathematics data are bundled locally: browsing needs no account, API key, or live Wikipedia API calls. Google Fonts has system-font fallbacks.

## Wikipedia data and mathematical context

The catalogue is based on Wikipedia. Anamnesis inspired the interaction, but its personal graph is not the data source.

The importer resolves redirects, merges article identities, filters missing pages and disambiguation pages, and reconciles browsing cycles. The exact source inventory and coverage report are in [`wikipedia-coverage.json`](wikipedia-coverage.json).

The graph distinguishes four relationships:

- **Browsing hierarchy:** a primary home for exploring a subject.
- **Wikipedia reference:** a link present in article-body wikitext, retaining its source article.
- **Wikipedia classification:** placement or cross-listing in a subject outline.
- **Learning bridge:** a separately annotated mathematical connection or useful foundation.

A reference or classification is not automatically a prerequisite. Some topics naturally connect several fields and may be encountered through more than one route.

Reviewed formulas include their mathematical assumptions and, where available, examples. Additional source-selected equations retain their Wikipedia section and revision context; use the linked article for notation and hypotheses. KaTeX converts source notation into native MathML during indexing, so formulas render without an external math service.

Wikipedia introductions use complete-sentence excerpts, with source links and attribution under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Definitions finish naturally instead of being cut off at a fixed word count. The source snapshot retains article/page identifiers and available revision identifiers. Reviewed explanations, examples, and learning bridges are original annotations.

## Rebuild the index

```sh
npm run index:wikipedia
npm run index:learning
```

The Wikipedia importer makes read-only requests, caches public responses in the operating system's temporary directory, throttles requests, and respects rate-limit cooldowns. The learning pass reuses that cache without network requests.

To select an existing cache explicitly:

```sh
npm run index:learning -- /absolute/path/to/mapofmathematics-wikipedia-read-cache
```

Generated data:

- [`public/wikipedia-catalog.json`](public/wikipedia-catalog.json): concepts, article references, classifications, and source provenance.
- [`public/wikipedia-learning.json`](public/wikipedia-learning.json): subject metadata and typeset equations.

## Project structure

| Location | Purpose |
| --- | --- |
| `src/AtlasApp.tsx` | Navigation, search, notes, sources, and themes |
| `src/ExplorerGraph.tsx` | Camera gestures and sequential zoom / branch-growth animation |
| `src/layout.ts`, `src/dive-scene.ts` | Symmetric layouts, partial spiral curves, and nested exploration paths |
| `src/dive-model.ts`, `src/subject-rules.ts` | Small, named browsing branches |
| `src/navigation-ownership.ts`, `src/semantic-branches.ts` | Category-based placement and semantic subdivision |
| `src/atlas-data.ts` | Graph indexing, search, ancestry, and adjacency |
| `src/catalog.ts`, `src/data.ts` | The browsing backbone and supplementary introductory lessons |
| `src/formula-library.ts`, `src/formula-definitions.ts` | Reviewed formulas, conditions, examples, and compact notation |
| `src/MathExpression.tsx` | Responsive native mathematical notation |
| `src/learning-relations.ts` | Explained educational connections |
| `scripts/` | Wikipedia importing, equation indexing, and coverage inspection |
| `tests/` | Coverage, source integrity, reachability, branch limits, geometry, and animation timing |
| `docs/demo/` | The walkthrough video and overview image |

Built with React, TypeScript, Vite, and KaTeX-generated MathML. The live version is hosted at [math-knowledge.org](https://math-knowledge.org/).
