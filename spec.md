# Character Lore Organizer

## Current State
- localStorage-based character store with full CRUD
- Character model: id, name, faction, value, fame, shortDescription, lore, backstory, traits, funFacts, portraitImageUrl, fullBodyImageUrl, musicUrl, bgColor, textColor, nameFont, nameFontSize, previewAnimation, createdAt, updatedAt
- Views: CharacterSelectView, CharacterProfileView, CharacterEditorView, SearchView
- CharacterPreviewPanel shows name/image/music controls with 16 animations
- CharacterProfileView shows collapsible lore/backstory/funFacts sections
- No tags, gallery images, relationships, comparison view, or card export

## Requested Changes (Diff)

### Add
1. **Character tags/keywords** — new `tags: string[]` field on Character; rendered as a styled chip cloud on the profile below traits; tag input in editor (same pattern as traits)
2. **Relationship map** — new `relationships: { description: string; linkedCharacterId: string }[]` field on Character. Freeform description text per relationship entry (e.g. "Arch-nemesis of Aria"). The `linkedCharacterId` is selected from existing characters via a dropdown in the editor. On the profile, each relationship entry renders its description with any character name detected in the text auto-linked to that character's profile. The linked character's name in the description text is made clickable/highlighted. Also render a small portrait thumbnail next to each entry.
3. **Gallery** — new `galleryImages: string[]` field (base64 array) on Character. New "Gallery" button in CharacterPreviewPanel bottom zone (below "View Full Profile"). Opens a new `CharacterGalleryView` showing a masonry/grid mood board of all gallery images with captions. In the editor, a new "Gallery Images" section supports multi-file upload at once (input multiple). Images can be removed individually.
4. **Character comparison view** — new "Compare" button somewhere in CharacterSelectView header/toolbar. Opens a `CharacterCompareView` where user can pick two characters from dropdowns; displays them side by side showing: portrait, name, faction, value, fame, traits, tags.
5. **Character card export** — "Export Card" button on CharacterProfileView header area. Opens a modal showing a rendered card: portrait fills card, character name at top in their custom font and color, one-sentence description at bottom. Uses html2canvas or a canvas approach to download as PNG.
6. **Auto lore cross-linking** — utility function `linkifyLore(text, characters, onNavigate)` that scans text for any character name, wraps it in a styled clickable span. Applied to lore, backstory, and relationship description text in CharacterProfileView.
7. **Name centering fix** — `h1` character name on CharacterProfileView must be `text-center w-full` unconditionally (not `text-center md:text-left`).
8. **Character migration** — `getCharacters()` migrates old records missing `tags`, `relationships`, `galleryImages` fields with empty defaults.

### Modify
- `Character` interface: add `tags: string[]`, `relationships: { description: string; linkedCharacterId: string }[]`, `galleryImages: string[]`
- `CharacterProfileView`: fix name centering; add Tags section; add Relationships section with cross-link rendering; wire "Export Card" button
- `CharacterEditorView`: add Tags section (same chip input pattern as traits); add Relationships section (freeform text + character picker dropdown); add Gallery Images multi-upload section
- `CharacterPreviewPanel`: add "Gallery" button in bottom zone (between/after "View Full Profile" and music)
- `App.tsx`: add `gallery` and `compare` view routes; wire navigation callbacks
- `characters.ts`: add new fields to interface + migration + sample data updates

### Remove
- Nothing removed

## Implementation Plan
1. Update `Character` interface and migration in `characters.ts` to include `tags`, `relationships`, `galleryImages`
2. Update sample characters with empty arrays for new fields
3. Add `linkifyLore` utility that tokenizes text and returns React nodes with character name spans as clickable links
4. Update `CharacterProfileView`: fix name centering, add Tags collapsible section, add Relationships collapsible section (with portrait thumbnails + linkified descriptions), add Export Card modal using html2canvas
5. Update `CharacterEditorView`: add Tags chip input, add Relationships section (freeform description + character select dropdown + add/remove), add Gallery multi-image upload section
6. Update `CharacterPreviewPanel`: add "Gallery" button in bottom zone
7. Create `CharacterGalleryView` — grid/masonry of gallery images for one character, back button
8. Create `CharacterCompareView` — two character selectors, side-by-side comparison cards
9. Update `App.tsx` — add gallery and compare view types + navigation handlers
