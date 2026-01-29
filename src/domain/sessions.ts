import type { Session } from '../contracts';

/**
 * Groups sessions by YYYY-MM-DD date extracted from startsAt.
 *
 * @param items - Session list to group.
 * @returns Map of date keys to sessions.
 */
export const groupSessionsByDay = (items: Session[]) => {
  return items.reduce<Record<string, Session[]>>((acc, session) => {
    const raw = session.startsAt?.trim();
    const keyCandidate = raw ? raw.split('T')[0].split(' ')[0] : '';
    const keyDate = keyCandidate ? new Date(keyCandidate) : null;
    const key =
      keyCandidate && keyDate && !Number.isNaN(keyDate.getTime()) ? keyCandidate : 'unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(session);
    return acc;
  }, {});
};
