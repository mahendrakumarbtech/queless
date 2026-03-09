import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import config from '../../config/config';
import AdminListToolbar from '../../components/admin/AdminListToolbar';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import { downloadExportCsv } from '../../utils/exportCsv';

const API_URL = config.API_URL;

const Providers = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ name: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState({ name: '', status: '' });

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(appliedFilters.name && { search: appliedFilters.name.trim() }),
    ...(appliedFilters.status !== '' && { isActive: appliedFilters.status }),
  });

  const { data, isLoading } = useQuery(
    ['adminProviders', page, limit, appliedFilters],
    async () => {
      const res = await axios.get(`${API_URL}/admin/providers?${queryParams}`);
      return res.data;
    }
  );

  const providers = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleExport = () => {
    const exportParams = new URLSearchParams({
      export: 'csv',
      ...(appliedFilters.name && { search: appliedFilters.name.trim() }),
      ...(appliedFilters.status !== '' && { isActive: appliedFilters.status }),
    });
    downloadExportCsv(`${API_URL}/admin/providers?${exportParams}`, 'providers.csv');
  };

  return (
    <div>
      <AdminListToolbar
        title={t('adminProviders:title')}
        pagination={pagination}
        onPageChange={setPage}
      />
      <AdminFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onApply={() => { setAppliedFilters(filters); setPage(1); }}
        onReset={() => { setFilters({ name: '', status: '' }); setAppliedFilters({ name: '', status: '' }); setPage(1); }}
        onExport={handleExport}
        namePlaceholder={t('adminProviders:searchPlaceholder')}
        showStatus
      />

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('common:loading')}</span>
          </div>
        </div>
      ) : (
        <Row>
          {providers.length === 0 ? (
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <p className="text-muted text-center py-4 mb-0">{t('adminProviders:empty.noProviders')}</p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            providers.map((provider) => (
              <Col xs={12} sm={6} md={4} key={provider._id} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-md me-3">
                          <span className="avatar-initial rounded-circle bg-label-primary">
                            <i className="bi bi-building"></i>
                          </span>
                        </div>
                        <div>
                          <h5 className="mb-0">{provider.name}</h5>
                          <small className="text-muted">{provider.providerType}</small>
                        </div>
                      </div>
                      <div>
                        <Button variant="link" size="sm" className="p-0 me-1">
                          <i className="bi bi-pencil text-primary"></i>
                        </Button>
                        <Button variant="link" size="sm" className="p-0">
                          <i className="bi bi-trash text-danger"></i>
                        </Button>
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <Badge bg={provider.isActive ? 'success' : 'secondary'}>
                        {provider.isActive ? t('common:active') : t('common:inactive')}
                      </Badge>
                      {provider.address?.city && (
                        <Badge bg="info" className="text-white">
                          {provider.address.city}
                        </Badge>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default Providers;
