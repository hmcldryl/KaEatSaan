export interface UpdateLogChange {
  from: unknown;
  to: unknown;
}

export interface UpdateLog {
  id: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  changes: Record<string, UpdateLogChange>;
  timestamp: string;
}
