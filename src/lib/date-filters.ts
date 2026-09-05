export type DateFilterKey =
  | "today"
  | "tomorrow"
  | "this-week"
  | "this-weekend"
  | "this-month"
  | "custom";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function resolveDateRange(
  key?: string,
  customFrom?: string,
  customTo?: string
): { gte?: Date; lte?: Date } {
  const now = new Date();

  switch (key) {
    case "today":
      return { gte: startOfDay(now), lte: endOfDay(now) };
    case "tomorrow": {
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      return { gte: startOfDay(t), lte: endOfDay(t) };
    }
    case "this-week": {
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      return { gte: startOfDay(now), lte: endOfDay(end) };
    }
    case "this-weekend": {
      const day = now.getDay(); // 0 = Sunday
      const daysUntilSat = (6 - day + 7) % 7;
      const sat = new Date(now);
      sat.setDate(sat.getDate() + daysUntilSat);
      const sun = new Date(sat);
      sun.setDate(sun.getDate() + 1);
      return { gte: startOfDay(sat), lte: endOfDay(sun) };
    }
    case "this-month": {
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { gte: startOfDay(now), lte: endOfDay(end) };
    }
    case "custom": {
      const gte = customFrom ? startOfDay(new Date(customFrom)) : undefined;
      const lte = customTo ? endOfDay(new Date(customTo)) : undefined;
      return { gte, lte };
    }
    default:
      return {};
  }
}

export const DATE_FILTER_OPTIONS: { key: DateFilterKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "this-week", label: "This Week" },
  { key: "this-weekend", label: "This Weekend" },
  { key: "this-month", label: "This Month" },
  { key: "custom", label: "Custom Date" },
];
