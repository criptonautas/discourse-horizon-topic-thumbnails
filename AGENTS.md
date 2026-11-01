# Horizon Topic Thumbnails — agent guide

Rules for anyone changing this repo, people and AI agents alike. Org-wide
conventions (README, licenses, commits) are in the [contributing guide](https://github.com/somos-criptonautas/.github/blob/main/CONTRIBUTING.md).

## Checks

```bash
pnpm install && pnpm lint
node scripts/thumbnail-source.test.mjs   # image picking and category scope
discourse_theme rspec .
```

CI runs all three. Screenshots in `docs/screenshots/` come from
`spec/system/screenshots_spec.rb` via Actions → Screenshots. That spec syncs core's
Horizon theme and attaches the component to it; the core features spec does not.

## Things that are easy to get wrong

- It depends on three Horizon names: the column key `high-context-card` and the
  classes `--high-context` and `.hc-topic-card`. If Horizon renames one,
  thumbnails stop rendering without an error.
- Category scope is read when the cell renders, not in the `topic-list-columns`
  transformer: that transformer's context is not the route's category, and
  `TopicList#columns` is cached across navigation.
- Images load through a srcset: the sizes declared in `about.json` plus the original
  as the largest candidate. Dropping the larger size makes retina screens fetch the
  original, and dropping the srcset makes every list download all the originals.
- Never edit Horizon. Removing the component must leave it untouched.
