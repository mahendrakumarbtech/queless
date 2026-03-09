import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import config from '../../config/config';
import AdminListToolbar from '../../components/admin/AdminListToolbar';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import { downloadExportCsv } from '../../utils/exportCsv';

const API_URL = config.API_URL;

const Roles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
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
    ['adminRoles', page, limit, appliedFilters],
    async () => {
      const res = await axios.get(`${API_URL}/admin/roles?${queryParams}`);
      return res.data;
    }
  );

  const roles = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const deleteMutation = useMutation(
    (id) => axios.delete(`${API_URL}/admin/roles/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminRoles');
        setDeletingId(null);
      },
      onError: (err) => {
        alert(err.response?.data?.message || t('roles:deleteFailed'));
        setDeletingId(null);
      },
    }
  );

  const handleDelete = (role) => {
    if (role.isSystem) {
      alert(t('roles:systemRoleNoDelete'));
      return;
    }
    if (!window.confirm(t('roles:deleteConfirm', { name: role.displayName }))) return;
    setDeletingId(role._id);
    deleteMutation.mutate(role._id);
  };

  const handleExport = () => {
    const exportParams = new URLSearchParams({
      export: 'csv',
      ...(appliedFilters.name && { search: appliedFilters.name.trim() }),
      ...(appliedFilters.status !== '' && { isActive: appliedFilters.status }),
    });
    downloadExportCsv(`${API_URL}/admin/roles?${exportParams}`, 'roles.csv');
  };

  const createButton = (
    <Button variant="primary" as={Link} to="/admin/roles/create">
      <i className="bx bx-plus me-1"></i> {t('roles:createRole')}
    </Button>
  );

  return (
    <div>
      <AdminListToolbar
        title={t('roles:title')}
        pagination={pagination}
        onPageChange={setPage}
      />
      <AdminFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onApply={() => { setAppliedFilters(filters); setPage(1); }}
        onReset={() => { setFilters({ name: '', status: '' }); setAppliedFilters({ name: '', status: '' }); setPage(1); }}
        onExport={handleExport}
        namePlaceholder={t('roles:searchPlaceholder')}
        showStatus
        extra={createButton}
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
                    <th>{t('roles:roleName')}</th>
                    <th>{t('roles:displayName')}</th>
                    <th>{t('roles:description')}</th>
                    <th>{t('common:status')}</th>
                    <th className="text-end">{t('common:actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        {t('roles:noRoles')}
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role._id}>
                        <td className="fw-medium">{role.name}</td>
                        <td>{role.displayName}</td>
                        <td className="text-muted small">{role.description || '–'}</td>
                        <td>
                          <Badge bg={role.isActive ? 'success' : 'secondary'}>
                            {role.isActive ? t('common:active') : t('common:inactive')}
                          </Badge>
                          {role.isSystem && (
                            <Badge bg="info" className="ms-1">{t('common:system')}</Badge>
                          )}
                        </td>
                        <td className="text-end">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 me-2"
                            onClick={() => navigate(`/admin/roles/${role._id}/edit`)}
                          >
                            <i className="bx bx-edit text-primary"></i>
                          </Button>
                          {!role.isSystem && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0"
                              disabled={deletingId === role._id}
                              onClick={() => handleDelete(role)}
                            >
                              <i className="bx bx-trash text-danger"></i>
                            </Button>
                          )}
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

export default Roles;
