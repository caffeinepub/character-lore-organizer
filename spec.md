# Character Lore Organizer

## Current State

- Full character roster with portrait grid sidebar, preview panel, and profile views
- Character editor with CRUD, images, music, colors, fonts, animations
- 18 entry animations for the preview panel
- Random character button using a D20 SVG die
- Factions, Lore, Gallery, After Dark (PIN-protected), Compare, Search views
- Characters store with: name, faction, value, fame, title, lore, backstory, traits, funFacts, tags, relationships, galleryImages, afterDarkImages, portraits, music, bgColor, textColor, nameFont, nameFontSize, titleFontSize, previewAnimation
- Factions store with: name, symbolImageUrl, shortDescription, lore, exMembers
- SortBar with: faction, name, value, fame, createdAt, updatedAt
- Search with text across all character fields

## Requested Changes (Diff)

### Add

1. **Six-sided die (D6) SVG** to replace the current D20 SVG in CharacterSelectView — show a cube face with 1–6 dot pips, glowing gold, animates rolling then reveals character name
2. **Gambler animation** — new entry animation: two six-sided dice roll up from the bottom, tumble/spin, land, then vanish before character image fades in (CSS keyframe overlay)
3. **Gold Coins animation** — new entry animation: coins rain down from the top of the preview panel before character image fades in (CSS keyframe overlay)
4. **Flower animation** — new entry animation: a flower SVG spins gently on screen then fades away before character image reveals (CSS keyframe overlay)
5. **Search history** — last 3 searches saved to localStorage, shown as quick-click chips below the search input in SearchView
6. **Pin/Favorite characters** — star icon on each portrait card in the sidebar; pinned characters always float to the top of the roster above other sorted characters; `pinned: boolean` field added to Character type with migration
7. **Portrait border color** — per-character color picker in the editor (hex + color input); `portraitBorderColor: string` added to Character type; applied as border color on the portrait card in the sidebar
8. **Faction accent color** — `accentColor: string` field added to Faction type; color picker in FactionEditorModal; faction cards in FactionSelectView get a subtle tint/glow using their accent color
9. **Signature field** — `signature: string` field added to Character type; textarea in editor under Profile Appearance; displayed prominently on CharacterProfileView with distinct italic styling, quoted format, labeled "Signature"

### Modify

- **Character store migration** — add `pinned`, `portraitBorderColor`, `signature` fields with safe defaults in `getCharacters()` migration block
- **Faction store migration** — add `accentColor` field with default `#c9a84c` in `getFactions()` migration block
- **CharacterSelectView** — replace D20Svg with D6Svg component; pin indicator (⭐ or star icon) overlaid on portrait card; sorting logic: pinned characters always sort to top before applying current sort; portrait card border uses `char.portraitBorderColor` when set
- **CharacterEditorView** — add Portrait Border Color field (color picker + hex input) in Profile Appearance section; add Signature textarea in Lore section (or Profile Appearance); add `pinned` toggle/checkbox
- **CharacterPreviewPanel** — add Gambler, Gold Coins, and Flower animation cases to `getAnimationProps` and overlay rendering
- **CharacterProfileView** — add Signature section displayed near the top of the profile (below name/title), styled as a large italic quote
- **FactionSelectView/FactionEditorModal** — add accent color field; faction cards tinted with accent color
- **SearchView** — add search history (last 3) stored in localStorage, displayed as chip buttons above/below search input
- **ANIMATION_OPTIONS** in CharacterEditorView — add gambler, gold-coins, flower entries
- **index.css** — add CSS keyframe animations for gambler dice, gold coins raining, and flower spin/fade

### Remove

- D20Svg component (replaced by D6Svg)
- `Dice5` lucide icon import (replaced with custom D6Svg or kept if no conflict)

## Implementation Plan

1. Update `characters.ts` store: add `pinned`, `portraitBorderColor`, `signature` fields + migration
2. Update `factions.ts` store: add `accentColor` field + migration
3. Add D6Svg component in CharacterSelectView, replace D20Svg usage and label
4. Add new CSS animations in index.css: gambler-dice, gold-coins-rain, flower-spin
5. Add GamblerOverlay, GoldCoinsOverlay, FlowerOverlay components in CharacterPreviewPanel
6. Add gambler/gold-coins/flower cases to getAnimationProps and overlay render block
7. Update CharacterSelectView: pin star on portrait cards, pinned-first sorting, portraitBorderColor border
8. Update CharacterEditorView: Portrait Border Color picker, Signature field, pinned toggle, new animation options
9. Update CharacterProfileView: Signature display section
10. Update FactionEditorModal: accentColor picker
11. Update FactionSelectView: faction card accent color tinting
12. Update SearchView: search history localStorage (last 3), chip display
13. Validate and fix any TypeScript errors
