export function getChartTooltipStyle(isDark: boolean) {
  return {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    fontSize: '13px',
    color: isDark ? '#f3f4f6' : '#111827',
  };
}

export function getGridColor(isDark: boolean) {
  return isDark ? '#374151' : '#e5e7eb';
}

export function getAxisTickColor(isDark: boolean) {
  return isDark ? '#6b7280' : '#9ca3af';
}
