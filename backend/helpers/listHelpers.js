/**
 * Pagination and export helpers for admin list APIs (Alembic-style).
 */

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function paginatedResponse(data, total, page, limit) {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * Convert array of objects to CSV string. columns = [{ key, label }].
 */
function toCSV(rows, columns) {
  if (!rows.length) {
    return columns.map((c) => c.label).join(',');
  }
  const header = columns.map((c) => escapeCSV(c.label)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          let val = row[col.key];
          if (val != null && typeof val === 'object' && !(val instanceof Date)) {
            val = val.name || val.displayName || JSON.stringify(val);
          }
          if (val instanceof Date) val = val.toISOString();
          return escapeCSV(String(val ?? ''));
        })
        .join(',')
    )
    .join('\n');
  return header + '\n' + body;
}

function escapeCSV(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function sendCSV(res, csv, filename) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send('\uFEFF' + csv); // BOM for Excel
}

module.exports = {
  getPaginationParams,
  paginatedResponse,
  toCSV,
  sendCSV,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
