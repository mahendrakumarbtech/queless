import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import config from '../../config/config';

const API_URL = config.API_URL;

const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
  <Card className="mb-4">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <span className="badge bg-label-primary rounded-pill mb-2">{title}</span>
          <h3 className="card-title mb-2 mt-2">{value}</h3>
          {subtitle && <small className="text-muted">{subtitle}</small>}
          {trend && (
            <div className="d-flex align-items-center mt-2">
              <i className="bi bi-arrow-up text-success me-1"></i>
              <small className="text-success fw-semibold">{trend}</small>
            </div>
          )}
        </div>
        <div className={`avatar flex-shrink-0 me-3 bg-label-${color}`}>
          <span className="avatar-initial rounded">
            <i className={`${icon} fs-4`}></i>
          </span>
        </div>
      </div>
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: dashboardStats, isLoading } = useQuery(
    'adminDashboard',
    async () => {
      const response = await axios.get(`${API_URL}/admin/dashboard`);
      return response.data.data;
    },
    { refetchInterval: 30000 }
  );

  const { data: users } = useQuery('adminUsers', async () => {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data.data;
  });

  const { data: providers } = useQuery('adminProviders', async () => {
    const response = await axios.get(`${API_URL}/admin/providers`);
    return response.data.data;
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const stats = dashboardStats || {
    totalUsers: 0,
    totalProviders: 0,
    activeQueues: 0,
    completedQueues: 0,
  };

  // Normalize users - ensure role is always a string
  const recentUsers = (users?.slice(0, 5) || []).map(user => ({
    ...user,
    role: typeof user.role === 'string'
      ? user.role
      : (user.role?.name || 'customer')
  }));
  const recentProviders = providers?.slice(0, 5) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Welcome back, {user?.name} 👋</h4>
          <p className="text-muted mb-0">
            Here's what's happening with your queue management system today.
          </p>
        </div>
      </div>

      <Row className="mb-4">
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon="bi-people"
            color="primary"
            trend="+12% this month"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Providers"
            value={stats.totalProviders || 0}
            icon="bi-building"
            color="info"
            trend="+5 new"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Queues"
            value={stats.activeQueues || 0}
            icon="bi-clock-history"
            color="warning"
            subtitle="Currently processing"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Completed"
            value={stats.completedQueues || 0}
            icon="bi-check-circle"
            color="success"
            trend="+24% today"
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Users</h5>
              <Badge bg="primary">{users?.length || 0} total</Badge>
            </Card.Header>
            <Card.Body>
              {recentUsers.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentUsers.map((userItem) => (
                    <div
                      key={userItem._id}
                      className="list-group-item d-flex align-items-center px-0"
                    >
                      <div className="avatar avatar-sm me-3">
                        <span className="avatar-initial rounded-circle bg-label-primary">
                          {userItem.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{userItem.name}</h6>
                        <small className="text-muted">{userItem.email}</small>
                      </div>
                      <Badge bg={userItem.role === 'admin' ? 'danger' : userItem.role === 'provider' ? 'primary' : 'secondary'}>
                        {userItem.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No users found</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Providers</h5>
              <Badge bg="primary">{providers?.length || 0} total</Badge>
            </Card.Header>
            <Card.Body>
              {recentProviders.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentProviders.map((provider) => (
                    <div
                      key={provider._id}
                      className="list-group-item d-flex align-items-center px-0"
                    >
                      <div className="avatar avatar-sm me-3">
                        <span className="avatar-initial rounded-circle bg-label-info">
                          <i className="bi bi-building"></i>
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{provider.name}</h6>
                        <small className="text-muted">{provider.providerType}</small>
                      </div>
                      <Badge bg={provider.isActive ? 'success' : 'secondary'}>
                        {provider.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No providers found</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
