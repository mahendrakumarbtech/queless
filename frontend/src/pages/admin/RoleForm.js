import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Form, Button, Accordion } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;

// Permission sections in main menu order (accordion headers). Sub-menus shown inside accordion body.
const MENU_SECTIONS = [
  { slug: 'admin', menuKey: 'dashboard' },
  { slug: 'roles', menuKey: 'rolePermission' },
  { slug: 'users', menuKey: 'users', subMenuKeys: ['staff', 'provider', 'customer'] },
  { slug: 'providers', menuKey: 'providers' },
  { slug: 'queues', menuKey: 'queues' },
  { slug: 'settings', menuKey: 'settings' },
];

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

  const moduleBySlug = modules.reduce((acc, m) => { acc[m.slug] = m; return acc; }, {});
  const orderedSections = MENU_SECTIONS.filter((s) => moduleBySlug[s.slug]).map((s) => ({
    ...s,
    name: t(`menu:${s.menuKey}`),
    module: moduleBySlug[s.slug],
  }));

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
            <Accordion defaultActiveKey={orderedSections[0]?.slug}>
              {orderedSections.map((section) => {
                const mod = section.module;
                const keys = mod.permissions.map((p) => p.key);
                const moduleAllSelected = keys.length > 0 && keys.every((k) => permissions.includes(k));
                return (
                  <Accordion.Item key={section.slug} eventKey={section.slug}>
                    <Accordion.Header>{section.name}</Accordion.Header>
                    <Accordion.Body>
                      <div className="d-flex justify-content-end mb-3">
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => toggleModule(mod)}
                        >
                          {moduleAllSelected ? t('roles:deselectAll') : t('roles:selectAll')}
                        </Button>
                      </div>
                      {section.subMenuKeys && section.subMenuKeys.length > 0 && (
                        <div className="mb-3 pb-2 border-bottom">
                          <span className="text-muted small me-2">{t('roles:subMenus')}:</span>
                          {section.subMenuKeys.map((key) => (
                            <span key={key} className="badge bg-label-secondary me-1">
                              {t(`menu:${key}`)}
                            </span>
                          ))}
                        </div>
                      )}
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
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
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
