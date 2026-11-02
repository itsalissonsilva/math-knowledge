# Map of Mathematics

A Wikipedia-based mathematics explorer with Foundations inside and eight mathematical areas around it. Clicking a subject zooms and centers that node, then animates a balanced set of spiral branches. Main areas may use five choices when helpful; deeper subjects have at most four.

## Run locally

From the parent workspace:

```powershell
npm run mathmap
```

Open **http://127.0.0.1:3002/**. Keep the server running while inspecting the app. The checkout uses the parent workspace’s installed dependencies; a standalone checkout needs `npm install` in this directory first.

```powershell
npm run build
npm test
```

The production output is `dist/`, including the complete static Wikipedia snapshot. No account, API key, or live Wikipedia request is required to browse the graph. Google Fonts has system-font fallbacks.

## Structure and exploration

The core contains set theory, mathematical logic, proofs, category theory, and type theory. Eight outer areas surround it:

1. Algebra
2. Calculus and analysis
3. Geometry and topology
4. Numbers and number theory
5. Discrete mathematics
6. Probability
7. Statistics
8. Computation and optimization

The interface is a full-window graph with breadcrumbs, search, and a theme control. The overview contains Foundations and the eight outer areas. Click any subject: the camera centers it first, then its branches grow outward. Selecting a child repeats the same motion at the next level.

Algebra opens four branches: elementary algebra, abstract algebra, algebraic geometry, and linear algebra. Computation opens five broad branches. Wider Wikipedia lists unfold through named mathematical themes, subject categories, and related article clusters. There are no alphabetical ranges or unnamed overflow buckets. Browsing groups are organizational nodes, not additional Wikipedia articles. Every concept remains reachable, with as many dive levels as the subject requires.

More than 5,000 concepts have equations. Reviewed definitions cover distances, metric spaces, and many core subjects; source equations retain their Wikipedia section and revision. KaTeX generates safe native MathML during indexing, so equations need no external math service and are not hidden because their source notation is long. Compact branch notation leads to the full expression, hypotheses, and examples in notes.

Use the book control, the centered node, or Shift-click to read definitions, formula conditions, examples, and Wikipedia sources. A terminal concept opens its notes after centering. The map stays focused on the current subject and its small set of branches; visited context remains available through breadcrumbs and Fit entire map.

Drag to pan, scroll or pinch to zoom, or use arrow keys, +/−, and 0 on the canvas. **Fit entire map** shows visited context; **Center selected node** repeats the local dive. The title resets the map. **Ctrl/Cmd + K** searches every concept, and **Escape** closes notes or dialogs. Breadcrumbs and browser history preserve the actual dive path. Light/dark theme persists. Reduced-motion preferences skip the focus and sprout animations.

## Wikipedia coverage and provenance

The bundled snapshot contains thousands of concepts drawn from 60 unique Wikipedia subject outlines, lists, glossaries, and overview articles. The exact current counts and source inventory are in `wikipedia-coverage.json`; the complete node, source, and connection records are in `public/wikipedia-catalog.json`.

The importer handles nested bullets, column-layout lists, tables, and glossary entries. It resolves redirects, merges duplicate article identities, removes red links and disambiguation pages, filters biographies and software entries, and reconciles redirect-induced hierarchy cycles. Broad alphabetical lists are organized into mathematical subfields using outline sections, article categories, introductions, and an explicit browsing taxonomy.

There are distinct relationship types:

- **Subject hierarchy:** a primary browsing home, drawn with a solid curved stem.
- **Wikipedia reference:** an actual link in article-body wikitext, with the source article attached. These are not automatically prerequisites.
- **Wikipedia classification:** placement or cross-listing in a subject outline.
- **Learning bridge:** a separately curated mathematical relationship or suggested foundation, with a specific explanation.

Wikipedia introductions are quoted in short excerpts of at most 20 words per article. Each excerpt links to its source; article IDs and available revision IDs are retained in the snapshot. Wikipedia text is attributed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Reviewed formula conditions, introductory examples, and learning bridges are original annotations. Other equations are explicitly identified as source selections; consult the linked article for their notation and hypotheses.

To rebuild the public-source snapshot:

```powershell
npm run index:wikipedia
npm run index:learning
```

This makes read-only requests to Wikipedia. It caches public responses in the operating system’s temporary directory, throttles requests, and respects rate-limit cooldowns. It does not read Anamnesis data or upload the local project anywhere.

The learning pass reuses that cache without network requests. An explicit cache location can be supplied with `npm run index:learning -- C:\path\to\cache`. Its complete static output is `public/wikipedia-learning.json`, containing category/link metadata and typeset equations.

## Source map

- `src/AtlasApp.tsx`: minimal navigation, optional source reading, search, and theme.
- `src/ExplorerGraph.tsx`: sequential center/zoom and branch-growth animation, camera gestures, and focused rendering.
- `src/layout.ts`: symmetric three/four/five-way layouts, exact camera centering, motion timing, and partial cubic curves.
- `src/dive-model.ts`: small browsing groups over the complete Wikipedia graph.
- `src/navigation-ownership.ts`: category-based subject placement, preserving the original source graph.
- `src/subject-rules.ts`: named educational waypoints across the main subjects.
- `src/semantic-branches.ts`: recursive category and article-affinity subdivisions, without alphabetic buckets.
- `src/dive-scene.ts`: nested scene geometry and actual exploration paths.
- `src/atlas-data.ts`: indexed graph model, ancestry, adjacency, and search.
- `src/catalog.ts`: explicit browsing backbone and original mathematical descriptions.
- `src/learning-relations.ts`: explained educational cross-links.
- `src/formula-library.ts`: annotated formulas and their hypotheses.
- `src/formula-definitions.ts`: reviewed typeset definitions, examples, and compact branch notation.
- `src/MathExpression.tsx`: responsive native mathematical notation.
- `src/data.ts`: supplementary introductory lessons and examples; not the graph’s coverage dataset.
- `scripts/build-wikipedia.mjs`: reproducible Wikipedia indexing and hierarchy reconciliation.
- `scripts/build-learning-index.mjs`: category extraction, source equations, and offline MathML generation.
- `tests/content.test.ts`: complete-graph reachability, source integrity, cross-area connectivity, coverage, search, formula annotations, complete navigation coverage, branch limits, symmetry, exact centering, motion order, and growing stems.

Anamnesis and Tempo remain separate applications with independent data.
