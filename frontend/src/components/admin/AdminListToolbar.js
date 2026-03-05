import React from 'react';
import { Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Reusable toolbar for admin list pages (Alembic-style): search, export, pagination.
 * @param {string} title - Page title
 * @param {string} search - Search value
 * @param {function} onSearchChange - (e) => setSearch(e.target.value)
 * @param {string} searchPlaceholder - Placeholder for search input
 * @param {function} onExport - () => trigger export (open URL or fetch with export=csv)
 * @param {object} pagination - { page, limit, total, totalPages }
 * @param {function} onPageChange - (page) => setPage(page)
 * @param {React.ReactNode} extra - Optional extra buttons (e.g. Create Role)
 */
const AdminListToolbar = ({
  title,
  search,
  onSearchChange,
  searchPlaceholder,
  onExport,
  pagination,
  onPageChange,
  extra = null,
}) => {
  const { t } = useTranslation();
  const { page, totalPages } = pagination || {};

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <h4 className="fw-bold mb-0">{title}</h4>
      <div className="d-flex flex-wrap align-items-center gap-2">
        {searchPlaceholder != null && (
          <InputGroup style={{ width: '260px' }}>
            <InputGroup.Text>
              <i className="bx bx-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder={searchPlaceholder}
              value={search}
              onChange={onSearchChange}
              aria-label="Search"
            />
          </InputGroup>
        )}
        {onExport && (
          <Button variant="outline-success" size="sm" onClick={onExport}>
            <i className="bx bx-download me-1"></i>
            {t('common:export')}
          </Button>
        )}
        {extra}
      </div>

      {pagination && totalPages > 1 && (
        <Pagination className="mb-0 flex-wrap">
          <Pagination.First
            disabled={page <= 1}
            onClick={(e) => { e.preventDefault(); onPageChange(1); }}
          />
          <Pagination.Prev
            disabled={page <= 1}
            onClick={(e) => { e.preventDefault(); onPageChange(Math.max(1, page - 1)); }}
          />
          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            if (totalPages > 7 && (p < page - 2 || p > page + 2) && p !== 1 && p !== totalPages) {
              if (p === page - 3 || p === page + 3) return <Pagination.Ellipsis key={p} />;
              return null;
            }
            return (
              <Pagination.Item
                key={p}
                active={p === page}
                onClick={(e) => { e.preventDefault(); onPageChange(p); }}
                role="button"
              >
                {p}
              </Pagination.Item>
            );
          })}
          <Pagination.Next
            disabled={page >= totalPages}
            onClick={(e) => { e.preventDefault(); onPageChange(Math.min(totalPages, page + 1)); }}
          />
          <Pagination.Last
            disabled={page >= totalPages}
            onClick={(e) => { e.preventDefault(); onPageChange(totalPages); }}
          />
        </Pagination>
      )}
    </div>
  );
};

export default AdminListToolbar;
