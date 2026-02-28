import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { useQuery } from 'react-query';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import config from '../../config/config';

const API_URL = config.API_URL;

const Queues = () => {
  const { t } = useTranslation();
  const { data: queues, isLoading } = useQuery('adminQueues', async () => {
    const response = await axios.get(`${API_URL}/admin/queues`);
    return response.data.data || [];
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'warning';
      case 'current':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">{t('adminQueues:title')}</h4>

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
                  {!queues || queues.length === 0 ? (
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
                          <Badge bg={getStatusColor(queue.status)}>
                            {queue.status}
                          </Badge>
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
