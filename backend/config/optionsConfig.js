/**
 * Static options for admin dropdowns (settings etc.).
 * Used by GET /api/admin/options when type=currency|timezone.
 * Key => value pairs; API returns { id: key, text: value } for Select2 format.
 */

const CURRENCIES = {
  INR: 'INR (₹)',
  USD: 'USD ($)',
  EUR: 'EUR (€)',
  GBP: 'GBP (£)',
  JPY: 'JPY (¥)',
  AED: 'AED (د.إ)',
  SAR: 'SAR (﷼)',
  CAD: 'CAD ($)',
  AUD: 'AUD ($)',
  CHF: 'CHF (Fr)',
  CNY: 'CNY (¥)',
  SGD: 'SGD ($)',
  MYR: 'MYR (RM)',
  PKR: 'PKR (₨)',
  BDT: 'BDT (৳)',
  LKR: 'LKR (Rs)',
  NPR: 'NPR (₨)',
  THB: 'THB (฿)',
  IDR: 'IDR (Rp)',
  PHP: 'PHP (₱)',
  VND: 'VND (₫)',
};

// Common IANA timezones (subset); expand as needed
const TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Karachi',
  'Asia/Dhaka',
  'Asia/Colombo',
  'Asia/Kathmandu',
  'Asia/Bangkok',
  'Asia/Jakarta',
  'Asia/Manila',
  'Asia/Ho_Chi_Minh',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Amsterdam',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'UTC',
];

function formatTimezoneOffset(tz) {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
    const parts = formatter.formatToParts(date);
    const offset = parts.find(p => p.type === 'timeZoneName');
    return offset ? offset.value : '';
  } catch (_) {
    return '';
  }
}

function getTimezoneList() {
  const list = {};
  TIMEZONES.forEach(tz => {
    const offset = formatTimezoneOffset(tz);
    list[tz] = offset ? `${offset} ${tz}` : tz;
  });
  return list;
}

const TIMEZONE_MAP = getTimezoneList();

module.exports = {
  CURRENCIES,
  TIMEZONE_MAP,
  getOptions(type, q = '') {
    const search = (q || '').toLowerCase().trim();
    if (type === 'currency') {
      let items = Object.entries(CURRENCIES).map(([id, text]) => ({ id, text }));
      if (search) {
        items = items.filter(
          (o) =>
            o.id.toLowerCase().includes(search) ||
            o.text.toLowerCase().includes(search)
        );
      }
      return items;
    }
    if (type === 'timezone') {
      let items = Object.entries(TIMEZONE_MAP).map(([id, text]) => ({ id, text }));
      if (search) {
        items = items.filter(
          (o) =>
            o.id.toLowerCase().includes(search) ||
            o.text.toLowerCase().includes(search)
        );
      }
      return items;
    }
    return [];
  },
};
