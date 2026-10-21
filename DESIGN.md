---
name: RetroAdventureWorld
description: A walkable 16-bit night overworld where every free point-and-click adventure is a place on the map.
colors:
  night: "#08101b"
  navy: "#0b1622"
  label-glass: "rgba(9, 18, 27, .93)"
  quest-panel-top: "#0d1c2c"
  gold: "#f5b241"
  gold-hi: "#ffd766"
  gilt-rule: "#d9a23c"
  bronze: "#8a4b14"
  outline: "#1a0d05"
  play-top: "#ffcf55"
  play-base: "#f6ae33"
  play-ink: "#2b1606"
  logo-gold: "#f6bf3a"
  logo-outline: "#3b1a0b"
  sign-ink: "#fffdf6"
  ink: "#f2f0ea"
  body-ink: "#d3dae0"
  meta-ink: "#dfe4e8"
  muted: "#93a1ad"
  leaf: "#7fd16a"
  globe-blue: "#6fb7ff"
typography:
  display-logo:
    fontFamily: "'Jersey 15', 'Trebuchet MS', sans-serif"
    fontSize: "calc(37 * var(--u))"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-.01em"
  headline:
    fontFamily: "'Jersey 15', 'Trebuchet MS', sans-serif"
    fontSize: "clamp(34px, 4.6vw, 52px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: ".01em"
  title:
    fontFamily: "'Jersey 15', 'Trebuchet MS', sans-serif"
    fontSize: "clamp(30px, 3.4vw, 40px)"
    fontWeight: 400
    lineHeight: 1
  title-dialog:
    fontFamily: "'Jersey 15', 'Trebuchet MS', sans-serif"
    fontSize: "calc(28 * var(--u))"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-.02em"
  label-place:
    fontFamily: "'Jersey 15', 'Trebuchet MS', sans-serif"
    fontSize: "calc(16 * var(--s))"
    fontWeight: 400
    lineHeight: .95
  meta:
    fontFamily: "'Jersey 15', 'Trebuchet MS', sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.1
  body:
    fontFamily: "'Nunito', 'Trebuchet MS', system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0px"
spacing:
  panel: "22px 24px"
  quest: "18px"
  list-gap: "clamp(28px, 4vw, 44px)"
  section-gap: "clamp(80px, 11vw, 136px)"
components:
  button-play:
    backgroundColor: "{colors.play-base}"
    textColor: "{colors.play-ink}"
    rounded: "{rounded.none}"
    typography: "{typography.title}"
    height: "52px"
    padding: "2px 22px 0"
  label-place:
    backgroundColor: "{colors.label-glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    typography: "{typography.label-place}"
    padding: "calc(7 * var(--s)) calc(10 * var(--s))"
  panel:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
  sign:
    textColor: "{colors.sign-ink}"
    typography: "{typography.meta}"
    width: "calc(80 * var(--u))"
    height: "calc(48 * var(--u))"
  tag:
    backgroundColor: "{colors.gold-hi}"
    textColor: "{colors.outline}"
    rounded: "{rounded.none}"
    padding: "4px 8px 3px"
---

# Design System: RetroAdventureWorld

## Overview

**Creative North Star: "The Night Overworld"**

The homepage is a top-down 16-bit world map at night, not a portal. Games are places; the site's chrome lives inside that world as wooden signboards, gold-ruled navy labels and an RPG dialogue box with a gilt frame. The ground is teal-black night; light comes from gold beacons, fireflies, glinting water and the gold Play button, so warmth always marks where to act.

Everything is pixel-honest: raster plates and sprites render with `image-rendering: pixelated`, borders are stacked hard insets rather than soft strokes, corners are square or stepped, and motion is stepped where it is ambient. Reading text is the one deliberate exception: Nunito carries every sentence a parent or child must read; the pixel face only carries names, labels, facts and buttons.

Below the map the same materials continue as a "quest log": navy panels with gilt rules, quest cards framed in gold and bronze, and the same Play button.

**Key Characteristics:**
- Full-bleed night map (1024 x 688 frame) that fits height and pans.
- Chrome as world objects: wood sign plates, gilt 9-slice dialogue frame, navy labels with inset gold rules.
- Jersey 15 display at comp units; Nunito for reading.
- Gold is the only action colour; beacons and Play share it.
- Real in-game hero sprites walk real routes before a game opens.

## Colors

A night palette of teal-black and navy, lit by one warm gold family, with dark-brown outline ink binding every pixel edge.

### Primary
- **Beacon Gold** (gold, gold-hi): icons, selected states, links, headings below the map (gold-hi), focus ring (3px gold-hi). The light of the world.
- **Play Gold** (play-top over play-base, ink play-ink): the Play free button only, as a hard two-band gradient split at 45/46%.

### Secondary
- **Gilt Rule** (gilt-rule): the 2px inset rule on labels, panels, icon tiles, covers. The frame metal of the system.
- **Bronze** (bronze): outer quest-card ring and scrollbar thumb.
- **Logo Gold / Logo Outline** (logo-gold, logo-outline): wordmark fill and its 8-direction 2u pixel outline; logo-outline also backs the 3px hard drop on section headings.

### Tertiary
- **Leaf** (leaf): the "easy / good for kids" check icon only.
- **Globe Blue** (globe-blue): the NL/EN globe icon only.

### Neutral
- **Night** (night): page, html, theme-color, map surround. Never pure black.
- **Navy** (navy): panels, FAQ items, icon tiles. **Label Glass** (label-glass) for map labels over art. **Quest Panel** (quest-panel-top to night-ish #08131f) for quest cards.
- **Outline** (outline): the near-black brown used as the innermost and outermost line of every frame, and as selection text.
- **Ink** (ink) headings on dark; **Body Ink** (body-ink) paragraphs; **Meta Ink** (meta-ink) fact rows; **Muted** (muted) footer only. **Sign Ink** (sign-ink) on wood with a 1-2px brown text-shadow.

### Named Rules
**The One Warm Light Rule.** Gold means "here, act". Use it for beacons, selection, icons and Play; never as a large background fill except the Play button and the small Part tag.

**The Outline Sandwich Rule.** Every framed object is outline / gold / outline in hard insets (1-3-4u on map labels; 2-4-5px on panels). No 1px grey borders.

## Typography

**Display Font:** Jersey 15 (self-hosted woff2, latin + latin-ext; fallback Trebuchet MS)
**Body Font:** Nunito 400-800 (self-hosted variable woff2; fallback Trebuchet MS, system-ui)

**Character:** A chunky, legible pixel display face that reads as game UI at small sizes, paired with a rounded humanist sans that a young reader can follow.

### Hierarchy
- **Display / wordmark** (400, 37u, 1): logo-board only, logo-gold with pixel outline.
- **Headline** (400, clamp(34px, 4.6vw, 52px), 1): section headings below the map, gold-hi with a 3px hard logo-outline drop.
- **Title** (400, clamp(30px, 3.4vw, 40px)): quest names; dialogue title at 28u (25px on narrow); part titles clamp(26px, 2.6vw, 32px); panel/FAQ titles 25-26px.
- **Meta** (400, 20px, 1.1): fact rows (minutes, difficulty, NL/EN), footer nav, quiet buttons; 18-21u inside the dialogue.
- **Label** (400, 16s, .95; meta 12.5s): map place labels, which scale with the map.
- **Body** (Nunito 400, 18px, 1.55; 17-17.5px in cards and FAQ; lead clamp(18px, 2vw, 21px)): all sentences, max 64ch.

### Named Rules
**The Pixel For Names Rule.** Jersey 15 for names, facts, buttons and headings; any sentence a child must read is Nunito. Never set paragraphs in the pixel face.

**The Weight-400 Rule.** Jersey 15 is always weight 400; hierarchy comes from size and colour, never faux bold.

## Layout

**The stage.** The world is a `100svh` (min 520px) size container. Inside it a scroller holds the stage at the map's 1024:688 aspect, sized to fill height (`width: 148.84cqh`). Map-space unit `--s = 100cqw / 1024`: every place, beacon, sprite, label and ambient particle is positioned in map pixels as percentages of 1024 x 688. When the stage is wider than the screen it pans: native touch scrolling, mouse drag (grab cursor), the camera follows a walking hero, and wood "edge" signs with arrows point to off-screen places. The map's left and right 2.5% fade to night by mask.

**The fog frontier.** The east edge (22% width) is drifting fog: unexplored land. New levels are added by widening the map plate eastwards, adding a place (beacon, label rect, route) in map coordinates and letting the pan reveal it.

**The chrome.** Signs, wordmark and dialogue sit over the world on a comp unit `--u = min(100cqw/1024, 100cqh/688, 1.35px)`, so chrome scales with the viewport but caps at 1.35px per comp pixel. Dialogue: 784u wide, bottom 19u, centred, grid of portrait 102u / text / actions.

**Narrow re-flow (container max-width 760px).** The map stays big and pans; the chrome re-flows instead of shrinking: `--u` re-bases to 560 (signs) and 470 (dialogue), only the NL/EN sign remains beside the wordmark, the dialogue spans 10px insets above the safe area with actions on a second row, and Play drops to fixed 50px height / 27px type. Short wide screens (max-height 560px) pull the dialogue to 8px from the bottom.

**Below the map.** A 1040px wrap, padding clamp(56px, 8vw, 104px) clamp(16px, 4vw, 40px); a 64px night gradient bleeds the map into the page. Two-column intro and how-to collapse to one column at 860px; quest cards go from cover (max 400px) + text to stacked. Section gaps clamp(72-88px, ~10-12vw, 128-140px).

## Elevation & Depth

Depth is pixel-built: stacked hard insets for frames, hard 0-blur offset drops for sprites and lettering, and only a few soft ambient shadows to lift chrome off the busy map.

### Shadow Vocabulary
- **Pixel frame** (`inset 0 0 0 2px outline, inset 0 0 0 4px gilt-rule, inset 0 0 0 5px outline`): panels, FAQ, icon tiles; covers use the same as outer rings.
- **Quest ring** (`inset 0 0 0 2px #2a1606, 0 0 0 3px gold, 0 0 0 5px bronze, 0 0 0 7px outline, 0 12px 28px rgba(0,0,0,.45)`): quest cards.
- **Sprite drop** (`drop-shadow(0 2s 0 rgba(0,0,0,.45))`): heroes on the map; 3px on cover sprites.
- **Lettering drop** (`0 3px 0 logo-outline`): section headings; the wordmark adds a 4u drop under its outline.
- **Chrome lift** (`drop-shadow(0 10u 18u rgba(0,0,0,.55))` dialogue; `0 4s 8s rgba(0,0,0,.5)` labels): the only blurred shadows, reserved for objects floating over the map.

### Named Rules
**The Hard Edge Rule.** Offset shadows on sprites and pixel lettering are 0-blur, as in the games themselves. Blur is only for chrome floating over the map.

## Shapes

Square by default (0 radius). The Play button is a stepped octagon (`clip-path` with 5u corner cut), echoing pixel corner notches. Raster plates (wood boards, dialogue frame) supply their own silhouettes; the dialogue frame is a 384px 9-slice (`border-image` slice 40, 26u border, round). Icons are an inline SVG sprite on an 8 x 8 pixel grid (clock, star, check, pin, play, hand, left, right), filled with currentColor and rendered `crispEdges` at 1em; the globe is the one stroked exception (10 x 10 viewBox). The FAQ toggle is a pixel plus that rotates 45 degrees to an x.

## Components

### Play button
Chunky, warm, unmissable; the single primary action.
- **Shape:** stepped octagon, 5u notch; 192 x 58u in the dialogue, min 168 x 52px below the map.
- **Fill:** play-top over play-base hard split; insets 2px #c9771a, 3px #7a4210, 5px #ffdf86 highlight, -7px #eba13a base band. Text play-ink, Jersey 15 27-30, letter-spacing .03em.
- **States:** hover lifts 2u with brightness(1.07); active presses 2u down; 120ms ease-out.

### Map place
- **Beacon:** radial gold glow, screen blend, `steps(4)` 1.6s pulse; enlarges (30s to 44s) when selected.
- **Label:** label-glass box, outline/gilt/outline insets, title + meta row with gold icons (leaf check for easy). Hover lifts 2s; selected (`aria-pressed`) swaps the rule to gold-hi and adds a 2s gold halo. First tap selects, second tap (or Play) sends the hero to the door and opens the game.

### Wood signs (navigation)
Raster wood plates (board-games/about/faq/lang) with text set in code, Jersey 15 18u, sign-ink with brown text-shadow; active language in gold-hi. Hover swings the sign 2u down and -1deg. The wordmark sits on its own logo-board plate. Off-screen place pointers and the account button reuse the board plate.

### RPG dialogue box
The selected adventure's card: gilt 9-slice frame, hero portrait ringed outline/gold/outline, title, a one-line subtitle typed in two characters per 16ms, fact row (clock, star or check, globe; dots in #5d6b78), Play free and a quiet "next" link that walks to the series' other part.

### Panels and quest cards
Navy panels with the pixel frame for at-a-glance, FAQ items and 56px icon tiles. Quest cards: vertical navy gradient, quest ring, 16:9 cover with the hero sprite standing in its corner (cover zooms 1.04 on hover over 600ms). The Ravenholt series card holds Part 1 and Part 2 side by side with gold Part tags.

### Quiet actions
"Show on map", dialogue "next" and footer links: Jersey 15 18-20px, near-white, turning gold-hi with a 2px underline on hover.

### Motion grammar
- **Easing:** `--ease-out: cubic-bezier(.16, 1, .3, 1)` for all UI transitions (120ms buttons, 200-250ms signs/labels, 600ms cover zoom).
- **Hero walk:** heroes follow a Catmull-Rom curve through their route waypoints (8 samples per segment), with a sine ease-in-out over the whole walk (≈320ms extra for start and stop) at 115 map-px/s (220 when launching a game). Leg frames follow distance, not time (`stride` map-px per frame), so feet never slide. A soft ground shadow sits under each sprite, sprites scale 0.90–1.06 by map depth (y), and three dust puffs rise at take-off. On arrival a hero waves (their own wave sprite, 6 × 230ms); a launch skips the wave and opens the game. Idle: a 0.8 map-px breathing bob (`steps(2)`), Finn blinks now and then, and heroes not on a journey shuffle a few map-px along their path and back. Reduced motion: heroes teleport, no wave, no wander, no idle loops.
- **Fog signpost:** a wooden arrow plate (`assets/plates/arrow-sign.png`) at the fog edge reads "More adventures coming" / "Nieuwe avonturen volgen"; it nudges right every 2.6s and opens a dialog state with a pixel question-mark portrait and an "All games" button. New levels are added east of it.
- **Ambient life:** fireflies, water glints, stars, chimney smoke and fog; loops use `steps()` (fly and fog drift use eased paths).
- **Reduced motion:** all ambient and idle animation stops, fireflies/glints/smoke are hidden, transitions on labels/signs/Play drop, heroes teleport, text is not typed, and Play navigates immediately.

## Pages and languages

- `/` (English) and `/nl/` (Dutch) are two real URLs with hreflang in both directions; `nl/index.html` is generated from `index.html` by `python3 tools/build-nl.py` (never edit it by hand). Visible text carries `data-en`/`data-nl`; the map script reads `<html data-page-lang>`. The NL/EN sign is a link between the two.
- `/point-and-click-games-for-kids/` is the parents' guide in the same world (map-plate header, logo board, quest-style cards, gilt-rule boxes).

## Do's and Don'ts

### Do:
- **Do** place every new game as a place on the map (beacon, gold-ruled label, hero route) in 1024 x 688 map coordinates; add new land in the fog to the east.
- **Do** use the real in-game protagonist sprites, walk sheets and portraits for heroes; Finn's staff is always plain wood, never a gem.
- **Do** build frames as outline / gilt / outline hard insets and render all raster art with `image-rendering: pixelated`.
- **Do** keep wood signs as raster plates with live text in code so EN/NL can swap.
- **Do** size chrome in comp units (`--u`) and map objects in map units (`--s`); re-flow chrome on narrow containers rather than shrinking it.
- **Do** honour reduced motion exactly as the motion grammar specifies.

### Don't:
- **Don't** set sentences or paragraphs in Jersey 15; reading text is Nunito.
- **Don't** use gold for anything that is not light or action.
- **Don't** round corners or frame objects with thin grey borders; corners are square or stepped (the footer's 2px #1d2b3a top rule is the one plain divider).
- **Don't** use smooth eased loops for ambient sprites where a `steps()` loop fits the pixel world.
- **Don't** invent heroes, art or game facts; use only real key art, real minutes, difficulty and languages.
