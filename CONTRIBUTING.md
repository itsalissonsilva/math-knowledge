# Contributing to math-knowledge

Help make this map of mathematics clearer, more coherent, and more useful for learning. Contributions can improve the mathematics, its organization, the interface, accessibility, or documentation.

## Report a problem or suggest an idea

[Open an issue](https://github.com/itsalissonsilva/math-knowledge/issues) with enough context to review the change:

- For an incorrect formula or explanation, name the concept, include its graph URL or breadcrumb path, and link the relevant Wikipedia article. State the corrected formula and its assumptions.
- For a missing concept or connection, include a Wikipedia source and suggest where it belongs. Explain whether the relationship is a subject classification, an article reference, or an educational foundation.
- For an interface problem, describe the steps and expected behavior. Include the browser, device size, and a screenshot when they help reproduce it.

Small, focused suggestions are welcome. A large reorganization is easier to discuss in an issue before implementing it.

## Develop locally

1. Fork the repository and clone your fork.
2. Create a branch for the change.
3. Install the locked dependencies and start the app.

```sh
git clone https://github.com/YOUR-USERNAME/math-knowledge.git
cd math-knowledge
git switch -c improve-topic-or-feature
npm ci
npm run dev
```

Use Node.js 24 or another recent version that supports the TypeScript type stripping used by the tests. Open [http://127.0.0.1:3002/](http://127.0.0.1:3002/). No account or API key is required.

## Choose the right source file

| Change | Main files |
| --- | --- |
| Browsing backbone and original concept descriptions | `src/catalog.ts` |
| Reviewed formulas, assumptions, examples, and compact notation | `src/formula-definitions.ts`, `src/formula-library.ts` |
| Explained educational connections | `src/learning-relations.ts` |
| Primary browsing placement | `src/navigation-ownership.ts` |
| Named themes and recursive branch organization | `src/subject-rules.ts`, `src/dive-model.ts`, `src/semantic-branches.ts` |
| Graph gestures and branch animation | `src/ExplorerGraph.tsx`, `src/layout.ts`, `src/dive-scene.ts` |
| Navigation, notes, search, and themes | `src/AtlasApp.tsx` |
| Formula display | `src/MathExpression.tsx` |
| Appearance and responsive layouts | `src/atlas.css`, `src/spiral.css` |
| Wikipedia import and equation generation | `scripts/build-wikipedia.mjs`, `scripts/build-learning-index.mjs` |

Follow the existing style and keep the change focused. Avoid unrelated formatting or dependency changes.

## Mathematical content and structure

- Use Wikipedia as the content basis and retain source provenance. The graph is not based on a personal mathematics catalogue.
- Give formulas their conditions: domains, regularity, nonzero denominators, convergence assumptions, or other relevant hypotheses. An example can make a definition much easier to understand.
- Keep reviewed explanations distinct from automatically selected source equations.
- Do not present an article reference or classification as a prerequisite without a specific mathematical explanation.
- Use meaningful mathematical branches. Prefer deeper, coherent organization to alphabetic ranges or generic overflow nodes.
- Keep the foundations core and eight outer areas. Main areas may have up to five choices; deeper subjects have at most four. Natural leaves and smaller branches are valid.
- Preserve concept reachability when moving topics. Check that a change does not introduce navigation cycles or orphaned concepts.
- Preserve Wikipedia attribution and CC BY-SA links. Use a complete introductory sentence, preserving inline mathematical notation. Never truncate a definition at a word count, append an ellipsis, or hide an unfinished clause by adding a period. Write original explanatory annotations for additional context.

## Generated data

The files in `public/wikipedia-catalog.json` and `public/wikipedia-learning.json` are generated snapshots. Make durable changes in the source catalogue, annotations, taxonomy, or indexing scripts, and include the affected generated output in the pull request.

When an index rebuild is needed:

```sh
npm run index:wikipedia
npm run index:learning
```

The first command reads Wikipedia and populates a temporary cache. It can take time and must respect Wikipedia's rate limits. The second reuses that cache to generate subject metadata and MathML equations. To reuse an existing cache explicitly:

```sh
npm run index:learning -- /absolute/path/to/mapofmathematics-wikipedia-read-cache
```

To refresh only the descriptions from those cached article revisions, preserving all concepts, branches, references, and formulas:

```sh
npm run index:descriptions -- /absolute/path/to/mapofmathematics-wikipedia-read-cache
```

This offline pass uses the same sentence extraction as the full importer and stops for review if a source cannot supply a complete description.

Interface and documentation changes generally do not require rebuilding the data. A reviewed formula change should include its updated generated MathML when applicable.

## Validate the change

```sh
npm test
npm run build
```

For interface changes, check the affected flow in the browser. Relevant checks include dark and light themes, a narrow screen, keyboard navigation, reduced motion, centering before branch growth, and opening notes without losing the current subgraph.

Add or update tests when a change introduces meaningful graph, mathematical, or interaction behavior. Keep generated build output, dependency folders, local caches, and credentials out of commits. Ordinary contributions do not need changes to `.openai/hosting.json` or access to the production host.

## Submit a pull request

Push your branch to your fork and open a pull request against `main`. Describe:

1. The concrete problem and resulting behavior.
2. The affected concepts or interface flow.
3. Wikipedia sources and mathematical assumptions, when relevant.
4. The checks you ran, plus a screenshot or short clip for a visible interface change.

Link the relevant issue if one exists. Keep commits descriptive and scoped so the change is straightforward to review.
