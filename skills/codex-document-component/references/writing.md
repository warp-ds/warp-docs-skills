# Writing WARP component documentation

Use this guide for page prose, illustration captions, alt text, and review comments. The lead, specialists, and reviewer share it. It combines selected Humanizer editing principles with William Strunk Jr.'s 1918 *The Elements of Style*, as packaged by `obra/the-elements-of-style`. [Source revisions and notices](writing-sources.md) are included in this bundle; no separate writing skill installation is required.

## Write for a decision

Help designers and developers choose and use a component. Start with what it does or the action the reader should take. Develop one topic per paragraph, giving the relevant condition and consequence. Prefer a concrete example to a claim that a component is intuitive, seamless, powerful, or accessible.

- Use UK English in prose: colour, behaviour, labelled, organise. Preserve spelling and case in API identifiers, visible UI strings, quotations, proper names, and source titles. `color`, `aria-labelledby`, and `WarpRadioGroup` must not change during copyediting.
- Address the implementer as “you” when helpful; use “users” for people interacting with the product. Name the component, browser, application, or user when the distinction explains who acts.
- Use present tense for current behaviour and imperative verbs for guidance. Keep each condition next to the instruction it qualifies: “When no option is selected, …”.
- Keep component and part names consistent across prose, anatomy legends, captions, and alt text. Explain platform naming differences in the mapping table; do not vary a technical term for literary effect.
- Use parallel wording for comparable states, variants, and keyboard actions. Use tables for comparisons and lists for steps or genuinely parallel items. Preserve the site's headings and required Vue components.
- Say what to do, then explain why when the reason helps a decision. Retain necessary prohibitions, “When not to use” guidance, and real limitations. Positive wording must not conceal an unsupported feature or make an unsafe action sound acceptable.

## Remove prose that contributes no information

Cut announcements of the next paragraph, praise, broad claims of significance, decorative conclusions, and chat greetings or offers. Replace abstract language with the component's actual action. Remove a repeated heading from the first sentence beneath it.

Read paragraphs as well as individual sentences. Mechanical contrasts, repeated closers, forced groups of three, and repetitive bold labels can conceal thin guidance. Rewrite around the point instead of swapping words from a blacklist. Keep a three-item list when there are three relevant items, a comparison when it teaches a real choice, and parallel wording when it helps scanning. Prefer full stops and commas to chains of dashes.

Keep the voice neutral and approachable. Do not invent anecdotes, quotations, research findings, user preferences, statistics, tests, or first-person experience to make the text feel human. Fictional interface copy is useful in a labelled example; it is not evidence about a real product or its users.

## Protect technical meaning

Style edits must retain the facts, qualifiers, conditions, units, numbers, defaults, and exceptions supported by the component brief. In particular:

- Keep platform, package version, and test environment restrictions attached to the claim. Never turn “verified in this browser” into “works in all browsers”.
- Separate an accessibility recommendation from an implementation guarantee. Source inspection can establish semantics set by code; it cannot establish the exact announcement in every screen reader. Report an announcement as tested only with the actual environment and result.
- Preserve the difference between required behaviour, recommended practice, and an available option. Do not silently exchange “must”, “should”, and “can”.
- Distinguish a known component limitation from missing research. Describe a verified limitation and supported workaround where it affects use. Record missing evidence in the handoff; do not guess, remove the restriction, or disguise it as a generic warning.
- Retain useful citations and source references. A cleaner sentence is not a reason to remove evidence or attribute an unsupported claim to a design system.
- During copyediting, leave code blocks, inline API identifiers, paths, URLs, frontmatter, and Vue syntax unchanged. A factual or code correction is a separate change that needs source verification and appropriate validation.

## Before and after

These are editing examples, not reusable assertions about a particular package release. Behavioural wording belongs in a page only when the component brief supports it. This table compares prose; actual component Do/Don't examples use the required `<DoDont>` markup.

| Problem | Before | After |
| --- | --- | --- |
| Inflated introduction | “Let's explore how Radio empowers users with an intuitive, streamlined single-choice experience.” | “Use Radio when users need to choose one option from a set.” |
| Hidden actor | “The addition of a visible label to each option should be undertaken.” | “Give each option a visible label.” |
| Vague caption | “Do use clear, user-friendly wording to enhance clarity.” | “Label the action ‘Save search’.” Add the relevant reason in the caption if the example's context needs it. |
| Redundant opening | Under “Keyboard interaction”: “Keyboard interaction plays a vital role in accessibility. On Web, arrow keys move between options.” | “On Web, arrow keys move between options.” Retain the exact focus and selection behaviour established by the evidence. |
| Lost scope | Given a keyboard test only in Chrome: “Keyboard interaction works consistently across browsers.” | “The keyboard test passed in Chrome.” In the test record, include the version and actions checked; leave other browsers unverified. |
| Concealed limitation | Given source evidence that a variant exposes no selected-state semantics: “The native control provides a fully accessible selection experience.” | “This variant does not expose its selected state through accessibility semantics.” Add only a workaround that has been verified. |

Prefer captions that name the visible decision and alt text that explains the relevant visual information. Do not write “good example”, “bad example”, or a filename as the entire description. For anatomy, make the numbered legend and the accessible description agree about the parts shown.

## Two editing passes

The lead applies both passes after integration. The independent reviewer applies them to the assembled pages and assets, returning findings rather than editing files owned by another agent.

1. **Meaning and evidence.** Read the component brief alongside the draft. Check each behavioural claim, recommendation, example, caption, and alternative against its source. Confirm platform/version scope, terminology, conditions, numerical values, and limitations. Identify unsupported claims and missing inputs before polishing them. Keep an unresolved evidence question in the handoff until it is answered.
2. **Composition and voice.** Apply the principles above, first to paragraph structure and then to sentences. Read the result aloud mentally. Remove filler and repetition, clarify actors and conditions, and check UK spelling. Finally compare the revision with the original and its evidence: no fact may be introduced, strengthened, or lost as a side effect of editing. Recheck code and link targets for accidental changes.

Write only the final prose into documentation files. Keep draft critiques and unresolved questions in the handoff. Reviewer findings should identify the location, explain the effect on the reader, and give a concrete correction or the evidence needed to settle it.
