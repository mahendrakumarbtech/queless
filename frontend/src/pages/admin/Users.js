import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import config from '../../config/config';
import AdminListToolbar from '../../components/admin/AdminListToolbar';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import { downloadExportCsv } from '../../utils/exportCsv';

const API_URL = config.API_URL;

const Users = () => {
  const { t } = useTranslation();
  const { roleFilter } = useParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ name: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState({ name: '', status: '' });

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(appliedFilters.name && { search: appliedFilters.name.trim() }),
    ...(appliedFilters.status !== '' && { isActive: appliedFilters.status }),
    ...(roleFilter && ['staff', 'provider', 'customer'].includes(roleFilter) && { role: roleFilter }),
  });

  const { data, isLoading } = useQuery(
    ['adminUsers', page, limit, appliedFilters, roleFilter],
    async () => {
      const res = await axios.get(`${API_URL}/admin/users?${queryParams}`);
      return res.data;
    }
  );

  const users = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleExport = () => {
    const exportParams = new URLSearchParams({
      export: 'csv',
      ...(appliedFilters.name && { search: appliedFilters.name.trim() }),
      ...(appliedFilters.status !== '' && { isActive: appliedFilters.status }),
      ...(roleFilter && ['staff', 'provider', 'customer'].includes(roleFilter) && { role: roleFilter }),
    });
    downloadExportCsv(`${API_URL}/admin/users?${exportParams}`, 'users.csv');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'provider': return 'primary';
      case 'staff': return 'warning';
      case 'provider_staff': return 'info';
      case 'customer': return 'secondary';
      default: return 'secondary';
    }
  };

  const roleLabel =
    roleFilter === 'staff' ? t('menu:staff')
      : roleFilter === 'provider' ? t('menu:provider')
      : roleFilter === 'customer' ? t('menu:customer') : '';

  const title = roleFilter
    ? t('adminUsers:titles.filtered', { role: roleLabel })
    : t('adminUsers:titles.management');

  return (
    <div>
      <AdminListToolbar
        title={title}
        pagination={pagination}
        onPageChange={setPage}
      />
      <AdminFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onApply={() => { setAppliedFilters(filters); setPage(1); }}
        onReset={() => { setFilters({ name: '', status: '' }); setAppliedFilters({ name: '', status: '' }); setPage(1); }}
        onExport={handleExport}
        namePlaceholder={t('adminUsers:searchPlaceholder')}
        showStatus
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
                    <th>{t('adminUsers:table.user')}</th>
                    <th>{t('adminUsers:table.email')}</th>
                    <th>{t('adminUsers:table.role')}</th>
                    <th>{t('adminUsers:table.status')}</th>
                    <th className="text-end">{t('adminUsers:table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        {t('adminUsers:empty.noUsers')}
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm me-3">
                              <span className="avatar-initial rounded-circle bg-label-primary">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h6 className="mb-0">{user.name}</h6>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={getRoleColor(user.role)}>{user.role}</Badge>
                        </td>
                        <td>
                          <Badge bg={user.isActive ? 'success' : 'secondary'}>
                            {user.isActive ? t('common:active') : t('common:inactive')}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button variant="link" size="sm" className="p-0 me-2">
                            <i className="bi bi-pencil text-primary"></i>
                          </Button>
                          <Button variant="link" size="sm" className="p-0 me-2">
                            <i className={`bi ${user.isActive ? 'bi-x-circle' : 'bi-check-circle'} text-warning`}></i>
                          </Button>
                          <Button variant="link" size="sm" className="p-0">
                            <i className="bi bi-trash text-danger"></i>
                          </Button>
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

export default Users;
