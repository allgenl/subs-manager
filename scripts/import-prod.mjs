// Запуск: node scripts/import-prod.mjs <email> <password>
const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: node scripts/import-prod.mjs <email> <password>');
  process.exit(1);
}

const BASE = 'https://subs.allgenl.pro';

const SUBSCRIPTIONS = [
  {"name":"МТС","price":246,"currency":"RUB","frequency":"monthly","category":"other","nextPaymentDate":"2026-04-21","startDate":"2026-03-21","isActive":true},
  {"name":"Тройка","price":24900,"currency":"RUB","frequency":"yearly","category":"other","nextPaymentDate":"2026-06-26","startDate":"2025-06-26","isActive":true},
  {"name":"Яндекс Плюс","price":3490,"currency":"RUB","frequency":"yearly","category":"music","nextPaymentDate":"2026-10-07","startDate":"2026-03-24","isActive":true},
  {"name":"X5 Пакет","price":200,"currency":"RUB","frequency":"monthly","category":"other","nextPaymentDate":"2026-04-10","startDate":"2026-03-24","isActive":true},
  {"name":"T-Bank Pro","price":299,"currency":"RUB","frequency":"monthly","category":"finance","nextPaymentDate":"2026-04-23","startDate":"2026-03-23","isActive":true},
  {"name":"iCloud","price":599,"currency":"RUB","frequency":"monthly","category":"cloud","nextPaymentDate":"2026-04-18","startDate":"2026-03-24","isActive":true},
  {"name":"Telegram","price":2390,"currency":"RUB","frequency":"yearly","category":"other","nextPaymentDate":"2027-02-09","startDate":"2026-02-09","isActive":true},
  {"name":"Claude Code","price":110,"currency":"USD","frequency":"monthly","category":"productivity","nextPaymentDate":"2026-04-16","startDate":"2026-03-16","isActive":true},
];

// 1. Login
console.log(`Logging in as ${email}...`);
const loginRes = await fetch(`${BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

if (!loginRes.ok) {
  const err = await loginRes.text();
  console.error('Login failed:', err);
  process.exit(1);
}

// Extract session cookie
const setCookie = loginRes.headers.get('set-cookie');
if (!setCookie) {
  console.error('No cookie returned from login');
  process.exit(1);
}
const cookie = setCookie.split(';')[0]; // subs-session=...
console.log('Logged in successfully');

// 2. Import subscriptions
let ok = 0, fail = 0;
for (const sub of SUBSCRIPTIONS) {
  const res = await fetch(`${BASE}/api/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(sub),
  });
  if (res.ok) {
    console.log(`  ✓ ${sub.name}`);
    ok++;
  } else {
    const err = await res.text();
    console.error(`  ✗ ${sub.name}: ${err}`);
    fail++;
  }
}

console.log(`\nДобавлено: ${ok}, ошибок: ${fail}`);
