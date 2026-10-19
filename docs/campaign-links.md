# Campaign links

How we label the links we hand to press and post on social, so every founding
application can be traced back to the thing that produced it.

Attribution is captured on whatever page the visitor lands on, kept in their
browser for 30 days, and written onto the application they submit later. So a
reader can land on the founding page from Mixmag, do nothing, come back three
days later through a bare link, apply, and still count as Mixmag.

Where it shows up: the **Source** badge on each row in `/admin`, the source and
campaign filters beside it, the **Where applications came from** panel in the
Recap tab, and six extra columns in the Recap CSV export.

## Rules

Lowercase, hyphens, never spaces or underscores in values.

| Parameter | Means | Values we use |
|---|---|---|
| `utm_source` | **where** it was seen | `mixmag`, `clubberia`, `instagram`, `email` |
| `utm_medium` | **what format** | `article`, `newsletter`, `bio`, `story`, `post`, `email` |
| `utm_campaign` | the push | `launch` |
| `utm_content` | **which specific piece** | `simone-video`, `china-video`, `collab-post`, … |

`utm_source` is the only one that is mandatory — without it nothing is stored at
all. Always include it. The other three are what let you tell two Mixmag
placements apart, so in practice always set `utm_medium` and `utm_campaign` too.

Invent new values freely. Nothing is hard-coded: a source or campaign that has
never been seen before appears in the admin filters by itself the moment the
first application carries it. Only the parameter **names** are fixed.

Do **not** use `?ref=` for campaigns. That belongs to the member invite links
and must stay untouched.

## Short links

Two paths exist for press placements, where a long URL is impractical — printed
in article copy, read out, or pasted by an editor who might strip the query.

| Short link | Goes to |
|---|---|
| `https://torahub.io/mixmag` | founding page, English, tagged `mixmag` / `article` / `launch` |
| `https://torahub.io/clubberia` | founding page, **Japanese**, tagged `clubberia` / `article` / `launch` |

Give these to the journalist. They are easier to get right than a long string,
and they produce exactly the same stored attribution as the full links below.

They only cover the article placements. Anything that needs its own
`utm_medium` or `utm_content` — a newsletter, a story, a specific video — uses a
full link, otherwise the two placements become indistinguishable.

## Ready links

| Placement | Link |
|---|---|
| Mixmag article | `https://torahub.io/mixmag` |
| Mixmag newsletter | `https://torahub.io/founding/en?utm_source=mixmag&utm_medium=newsletter&utm_campaign=launch` |
| Mixmag Instagram collab | `https://torahub.io/founding/en?utm_source=mixmag&utm_medium=post&utm_campaign=launch&utm_content=collab-post` |
| Clubberia article | `https://torahub.io/clubberia` |
| Instagram bio | `https://torahub.io/founding/en?utm_source=instagram&utm_medium=bio&utm_campaign=launch` |
| Instagram stories | `https://torahub.io/founding/en?utm_source=instagram&utm_medium=story&utm_campaign=launch` |
| Simone video | `https://torahub.io/founding/en?utm_source=instagram&utm_medium=post&utm_campaign=launch&utm_content=simone-video` |
| China video | `https://torahub.io/founding/en?utm_source=instagram&utm_medium=post&utm_campaign=launch&utm_content=china-video` |
| Jenn's press emails | `https://torahub.io/founding/en?utm_source=email&utm_medium=email&utm_campaign=launch&utm_content=press-outreach` |

Use `/founding/jp`, `/founding/es` and so on when the audience reads that
language — the parameters work identically on every language version. Pointing
at `/founding/<lang>` rather than `/founding` also saves a redirect hop.

## Reading the results

- **A Mixmag badge on a row** means that applicant's browser was carrying the
  Mixmag label when they submitted.
- **Direct** means no label was carried. That is normal and will always be a
  large share: a different device from the one that saw the article, private
  browsing, blocked storage, or simply someone who typed the address in.
- Plausible answers the other half — how many people *clicked* from each
  placement. Together: Mixmag sent N visitors, M applied. The goal to create in
  Plausible is named **Application Submitted**.

Direct being large is not a failure of the tracking. Treat the labelled numbers
as a floor, not a total.
