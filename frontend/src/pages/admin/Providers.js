import React, { useState } from 'react';
import { Card, Row, Col, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;

const Providers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: providers, isLoading } = useQuery('adminProviders', async () => {
    const response = await axios.get(`${API_URL}/admin/providers`);
    return response.data.data;
  });

  const filteredProviders = providers?.filter(
    (provider) =>
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.providerType?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Providers Management</h4>
        <InputGroup style={{ width: '300px' }}>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Row>
          {filteredProviders.length === 0 ? (
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <p className="text-muted text-center py-4 mb-0">No providers found</p>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            filteredProviders.map((provider) => (
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
                        {provider.isActive ? 'Active' : 'Inactive'}
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
