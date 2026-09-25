import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { HEROES, META, heroSlug, findHero, heroImage } from '../src/data/heroes';
import { loadProfile } from '../src/lib/profile';

describe('hero guide data', () => {
  it('turns PROFILE hero names into slugs', () => {
    expect(heroSlug('Phantom Lancer (PL)')).toBe('phantom-lancer');
    expect(heroSlug('Slark')).toBe('slark');
  });

  it('has a guide for every hero in the PROFILE hero pool', () => {
    for (const hero of loadProfile().heroPool) {
      expect(findHero(heroSlug(hero.name)), hero.name).toBeDefined();
    }
  });

  it('has exactly one signature hero and unique slugs', () => {
    expect(HEROES.filter((h) => h.signature)).toHaveLength(1);
    expect(new Set(HEROES.map((h) => h.slug)).size).toBe(HEROES.length);
  });

  it('every guide is filled in', () => {
    for (const h of HEROES) {
      expect(h.playstyle, h.slug).toBeTruthy();
      expect(h.items.core.length, h.slug).toBeGreaterThan(0);
      expect(h.strongAgainst.length, h.slug).toBeGreaterThan(0);
      expect(h.weakAgainst.length, h.slug).toBeGreaterThan(0);
      expect(h.timings.length, h.slug).toBeGreaterThan(0);
    }
  });

  it('meta is listed newest patch first, each with picks', () => {
    expect(META.length).toBeGreaterThan(0);
    const dates = META.map((m) => m.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    for (const m of META) expect(m.picks.length, m.patch).toBeGreaterThan(0);
  });

  it('every hero has a portrait in public/', () => {
    for (const h of HEROES) {
      const src = heroImage(h.slug);
      expect(src.startsWith('/img/heroes/'), h.slug).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', src)), src).toBe(true);
    }
  });
});
