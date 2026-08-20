/**
 * Where each section sits in the stack.
 *
 * Kept in one dependency-free module rather than derived from the section
 * components: the nav and the scroll cues need to jump to sections other than
 * their own, and sourcing those offsets from the sections themselves would put
 * a cycle between a section, the shared nav, and the offset table.
 */

export const SECTION_HEIGHT = {
  hero: 1024,
  about: 1024,
  channels: 1024,
  howItWorks: 1024,
  categories: 1024,
  stats: 1024,
  ai: 1024,
  coverage: 1024,
  pricing: 1024,
  testimonials: 1024,
  footer: 1440,
} as const;

export type SectionId = keyof typeof SECTION_HEIGHT;

export const SECTION_ORDER: SectionId[] = [
  'hero',
  'about',
  'channels',
  'howItWorks',
  'categories',
  'stats',
  'ai',
  'coverage',
  'pricing',
  'testimonials',
  'footer',
];

export const SECTION_TOP = SECTION_ORDER.reduce(
  (acc, id, index) => {
    acc[id] =
      index === 0
        ? 0
        : acc[SECTION_ORDER[index - 1]] + SECTION_HEIGHT[SECTION_ORDER[index - 1]];
    return acc;
  },
  {} as Record<SectionId, number>,
);

export const PAGE_HEIGHT = SECTION_ORDER.reduce((sum, id) => sum + SECTION_HEIGHT[id], 0);

export const SIGNIN_HEIGHT = 1024;
