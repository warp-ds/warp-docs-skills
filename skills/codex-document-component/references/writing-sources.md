# Writing guidance sources and notices

The bundled [writing guide](writing.md) is a WARP-specific adaptation of selected editing principles. It supplies the instructions needed at runtime; these links record provenance and do not require installing or fetching another skill. Revisions were inspected on 8 September 2026.

## Humanizer

- Repository: [blader/humanizer](https://github.com/blader/humanizer).
- Inspected revision: `9862685f575c65a8247f90369951df1b3416e3d6`; skill metadata version `3.0.0`.
- Sources: [SKILL.md at that revision](https://github.com/blader/humanizer/blob/9862685f575c65a8247f90369951df1b3416e3d6/SKILL.md) and [MIT licence](https://github.com/blader/humanizer/blob/9862685f575c65a8247f90369951df1b3416e3d6/LICENSE).
- Selected principles: remove empty rhetorical framing and promotional language; review paragraph patterns; preserve supported claims and code; use a neutral voice for technical material; check a rewrite for factual changes.
- Local choices: use WARP examples and a two-pass review; retain meaningful lists, explicit limitations, necessary qualifications, and the documentation site's required structure. This is an editing aid, not a test of authorship or an instruction to evade detection.

The full upstream skill and its examples are not vendored. The MIT notice is retained below for the adapted guidance.

```text
MIT License

Copyright (c) 2025 Siqi Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## The Elements of Style

- Repository: [obra/the-elements-of-style](https://github.com/obra/the-elements-of-style), packaged by Jesse Vincent.
- Inspected revision: `05fc4f0d2b97b7c042dd9949ad658568e4a1324e`.
- Actual skill: [writing-clearly-and-concisely/SKILL.md](https://github.com/obra/the-elements-of-style/blob/05fc4f0d2b97b7c042dd9949ad658568e4a1324e/skills/writing-clearly-and-concisely/SKILL.md).
- Reference: [William Strunk Jr.'s 1918 text](https://github.com/obra/the-elements-of-style/blob/05fc4f0d2b97b7c042dd9949ad658568e4a1324e/skills/writing-clearly-and-concisely/elements-of-style.md), particularly composition rules 8–17.
- Licence provenance: the pinned [README](https://github.com/obra/the-elements-of-style/blob/05fc4f0d2b97b7c042dd9949ad658568e4a1324e/README.md) identifies the 1918 text as public domain, sourced from Project Gutenberg. The pinned [package metadata](https://github.com/obra/the-elements-of-style/blob/05fc4f0d2b97b7c042dd9949ad658568e4a1324e/package.json) also declares `Public Domain`. There is no standalone `LICENSE` file at this revision.
- Selected principles: organise paragraphs by topic, name the actor, favour concrete language, remove unnecessary wording, keep modifiers close to their subjects, and use parallel forms for comparisons.
- Local choices: apply these principles in original WARP wording. Preserve technical uncertainty and useful negative instructions; use UK English and modern inclusive language. No later Strunk and White edition, full book, or upstream agent wrapper is copied into this bundle.
