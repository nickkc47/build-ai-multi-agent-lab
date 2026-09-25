/**
 * Profile helpers. Learners fill docs/PROFILE.md in Lab 01.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Profile = {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  bioParagraphs: string[];
  audience: string;
  interests: string[];
};

/**
 * FALLBACK renders publicly when docs/PROFILE.md is missing or a section is
 * empty — keep it course-free (no lab references); learner hints belong in
 * comments and docs, not in rendered fallback text.
 */
const FALLBACK: Profile = {
  name: 'Your Name',
  headline: 'Personal branding site',
  tagline: '',
  bio: 'This personal site is still being built — content is coming soon.',
  audience: 'Hiring managers / peers / community',
  interests: ['AI agents', 'Web', 'Teaching'],
  bioParagraphs: [],
};
FALLBACK.bioParagraphs = [FALLBACK.bio];

function profilePath(): string {
  const candidates = [
    join(process.cwd(), 'docs', 'PROFILE.md'),
    join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'PROFILE.md'),
  ];
  return candidates.find((p) => existsSync(p)) || candidates[0];
}

export function loadProfile(): Profile {
  const path = profilePath();
  if (!existsSync(path)) return FALLBACK;
  return parseProfile(readFileSync(path, 'utf8'));
}
/**
 * Parse PROFILE.md text. A section runs from its `## Label` line to the next
 * `## ` heading or end of file (`###` subheadings stay inside the section).
 * L2: the old regex used `$` with the `m` flag, which matched the end of the
 * first line, so every section was cut to one line.
 */
export function parseProfile(text: string): Profile {
  const raw = text.replace(/\r\n/g, '\n');
  const get = (label: string) => {
    const m = raw.match(new RegExp(String.raw`^##[ \t]*${label}[ \t]*\n([\s\S]*?)(?=^##[ \t]|(?![\s\S]))`, 'm'));
    return (m?.[1] || '').trim();
  };
  const interests = get('Interests')
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
  const bio = get('Bio') || FALLBACK.bio;
  return {
    name: get('Name') || FALLBACK.name,
    headline: get('Headline') || FALLBACK.headline,
    tagline: get('Tagline'),
    bio,
    bioParagraphs: bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    audience: get('Audience') || FALLBACK.audience,
    interests: interests.length ? interests : FALLBACK.interests,
  };
}
