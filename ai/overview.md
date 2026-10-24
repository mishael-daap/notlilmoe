# Overview

## Product

The official website for the artist **notlilmoe** — a single mobile-first page that introduces the artist, collects a fan's email, then sends that fan to notlilmoe's profile on the streaming service they actually use (Spotify or Apple Music).

## Target Users

- **Fans** arriving from a link in bio, a QR code, a show flyer, or a song credit. They want one tap to follow/listen, not a maze.
- **notlilmoe** — needs a link hub that also builds a mailing list he owns, instead of relying purely on platform followers.

## Problem

"Listen here" links dump fans on a page of platform logos and most of them bounce. notlilmoe also has no direct line to listeners — follower counts live inside Spotify and Apple, not with him. One short email gate plus a platform choice captures the fan and completes the intent in two taps.

## Core Features

- **Landing page** (`/`) — mobile-first single page with artist identity, a name + email form, and a footer (socials, privacy policy).
- **Fan capture** — validated name and email stored in a database he owns, so the list is portable to any future tool.
- **Platform page** (`/listen`) — after submitting, the fan lands on a dedicated page where Spotify and Apple Music are the two main items on screen, each with its logo. One tap records the choice and opens the artist profile on that service.
- **Privacy policy** — a plain-language page covering what is collected and how to get it removed, linked from the form.

## Constraints

- Free tier only — no paid services anywhere in the stack.
- Mobile-first: the layout is designed at phone width and scales up.
- Two pages for now: the funnel (`/` → `/listen`) plus the privacy policy.
