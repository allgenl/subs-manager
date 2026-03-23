export function reportWebVitals(metric: { name: string; value: number }) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(1)}ms`);
  }
}
