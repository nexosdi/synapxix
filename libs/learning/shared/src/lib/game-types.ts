/**
 * Isomorphic game type definitions — safe to import in both Angular and NestJS contexts.
 * These types have NO Angular dependencies and can be shared across the full stack.
 */

export type GameType =
  | 'avatar'
  | 'read-select'
  | 'listen-type'
  | 'fill-in-the-blanks'
  | 'read-aloud'
  | 'timeline-order'
  | 'categorization'
  | 'spotlight'
  | 'neural-link'
  | 'intruder'
  | 'balance-master'
  | 'sound-match'
  | 'memory-match'
  | 'word-association'
  | 'pattern-recognition'
  | 'speak-about-photo';
