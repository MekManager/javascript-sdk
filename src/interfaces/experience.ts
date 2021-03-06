/**
 * Describes any object that has experience and how that experience gets
 * interacted with.
 */
export interface IExperience {
  setXP (xp: number, ...args: any): void;
  addXP (xp: number, ...args: any): void;
  removeXP (xp: number, ...args: any): void;
  xpValue (...args: any): number;
}
