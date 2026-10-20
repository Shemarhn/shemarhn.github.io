# Identity and interaction system

## Editable SM identity

`src/brand/monogram.ts` is the canonical geometry traced from the supplied SM artwork. Seven named facets, three orbital paths, and two nodes can be styled or animated independently. Each inline instance uses a unique gradient prefix. No raster mask, black background, or remote image is required.

Use `Monogram.astro` for inline instances. Edit geometry and gradients in the canonical source, then run `node scripts/export-brand.mjs` from the project directory. This regenerates transparent SVGs, the wordmark, favicon, Apple touch icon, and social preview. The outline variant is included for line treatments. SVG text in the exported wordmark remains editable text; the monogram itself is entirely paths and circles.

## Motion and progressive enhancement

- [Motion](https://motion.dev/docs) powers scroll reveals, spring-based button attraction, artwork tilt, pointer-responsive lighting, and carousel rotation.
- [Anime.js](https://animejs.com/documentation) is loaded on the homepage for the facet assembly and SVG orbital drawing timeline. The replay control restarts it.
- [Kokonut UI Background Paths](https://kokonutui.com) supplies the path construction approach ported to a native canvas renderer in `src/scripts/ribbon.ts`. The original geometry and attribution are identified in that file. Rendering stops outside the viewport and while the document is hidden.
- [Bklit UI Grid and Background](https://ui.bklit.com) inform the native SVG grid, fade mask, and animated grid highlight in `AmbientGrid.astro`. These are adaptations rather than an installed React or shadcn component runtime. Bklit's analytics SDK is not installed.

The Astro pages remain server-rendered. JavaScript enhances visible content rather than being required to read it. The technology explorer starts as a logo grid. No React runtime or WebGL engine is needed. Native view transitions provide a short page transition where supported.

The global pause control persists across pages and informs every motion module. System reduced-motion preferences also disable decorative movement. Carousel autoplay stops for hover, focus, dragging, hidden documents, and offscreen sections. Pointer interactions are limited to fine pointers; mobile scrolling remains native.

## Technology explorer

`src/data/technologies.ts` contains 31 technologies across Cloud, Systems, Delivery, Backend, Data, and Web & Apps. Each entry has an actual brand SVG, a factual description, and a related service. This list describes scoped tools and workflows; it implies no vendor certification, partnership, or endorsement.

The enhanced explorer provides a CSS 3D ring with Motion rotation, category filters, previous/next controls, horizontal dragging, arrow/Home/End keyboard support, pause/resume, and a full selectable index. Selection updates a text description and service link. The focused card follows keyboard selection, and other cards leave the tab order.

Brand marks are locally served SVGs from the [Devicon project](https://github.com/devicons/devicon), an alternative to the supplied Worldvectorlogo reference. `vendor/technology-logos.json` records the upstream source URL for every imported asset. Do not recolor third-party marks to imply a different identity. Trademark rights remain with their owners.

## Source and licenses

MIT notices for Devicon, Kokonut UI, and Bklit UI are retained in `vendor/`. Motion and Anime.js retain their own package license metadata. `pnpm-lock.yaml` pins the tested installation. Review the upstream sources and license notices when updating copied patterns or assets.

The palette remains deep navy, slate, charcoal, and electric blue. Large editorial type, restrained grid lines, animated vector depth, and light logo plates provide a consistent treatment across the hero, case studies, and technology explorer.
