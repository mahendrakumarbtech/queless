/**
 * Fetch a CSV export URL with auth and trigger download (Alembic-style export).
 */
export function downloadExportCsv(url, filename = 'export.csv') {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, { headers })
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.blob();
    })
    .then((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    });
}
