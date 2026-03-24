const BACKUP_KEY = 'subs-auto-backup';
const BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24h

export function autoBackup(data: unknown) {
  const lastBackup = localStorage.getItem(BACKUP_KEY + '-time');
  if (lastBackup && Date.now() - parseInt(lastBackup) < BACKUP_INTERVAL) return;

  localStorage.setItem(BACKUP_KEY, JSON.stringify(data));
  localStorage.setItem(BACKUP_KEY + '-time', Date.now().toString());
}

export function getLastBackup(): unknown | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
