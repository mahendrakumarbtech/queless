import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;

const RoleForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const [modRes, roleRes] = await Promise.all([
          axios.get(`${API_URL}/admin/roles/permission-modules`),
          isEdit ? axios.get(`${API_URL}/admin/roles/${id}`) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setModules(modRes.data.data || []);
        if (roleRes?.data?.data) {
          const r = roleRes.data.data;
          setName(r.name || '');
          setDisplayName(r.displayName || '');
          setDescription(r.description || '');
          setIsActive(r.isActive !== false);
          setPermissions(Array.isArray(r.permissions) ? r.permissions : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || t('roles:loadFailed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [id, isEdit, t]);

  const togglePermission = (key) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const toggleModule = (module) => {
    const keys = module.permissions.map((p) => p.key);
    const allSelected = keys.every((k) => permissions.includes(k));
    if (allSelected) {
      setPermissions((prev) => prev.filter((p) => !keys.includes(p)));
    } else {
      setPermissions((prev) => [...new Set([...prev, ...keys])]);
    }
  };

  const selectAllPermissions = () => {
    const allKeys = modules.flatMap((m) => m.permissions.map((p) => p.key));
    if (allKeys.every((k) => permissions.includes(k))) {
      setPermissions([]);
    } else {
      setPermissions([...new Set(allKeys)]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: name.trim().toLowerCase(),
        displayName: displayName.trim() || name.trim(),
        description: description.trim(),
        isActive,
        permissions,
      };
      if (isEdit) {
        await axios.put(`${API_URL}/admin/roles/${id}`, payload);
        alert(t('roles:updated'));
        navigate('/admin/roles');
      } else {
        await axios.post(`${API_URL}/admin/roles`, payload);
        alert(t('roles:created'));
        navigate('/admin/roles');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('roles:saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common:loading')}</span>
        </div>
      </div>
    );
  }

  const allKeys = modules.flatMap((m) => m.permissions.map((p) => p.key));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => permissions.includes(k));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">{isEdit ? t('roles:editRole') : t('roles:createRole')}</h4>
        <Button variant="outline-secondary" as={Link} to="/admin/roles">
          <i className="bx bx-left-arrow-alt me-1"></i> {t('common:back')}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {error}
          </div>
        )}

        <Card className="mb-4">
          <Card.Body>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>{t('roles:roleName')} *</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('roles:namePlaceholder')}
                  required
                  disabled={isEdit}
                />
                {isEdit && <Form.Text className="text-muted">{t('roles:nameCannotChange')}</Form.Text>}
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>{t('roles:displayName')}</Form.Label>
                <Form.Control
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('roles:displayNamePlaceholder')}
                />
              </div>
              <div className="col-12 mb-3">
                <Form.Label>{t('roles:description')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('roles:description')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Label>{t('common:status')}</Form.Label>
                <div>
                  <Form.Check
                    type="switch"
                    id="role-active"
                    label={t('common:active')}
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">{t('roles:permissions')}</span>
            <Button type="button" variant="primary" size="sm" onClick={selectAllPermissions}>
              {allSelected ? t('roles:deselectAll') : t('roles:selectAll')}
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="row">
              {modules.map((mod) => {
                const keys = mod.permissions.map((p) => p.key);
                const moduleAllSelected = keys.every((k) => permissions.includes(k));
                return (
                  <div key={mod.slug} className="col-md-6 col-xl-4 mb-4">
                    <Card className="border shadow-sm">
                      <Card.Header className="py-2 d-flex justify-content-between align-items-center">
                        <span className="fw-medium">{mod.name}</span>
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => toggleModule(mod)}
                        >
                          {moduleAllSelected ? t('roles:deselectAll') : t('roles:selectAll')}
                        </Button>
                      </Card.Header>
                      <Card.Body className="py-2">
                        {mod.permissions.map((perm) => (
                          <div key={perm.key} className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="mb-0 fw-normal">{perm.label}</Form.Label>
                            <Form.Check
                              type="switch"
                              checked={permissions.includes(perm.key)}
                              onChange={() => togglePermission(perm.key)}
                            />
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? t('common:loading') : isEdit ? t('roles:updateRole') : t('roles:createRole')}
          </Button>
          <Button type="button" variant="outline-secondary" as={Link} to="/admin/roles">
            {t('common:cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
