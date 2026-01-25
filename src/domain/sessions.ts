import type { Session } from '../contracts';

/**
 * Groups sessions by YYYY-MM-DD date extracted from startsAt.
 *
 * @param items - Session list to group.
 * @returns Map of date keys to sessions.
 */
export const groupSessionsByDay = (items: Session[]) => {
  return items.reduce<Record<string, Session[]>>((acc, session) => {
    const key = session.startsAt.split('T')[0];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(session);
    return acc;
  }, {});
};
