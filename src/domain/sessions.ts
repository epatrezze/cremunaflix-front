import type { Session } from '../contracts';

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
