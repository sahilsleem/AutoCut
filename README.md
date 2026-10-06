# AutoCut

**Turn clips into videos.**

AutoCut is a unified AI-powered video editing application designed to transform raw footage into finished **long-form horizontal videos** and **short-form vertical videos** from a single workflow.

It combines automated media intelligence, transcription, timeline generation, video processing, caption rendering, editing controls, and final rendering into one application.

---

## What AutoCut Does

AutoCut is built around two editing workflows.

### Long-form Video

A cinematic horizontal editing workflow designed for YouTube-style content.

AutoCut can process raw footage and assist with:

* Automatic transcription
* Speech-aware timeline generation
* Media analysis
* Visual content understanding
* Intelligent clip matching
* Timeline beat generation
* Shot segmentation
* Automated editing workflows
* Video rendering
* Audio processing
* Final 16:9 output

The goal is to reduce the amount of manual work required to turn hours of raw material into a structured video.

### Vertical Video

A dedicated 9:16 workflow for short-form content.

It includes:

* Video trimming
* Frame-accurate seeking
* Interactive timeline editing
* Automatic caption rendering
* Manual caption control
* Emoji rendering
* Main and curiosity editing modes
* Independent editing state
* Transition handling
* Video/audio enhancement
* Final 1080×1920 rendering

The vertical editor is designed around fast iteration: import footage, edit, preview, adjust, and render.

---

# Architecture

AutoCut is not simply a video player with an FFmpeg button.

The application combines multiple processing stages into a single editing pipeline.

```text
                    ┌─────────────────────┐
                    │      AutoCut        │
                    │   Unified Editor    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
      ┌───────▼────────┐              ┌─────────▼────────┐
      │   Long-form    │              │     Vertical      │
      │    Pipeline    │              │     Pipeline      │
      └───────┬────────┘              └─────────┬─────────┘
              │                                 │
      ┌───────▼────────┐              ┌─────────▼─────────┐
      │ Transcription  │              │ Timeline / Trim   │
      ├────────────────┤              ├───────────────────┤
      │ Media Analysis │              │ Caption Engine    │
      ├────────────────┤              ├───────────────────┤
      │ Shot Detection │              │ Emoji Rendering   │
      ├────────────────┤              ├───────────────────┤
      │ Beat Building  │              │ Video Processing  │
      ├────────────────┤              ├───────────────────┤
      │ Media Matching │              │ Audio Processing  │
      └───────┬────────┘              └─────────┬─────────┘
              │                                 │
              └────────────────┬────────────────┘
                               │
                       ┌───────▼────────┐
                       │ Render Engine  │
                       └───────┬────────┘
                               │
                       ┌───────▼────────┐
                       │ Finished Video │
                       └────────────────┘
```

---

# AI & Media Intelligence

The long-form workflow is built around automated understanding of the source material rather than treating every uploaded clip as a completely manual editing operation.

The processing pipeline can combine:

**Audio → transcription → timing information → semantic understanding → shot structure → timeline beats → media selection → rendering**

This allows AutoCut to reason about footage at multiple levels:

* What is being said
* When it is being said
* Where individual shots begin and end
* Which footage belongs to a particular segment
* How individual segments can be arranged into a coherent timeline

This architecture makes it possible to build increasingly automated editing workflows without replacing the underlying editor.

---

# Video Processing

AutoCut uses a dedicated video-processing layer for operations such as:

* Trimming
* Cutting
* Scaling
* Cropping
* Overlay composition
* Caption composition
* Audio processing
* Video enhancement
* Format conversion
* Final rendering

Processing is performed as a deterministic pipeline rather than modifying source media destructively.

The editor maintains the user's editing state and generates the final media only when rendering is requested.

---

# Caption Rendering

Captions are treated as part of the rendering system rather than simple HTML text placed over a video preview.

The vertical renderer supports:

* Automatic text wrapping
* Manual line breaks
* Multi-line captions
* Per-segment styling
* Conditional emphasis
* Color-based emphasis
* Caption positioning
* Font selection
* Emoji rendering
* Final-resolution composition

This allows the preview/editor state and the final rendered video to remain separate.

The preview is used for editing and interaction.

The renderer produces the actual finished composition.

---

# Timeline Engine

The vertical editor includes an interactive timeline designed for frame-level control.

Users can:

* Click anywhere on the timeline to seek
* Move the playhead instantly
* Step forward by one frame
* Step backward by one frame
* Hold frame controls for continuous seeking
* Resume playback from a new position
* Preserve playback state when seeking
* Clamp seeking to the media duration

Seeking is handled through a dedicated request/seek state mechanism rather than repeatedly performing uncontrolled media seeks.

The result is responsive timeline interaction without introducing a second, disconnected seek bar.

---

# Editing State Isolation

AutoCut's editing workflows maintain independent state for different editing modes.

For vertical editing, **Main** and **Curiosity** operate independently.

Each mode can maintain its own:

* Video
* Caption
* Emoji
* Trim state
* Timeline position
* Editing state
* Rendering behavior

This prevents changes made in one editing workflow from unexpectedly affecting another.

Curiosity editing additionally supports intentional black-screen transitions between its media segments.

---

# Rendering Pipeline

The final output is generated through a dedicated rendering pipeline.

A simplified rendering flow is:

```text
Source Media
     │
     ▼
Trim / Cut
     │
     ▼
Transform / Scale
     │
     ▼
Caption Composition
     │
     ▼
Emoji / Branding
     │
     ▼
Audio Processing
     │
     ▼
Video Enhancement
     │
     ▼
Final Encode
     │
     ▼
Finished Video
```

The rendering system is designed so that editing operations can be composed into a predictable final output rather than relying on destructive modifications to the original media.

---

# Output Formats

### Long-form

**16:9 horizontal video**

Designed for cinematic and YouTube-style content.

### Vertical

**9:16 video**

Designed for:

* YouTube Shorts
* Instagram Reels
* TikTok
* Other vertical-video platforms

The application keeps these workflows inside the same product instead of requiring separate editing applications.

---

# Design Philosophy

AutoCut is intentionally focused on reducing unnecessary editing friction.

The product follows a few principles:

**One application.**

Long-form and vertical editing belong in the same workflow.

**Automation where it matters.**

Repetitive editing tasks should be handled automatically whenever possible.

**Creative control remains with the creator.**

Automation should assist the editor, not hide the editing process.

**Fast interaction.**

Timeline operations, preview controls, trimming, and seeking should feel immediate.

**Non-destructive workflow.**

Source footage should remain separate from generated output.

---

# Technology

AutoCut combines a web-based editing interface with dedicated media-processing and AI components.

The architecture includes:

* Modern browser-based editor UI
* Local media processing
* Video/audio processing pipelines
* Speech transcription
* Computer-vision-based media analysis
* Semantic media matching
* Timeline generation
* Automated rendering
* Client-side application state
* Persistent editor state
* AI-assisted content generation

The system is intentionally modular so individual processing stages can evolve independently without requiring the editor itself to be rewritten.

---

# Project Structure

The repository contains the application and its supporting processing components.

At a high level:

```text
AutoCut/
│
├── frontend / editor
│   ├── Editing interface
│   ├── Timeline
│   ├── Preview
│   ├── Caption controls
│   └── Rendering controls
│
├── video processing
│   ├── Video operations
│   ├── Audio processing
│   ├── Composition
│   └── Rendering
│
├── AI / media intelligence
│   ├── Transcription
│   ├── Vision analysis
│   ├── Media matching
│   └── Timeline generation
│
└── supporting services
    └── Processing workers
```

The exact internal implementation may evolve as AutoCut develops.

---

# Performance Philosophy

AutoCut is designed around the idea that the editor should remain lightweight while computationally expensive operations are isolated into processing stages.

Interactive operations such as:

* Seeking
* Timeline navigation
* Caption editing
* Trimming
* Preview control

are kept separate from heavier operations such as:

* Transcription
* Vision analysis
* Media matching
* Rendering
* Encoding

This separation allows the editing experience to remain responsive while heavier processing occurs independently.

---

# Why AutoCut?

Traditional video production often requires multiple disconnected tools:

```text
Video Editor
     +
Transcription Tool
     +
AI Tool
     +
Caption Tool
     +
Media Search
     +
Video Converter
     +
Rendering Pipeline
```

AutoCut is built around bringing these stages together.

```text
                 ┌───────────────┐
                 │    AutoCut     │
                 └───────┬───────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
   Long-form         Vertical          AI / Media
     Editing          Editing          Intelligence
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                    Final Video
```

The objective is simple:

**Raw footage in. Finished video out.**

---

# Built By

**Sahil Saleem** — creator and maintainer of AutoCut

Instagram: `sahilsleem`  
GitHub: `sahilsleem`  
Email: `isahilsaleem@gmail.com`

---

## Project Status

**AutoCut v1.0**

The current release represents the first stable unified version of the AutoCut editing platform.

Development continues as new editing, automation, AI, and media-processing capabilities are added.

---

## License

AutoCut is released under the MIT License. You are free to use, modify, distribute, and build upon the project, including for commercial purposes, subject to the terms of the license.

Copyright © 2026 Sahil Saleem

