# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: families with children — parents looking for a safe, free game for a child, and kids playing on a phone, tablet or family laptop. Secondary: players nostalgic for classic 80s/90s point-and-click adventures. Visitors arrive in English or Dutch (browser language decides; manual NL/EN toggle).

## Product Purpose

RetroAdventureWorld (www.retroadventureworld.com) is a home for free, hand-made 16-bit pixel-art point-and-click adventures that run instantly in the browser. The homepage's job is to get a visitor into a game within seconds, with as little friction as possible. Success = a click on Play.

## Positioning

Every game is original and made by one creator (Eric Waterschoot): free, no download, no sign-up required to play, bilingual EN/NL, mobile-first and installable as an app (PWA). Short, gentle adventures (15–20 min) with puzzles instead of reflexes — suitable for kids.

## Operating Context

Static site on Vercel (deploys from git main, no build step). Games live in /games/<slug>/. Optional accounts + cloud saves via Supabase (/shared/account.js, account-ui.js) — never required to play. Two of the games are also published on Higgsfield Games (Ravenholt Part 1: vivid-cafe-968.higgsfield.gg, Part 2: rapid-robin-488.higgsfield.gg).

## Capabilities and Constraints

- Games on the site: Maanhoef (easy, ~20 min), The Amulet of Emberfall (easy, ~15 min), Whispers of Ravenholt Part 1 and Part 2 (mystery, a bit more challenging, ~15–20 min each).
- Whispers of Ravenholt Part 1 → Part 2 is one continuous story and should be presented as a series ("start with Part 1").
- Bilingual via data-en / data-nl attributes and a client-side toggle; English is the default HTML language.
- Existing SEO: WebSite, ItemList (VideoGame) and FAQPage JSON-LD; a /point-and-click-adventure-games/ landing page.
- JS for games is served obfuscated (.min.js); readable source stays in git.

## Brand Commitments

Name "RetroAdventureWorld". Pixel-art fonts: the homepage uses Jersey 15 for display lettering (matches the approved world-map comp, 2026-10-21) and Nunito for body text (readable, not pixel); the games themselves still use Press Start 2P / Pixelify Sans. Finn's staff is always plain wood (no gem). The creator explicitly references old-school pixel adventures and the "luminous high-contrast pixel" and "top-down tile pixel" art styles (gameartstyle.loopyhop.com) as direction for the site.

## Evidence on Hand

Real key art per game: games/*/assets/art/title.(png|jpg), assets/banner.png (five heroes around a campfire), Ravenholt win/ending art, scene backgrounds. No reviews, ratings, player counts or press exist — never fabricate them.

## Product Principles

1. One tap to play: the fastest path from landing to a running game wins.
2. Safe and calm for kids: no dark patterns, no ads clutter, no forced accounts.
3. Honest: show real game art and real facts (duration, difficulty, language); no invented social proof.
4. Findable: every game remains crawlable and described in plain language for search engines and AI answers, in EN and NL.

## Accessibility & Inclusion

Young readers and parents on phones: large tap targets, readable body text (pixel fonts only for display), sufficient contrast, works without sign-in, respects reduced motion.
