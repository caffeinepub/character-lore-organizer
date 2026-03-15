# Character Lore Organizer

## Current State

Full-featured character wiki builder with:
- Character select screen (portrait grid sidebar, preview panel with animations, full-body image center)
- Character profiles (custom colors/fonts, hex stats, galleries, after dark gallery)
- Entry animations (Sparkle, Wave, Fire, Vines, Ice Shatter, Spooky Skull, Science 3 colors, Lightning Blue/Yellow, Golden Shield, Door & Lock, Holy Wings, Glitch, Sun Rising, Moon Rising, Floating Hearts, Gambler Dice, Gold Coins Rain, Flower Spin)
- Lore section (multi-entry wiki with character name auto-links)
- Factions page (preview + full profile, known/ex members, accent color)
- Artifacts page (preview + full profile, rarity, wielded by)
- Character comparison (5-panel swipe: Face-Off, Hex Charts, Stat Bars, Overview, Verdict)
- Power field (0-999 number), Fame field, sorting
- Word search, search history (last 3), D6 random character roller
- Pinning, portrait border colors, signature quotes, tags, relationships
- IndexedDB storage

## Requested Changes (Diff)

### Add
- **Dark/light mode toggle** in the app header/nav - persisted in localStorage
- **Last Updated timestamp** at the bottom of the character full profile page (not preview)
- **Lore cross-links expanded**: faction names and artifact names in lore/backstory text also become clickable links (in addition to character names already working)
- **Power level → Tier system**: replace the numeric 0-999 Power input with a dropdown tier: Fledgling, Common, Notable, Renowned, Legendary, Mythic. Show tier as a colored badge on profile and roster. Keep sorting by tier (in order of tier rank).
- **Swipeable Abilities panel on preview**: when a character's preview panel is open, the user can swipe left to reveal a second panel showing that character's abilities list. Swipe right to go back to the main preview. Abilities are a list of items each with: name, short description, optionally an icon/emoji. Abilities are added/edited in the character editor.
- **Editor PIN gate** ("yugi"): a PIN is required once per browser session to unlock editing. Covers all create/edit/delete actions for characters, factions, artifacts, lore entries. Viewing/browsing stays open. PIN stored in sessionStorage so not required again until tab is closed.
- **After Dark PIN** also once per session (already implemented - verify it uses sessionStorage not prompt-every-time)

### Modify
- **Entry animations**: make all animations more visible and have them overlay the character image during their sequence. Specific improvements:
  - Sparkles: more particles (20+), larger stars, scattered across entire panel including over the image
  - Sun Rising: full complete sun disk rises up from bottom, clearly visible above midpoint before fading
  - Ice Shatter: show crack lines spreading across the panel first, then shatter effect
  - Science bubbles: bubbles rise much higher, well past the midpoint, cross over the character image
  - All other animations reviewed for visibility and prominence

### Remove
- Numeric power input (replaced by tier dropdown)

## Implementation Plan

1. Add `abilities` array field to character data model (each ability: id, name, description, emoji)
2. Add `powerTier` string field replacing numeric `power` (values: Fledgling/Common/Notable/Renowned/Legendary/Mythic)
3. Add dark/light mode toggle to nav header, persist in localStorage, apply to entire app via CSS class
4. Add tier badge display on character profile and roster cards
5. Update sort logic for tier (rank order not alphabetical)
6. Add abilities editor in CharacterEditorView (add/remove/edit abilities list)
7. Add swipeable second panel on CharacterPreviewPanel showing abilities list, with swipe left/right gesture and dot indicator
8. Rework all entry animations to overlay image and be more visible
9. Add lastUpdated field tracking and display at bottom of CharacterProfileView
10. Expand linkifyText utility to also detect and link faction names and artifact names
11. Add Editor PIN gate component - checks sessionStorage, shows PIN modal on first edit action per session
12. Ensure After Dark PIN also uses sessionStorage (once per session)
