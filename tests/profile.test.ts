import { describe, it, expect } from 'vitest';
import { parseProfile } from '../src/lib/profile';

const SAMPLE = `# PROFILE

## Name
valentine

## Headline
Carry

## Tagline
ฟาร์มในเงามืด

## Bio
ย่อหน้าแรก บรรทัดหนึ่ง
ย่อหน้าแรก บรรทัดสอง

ย่อหน้าสอง

## Interests
- ข้อหนึ่ง
- ข้อสอง
- ข้อสาม

## Contact
- email: demo@example.com`;

describe('parseProfile', () => {
  it('reads every line of a multi-line section, not just the first', () => {
    const p = parseProfile(SAMPLE);
    expect(p.interests).toEqual(['ข้อหนึ่ง', 'ข้อสอง', 'ข้อสาม']);
    expect(p.bio).toContain('ย่อหน้าสอง');
  });

  it('splits bio into paragraphs on blank lines', () => {
    const p = parseProfile(SAMPLE);
    expect(p.bioParagraphs).toEqual(['ย่อหน้าแรก บรรทัดหนึ่ง\nย่อหน้าแรก บรรทัดสอง', 'ย่อหน้าสอง']);
  });

  it('reads the tagline and stops sections at the next heading', () => {
    const p = parseProfile(SAMPLE);
    expect(p.tagline).toBe('ฟาร์มในเงามืด');
    expect(p.headline).toBe('Carry');
  });

  it('reads the last section through end of file', () => {
    const p = parseProfile('## Name\nx\n\n## Interests\n- a\n- b\n');
    expect(p.interests).toEqual(['a', 'b']);
  });

  it('does not treat ### subheadings as section boundaries', () => {
    const p = parseProfile('## Bio\nหนึ่ง\n\n### ย่อย\nสอง\n\n## Name\nx');
    expect(p.bio).toContain('สอง');
    expect(p.name).toBe('x');
  });

  it('falls back when sections are missing; tagline is optional', () => {
    const p = parseProfile('# empty');
    expect(p.name).toBeTruthy();
    expect(p.bioParagraphs.length).toBeGreaterThan(0);
    expect(p.tagline).toBe('');
  });
});
