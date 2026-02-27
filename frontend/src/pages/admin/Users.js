import React, { useState } from 'react';
import { Card, Table, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useQuery('adminUsers', async () => {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data.data;
  });

  // Normalize users - ensure role is always a string
  const normalizedUsers = users?.map(user => ({
    ...user,
    role: typeof user.role === 'string'
      ? user.role
      : (user.role?.name || 'customer')
  })) || [];

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
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Users Management</h4>
        <InputGroup style={{ width: '300px' }}>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Search users..."
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
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No users found
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
                            {user.isActive ? 'Active' : 'Inactive'}
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
