import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;

const Roles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const { data: rolesData, isLoading } = useQuery('adminRoles', async () => {
    const res = await axios.get(`${API_URL}/admin/roles`);
    return res.data;
  });
  const roles = rolesData?.data || [];

  const deleteMutation = useMutation(
    (id) => axios.delete(`${API_URL}/admin/roles/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminRoles');
        setDeletingId(null);
      },
      onError: (err) => {
        alert(err.response?.data?.message || 'Failed to delete');
        setDeletingId(null);
      },
    }
  );

  const handleDelete = (role) => {
    if (role.isSystem) {
      alert('System role cannot be deleted');
      return;
    }
    if (!window.confirm(`Delete role "${role.displayName}"?`)) return;
    setDeletingId(role._id);
    deleteMutation.mutate(role._id);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Role & Permission</h4>
        <Button
          variant="primary"
          as={Link}
          to="/admin/roles/create"
        >
          <i className="bx bx-plus me-1"></i> Create Role
        </Button>
      </div>

      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Role Name</th>
                    <th>Display Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No roles found
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
                            {role.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {role.isSystem && (
                            <Badge bg="info" className="ms-1">System</Badge>
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
