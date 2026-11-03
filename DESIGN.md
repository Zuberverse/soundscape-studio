# Soundscape Studio design

**Last Modified:** 2026-11-02
**Owner:** this file. Experimental local v0.1; source design is not a hosted release.

## Intent

A small creative studio built around the scene being made. The image is the visual center; the library, sound and direction remain nearby. The November 2 MetaDJ.ai reference informed the midnight palette, restrained luminous artwork, gold signature and type roles. Soundscape keeps its own portal mark and product vocabulary; no artist avatar or private brand assets are required.

## Layout and hierarchy

Desktop uses one window: a 250–280px asset library, flexible central stage, a 300–360px full-height inspector and a compact sound deck under the stage. Independent panel scrolling replaces document scrolling. The inspector's review/create action stays visible. At widths below 901px, Library / Stage / Sound / Controls tabs show one panel at a time.

Frames and Scenes are library tabs. Create frame and Upload image sit above frame assets; Import video sits above scene assets. Asset rows use images, type and separators rather than nested rounded cards. The selected frame has a quiet gold outline and label. Scenes open on the stage. The Frame/Result switch retains the reference while viewing progress or output. Example playback is a clear separate action. New scene clears the optional scene name while retaining selected media and direction.

Frame means reusable still image. Scene means frame + sound + movement. Video means the exported file format. World remains in the tagline. Appearance recipes live in frame creation; movement presets live in the scene inspector. Changing the setting is done with another frame. Names are editable before/after creation and default when omitted.

The four sound sources are visible together. Once audio is loaded, source controls compact into a toolbar, leaving waveform, player and excerpt fields. The selected passage is shaded. Prompts remain 176px high with internal scrolling and no drag resizing. Advanced variation/workflow controls are disclosed on request.

## Visual roles

| Role | Choice |
|---|---|
| Canvas/background | Midnight `#060818`; dark image-backed atmosphere |
| Panels/fields | `#101629`, `#0A0D20`, `#171F38`; thin blue-violet separators |
| Signature/name | Cinzel with warm gold `#F5C97B` |
| Structural heading | Michroma, near-white `#E8ECFF` |
| Body and fields | Chakra Petch, body `#DDE2F5`, metadata `#A5AFD0` |
| Buttons and compact labels | Oxanium |
| Inviting editorial voice | EB Garamond italic, used sparingly |
| Primary action/focus | Violet `#B794FF` to cyan `#85EBFF`; cyan keyboard focus |
| Connection state | Steady green check and “Comfy connected”; subdued Manage action |
| Error | Soft red `#FFADB6`, always with text |

The stepped gold portal icon was generated and resized through Comfy. Bundled fonts retain their OFL notices. Palette adaptations and the icon are local product choices, not changes to any shared brand system.

## States and accessibility

A boot state keeps controls inert until draft restoration finishes. Connection, media readiness and generation are separate states. Authentication alone does not prove credits or execution access. Review starts with credit consent unchecked. Real queued/running/downloading labels and a spinner show work; reduced-motion preferences stop animation. Errors remain textual, and uncertain jobs are not automatically repeated.

Use semantic buttons, named inputs/dialogs, visible keyboard focus and status announcements. The microphone starts only from its explicit control and releases tracks on stop/failure. Dialogs constrain height and scroll. At compact desktop sizes the inspector may scroll; creation remains visible. The central preview uses contain scaling so the source frame is not cropped. No decorative motion competes with it.

## Verification and future changes

Inspect rendered desktop, compact desktop and phone screens, then exercise library selection, sound, fixed prompt, review and results. Acceptance: no document overflow, no overlapping controls, visible create action, clear selected frame, whole source image and no browser errors. The initial review used 1440×1000, 1100×760 and 390×844, with additional small-size checks. The regression suite writes its screenshots to temporary storage.

Source styles are owned by `studio/styles.css`; the implementation pin belongs to the private adopter's design register. Keep public source independent of private systems. Preserve the type/palette hierarchy when adjusting density; compact spacing before shrinking essential text.
