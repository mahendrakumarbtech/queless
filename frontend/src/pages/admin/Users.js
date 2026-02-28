import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import config from '../../config/config';

const API_URL = config.API_URL;

const Users = () => {
  const { t } = useTranslation();
  const { roleFilter } = useParams(); // staff | provider | customer from path /admin/users/:roleFilter
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useQuery('adminUsers', async () => {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data.data;
  });

  // Normalize users - ensure role is always a string
  let normalizedUsers = users?.map(user => ({
    ...user,
    role: typeof user.role === 'string'
      ? user.role
      : (user.role?.name || 'customer')
  })) || [];

  if (roleFilter && ['staff', 'provider', 'customer'].includes(roleFilter)) {
    normalizedUsers = normalizedUsers.filter((u) => u.role === roleFilter);
  }

  const filteredUsers = normalizedUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'provider':
        return 'primary';
      case 'staff':
        return 'warning';
      case 'provider_staff':
        return 'info';
      case 'customer':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const roleLabel =
    roleFilter === 'staff'
      ? t('menu:staff')
      : roleFilter === 'provider'
        ? t('menu:provider')
        : roleFilter === 'customer'
          ? t('menu:customer')
          : '';

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          {roleFilter
            ? t('adminUsers:titles.filtered', { role: roleLabel })
            : t('adminUsers:titles.management')}
        </h4>
        <InputGroup style={{ width: '300px' }}>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder={t('adminUsers:searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        {t('adminUsers:empty.noUsers')}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
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
                          <Badge bg={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
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
