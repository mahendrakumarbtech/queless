import React, { useState } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import config from '../../config/config';
import AdminListToolbar from '../../components/admin/AdminListToolbar';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import { downloadExportCsv } from '../../utils/exportCsv';

const API_URL = config.API_URL;

const QUEUE_STATUS_OPTIONS = [
  { value: '', labelKey: 'common:all' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'current', label: 'Current' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const Queues = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ name: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState({ name: '', status: '' });

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(appliedFilters.name && { search: appliedFilters.name.trim() }),
    ...(appliedFilters.status && { status: appliedFilters.status }),
  });

  const { data, isLoading } = useQuery(
    ['adminQueues', page, limit, appliedFilters],
    async () => {
      const res = await axios.get(`${API_URL}/admin/queues?${queryParams}`);
      return res.data;
    }
  );

  const queues = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleExport = () => {
    const exportParams = new URLSearchParams({
      export: 'csv',
      ...(appliedFilters.name && { search: appliedFilters.name.trim() }),
      ...(appliedFilters.status && { status: appliedFilters.status }),
    });
    downloadExportCsv(`${API_URL}/admin/queues?${exportParams}`, 'queues.csv');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'current': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <AdminListToolbar
        title={t('adminQueues:title')}
        pagination={pagination}
        onPageChange={setPage}
      />
      <AdminFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onApply={() => { setAppliedFilters(filters); setPage(1); }}
        onReset={() => { setFilters({ name: '', status: '' }); setAppliedFilters({ name: '', status: '' }); setPage(1); }}
        onExport={handleExport}
        namePlaceholder={t('adminQueues:searchPlaceholder')}
        showStatus
        statusOptions={QUEUE_STATUS_OPTIONS}
      />

      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common:loading')}</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>{t('adminQueues:table.queueNo')}</th>
                    <th>{t('adminQueues:table.customer')}</th>
                    <th>{t('adminQueues:table.provider')}</th>
                    <th>{t('adminQueues:table.date')}</th>
                    <th>{t('adminQueues:table.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {queues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        {t('adminQueues:empty.noQueues')}
                      </td>
                    </tr>
                  ) : (
                    queues.map((queue) => (
                      <tr key={queue._id}>
                        <td className="fw-bold">#{queue.queueNumber}</td>
                        <td>{queue.customerId?.name || t('adminQueues:na')}</td>
                        <td>{queue.providerId?.name || t('adminQueues:na')}</td>
                        <td>{moment(queue.date).format('MMM DD, YYYY')}</td>
                        <td>
                          <Badge bg={getStatusColor(queue.status)}>{queue.status}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Queues;
