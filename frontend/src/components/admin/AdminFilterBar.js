import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Alembic-style filter bar: Filter label, Name input, Status dropdown, Apply, Reset, Export.
 * Filters applied only on Apply; Reset clears inputs and calls onReset.
 * @param {object} filters - { name, status } controlled values
 * @param {function} onFilterChange - ({ name, status }) => void
 * @param {function} onApply - () => void
 * @param {function} onReset - () => void
 * @param {function} onExport - () => void
 * @param {string} namePlaceholder - Placeholder for name/search input
 * @param {boolean} showStatus - Show status dropdown (default true)
 * @param {array} statusOptions - [{ value: '', labelKey or label }, ...]. Default: All, Active, Inactive
 * @param {React.ReactNode} extra - Optional right-side content (e.g. Create Role) - not used on User sub-pages
 */
const AdminFilterBar = ({
  filters = {},
  onFilterChange,
  onApply,
  onReset,
  onExport,
  namePlaceholder = '',
  showStatus = true,
  statusOptions = null,
  extra = null,
}) => {
  const { t } = useTranslation();
  const name = filters.name ?? '';
  const status = filters.status ?? '';

  const defaultStatusOptions = [
    { value: '', labelKey: 'common:all' },
    { value: 'true', labelKey: 'common:active' },
    { value: 'false', labelKey: 'common:inactive' },
  ];
  const options = statusOptions ?? defaultStatusOptions;

  const handleApply = () => onApply?.();
  const handleReset = () => onReset?.();

  return (
    <div className="admin-filter-bar mb-4">
      <div className="d-flex flex-wrap align-items-end gap-3">
        <span className="fw-medium text-muted me-2">{t('common:filter')}</span>
        <Form.Group className="mb-0" style={{ minWidth: '180px' }}>
          <Form.Label className="small mb-1">{t('common:name')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={namePlaceholder}
            value={name}
            onChange={(e) => onFilterChange?.({ ...filters, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApply())}
            size="sm"
          />
        </Form.Group>
        {showStatus && (
          <Form.Group className="mb-0" style={{ minWidth: '140px' }}>
            <Form.Label className="small mb-1">{t('common:status')}</Form.Label>
            <Form.Select
              size="sm"
              value={status}
              onChange={(e) => onFilterChange?.({ ...filters, status: e.target.value })}
              aria-label="Status"
            >
              {options.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.labelKey ? t(opt.labelKey) : opt.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        <div className="d-flex align-items-center gap-2 mb-0">
          <Button variant="primary" size="sm" onClick={handleApply}>
            {t('common:apply')}
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={handleReset} title={t('common:reset')}>
            <i className="bx bx-reset" aria-hidden="true"></i>
          </Button>
          {onExport && (
            <Button variant="success" size="sm" onClick={onExport}>
              <i className="bx bx-download me-1"></i>
              {t('common:export')}
            </Button>
          )}
        </div>
        {extra && <div className="ms-auto">{extra}</div>}
      </div>
    </div>
  );
};

export default AdminFilterBar;
