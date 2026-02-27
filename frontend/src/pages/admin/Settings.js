import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config';
import ImageUploadWithCropper from '../../components/admin/ImageUploadWithCropper';

const API_URL = config.API_URL;

const TABS = [
  { id: 'general_setting', label: 'General Setting' },
  { id: 'default_setting', label: 'Default Setting' },
  { id: 'default_pages_setting', label: 'Default Pages Setting' },
  { id: 'email_setting', label: 'Email Setting' },
  { id: 'sms_gateway_setting', label: 'SMS Gateway Setting' },
  { id: 'whatsapp_gateway_setting', label: 'WhatsApp Gateway Setting' },
  { id: 'social_link_setting', label: 'Social Link Setting' },
  { id: 'queue_setting', label: 'Queue Setting' },
];

const emptySmsGateway = () => ({ msg91: { active: '', authkey: '' } });
const emptyWhatsappGateway = () => ({ gallabox: { active: '', api_key: '', api_secret: '', channel_id: '' } });

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [smsGateway, setSmsGateway] = useState(emptySmsGateway());
  const [whatsappGateway, setWhatsappGateway] = useState(emptyWhatsappGateway());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general_setting');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/admin/settings`);
        const d = data.data || {};
        setSettings(d);
        if (d.sms_gateway) {
          try {
            const parsed = typeof d.sms_gateway === 'string' ? JSON.parse(d.sms_gateway) : d.sms_gateway;
            setSmsGateway({ ...emptySmsGateway(), ...parsed });
          } catch (_) {}
        }
        if (d.whatsapp_gateway) {
          try {
            const parsed = typeof d.whatsapp_gateway === 'string' ? JSON.parse(d.whatsapp_gateway) : d.whatsapp_gateway;
            setWhatsappGateway({ ...emptyWhatsappGateway(), ...parsed });
          } catch (_) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async (payload) => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/settings`, payload);
      alert('Settings saved successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    save({
      website_name: settings.website_name,
      website_tagline: settings.website_tagline,
      contact_person: settings.contact_person,
      website_email: settings.website_email,
      website_telephone_no: settings.website_telephone_no,
      website_mobile_no: settings.website_mobile_no,
      website_whatsapp_no: settings.website_whatsapp_no,
      android_app_link: settings.android_app_link,
      ios_app_link: settings.ios_app_link,
      android_app_link_merchant: settings.android_app_link_merchant,
      ios_app_link_merchant: settings.ios_app_link_merchant,
      favicon_icon: settings.favicon_icon,
      backend_logo: settings.backend_logo,
      backend_white_logo: settings.backend_white_logo,
    });
  };

  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    save({
      default_currency: settings.default_currency,
      default_currency_position: settings.default_currency_position,
      default_timezone: settings.default_timezone,
      date_format: settings.date_format,
      time_format: settings.time_format,
      datetime_format: settings.datetime_format,
    });
  };

  const handleDefaultPagesSubmit = (e) => {
    e.preventDefault();
    save({
      about_us: settings.about_us,
      terms_and_condition: settings.terms_and_condition,
      privacy_policy: settings.privacy_policy,
      terms_and_condition_merchant: settings.terms_and_condition_merchant,
      privacy_policy_merchant: settings.privacy_policy_merchant,
    });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    save({
      mail_driver: settings.mail_driver,
      smtp_host: settings.smtp_host,
      smtp_port: settings.smtp_port,
      smtp_encryption: settings.smtp_encryption,
      smtp_username: settings.smtp_username,
      smtp_password: settings.smtp_password,
      smtp_from_email_address: settings.smtp_from_email_address,
      smtp_from_name: settings.smtp_from_name,
    });
  };

  const handleSmsGatewaySubmit = (e) => {
    e.preventDefault();
    save({ sms_gateway: smsGateway });
  };

  const handleWhatsappGatewaySubmit = (e) => {
    e.preventDefault();
    save({ whatsapp_gateway: whatsappGateway });
  };

  const handleSocialLinkSubmit = (e) => {
    e.preventDefault();
    save({
      youtube_url: settings.youtube_url,
      linkedin_url: settings.linkedin_url,
      instagram_url: settings.instagram_url,
      twitter_url: settings.twitter_url,
      facebook_url: settings.facebook_url,
    });
  };

  const handleQueueSubmit = (e) => {
    e.preventDefault();
    save({
      default_queue_time: settings.default_queue_time,
      max_queue_size: settings.max_queue_size,
      advance_booking_days: settings.advance_booking_days,
      allow_queue_cancellation: settings.allow_queue_cancellation,
      auto_assign_queue_numbers: settings.auto_assign_queue_numbers,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const btnSave = (saving) => (
    <button type="submit" className="btn btn-primary" disabled={saving}>
      <i className="bx bx-save me-2"></i>
      {saving ? 'Saving...' : 'Save Changes'}
    </button>
  );

  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">Settings</h1>

      <div className="row">
        <div className="col-md-3 col-xl-2 mb-2">
          <div className="card">
            <div className="card-header header-elements">
              <div className="card-action-title mb-0">Settings</div>
            </div>
            <div className="list-group list-group-flush" id="setting-menu-tab" role="tablist">
              {TABS.map((tab) => (
                <a
                  key={tab.id}
                  className={`list-group-item list-group-item-action ${activeTab === tab.id ? 'active' : ''}`}
                  href={`#${tab.id}`}
                  role="tab"
                  onClick={(e) => { e.preventDefault(); setActiveTab(tab.id); }}
                >
                  {tab.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-9 col-xl-10">
          <div className="tab-content p-0">
            {/* General Setting */}
            <div className={`tab-pane fade ${activeTab === 'general_setting' ? 'show active' : ''}`} id="general_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">General Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleGeneralSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="website_name">Website Name</label>
                      <input type="text" className="form-control" id="website_name" placeholder="Website Name"
                        value={settings.website_name ?? ''} onChange={(e) => update('website_name', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="website_tagline">Website Tagline</label>
                      <input type="text" className="form-control" id="website_tagline" placeholder="Website Tagline"
                        value={settings.website_tagline ?? ''} onChange={(e) => update('website_tagline', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="contact_person">Contact Person</label>
                      <input type="text" className="form-control" id="contact_person" placeholder="Contact Person"
                        value={settings.contact_person ?? ''} onChange={(e) => update('contact_person', e.target.value)} />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_email">Website Email</label>
                        <input type="text" className="form-control" id="website_email" placeholder="Website Email"
                          value={settings.website_email ?? ''} onChange={(e) => update('website_email', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_telephone_no">Website Telephone No</label>
                        <input type="text" className="form-control" id="website_telephone_no" placeholder="Website Telephone No"
                          value={settings.website_telephone_no ?? ''} onChange={(e) => update('website_telephone_no', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_mobile_no">Website Mobile No</label>
                        <input type="text" className="form-control" id="website_mobile_no" placeholder="Website Mobile No"
                          value={settings.website_mobile_no ?? ''} onChange={(e) => update('website_mobile_no', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_whatsapp_no">Website WhatsApp No</label>
                        <input type="text" className="form-control" id="website_whatsapp_no" placeholder="Website WhatsApp No"
                          value={settings.website_whatsapp_no ?? ''} onChange={(e) => update('website_whatsapp_no', e.target.value)} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="android_app_link">Android App Link</label>
                      <input type="text" className="form-control" id="android_app_link" placeholder="Android App Link"
                        value={settings.android_app_link ?? ''} onChange={(e) => update('android_app_link', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="ios_app_link">iOS App Link</label>
                      <input type="text" className="form-control" id="ios_app_link" placeholder="iOS App Link"
                        value={settings.ios_app_link ?? ''} onChange={(e) => update('ios_app_link', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="android_app_link_merchant">Android App Link (Merchant)</label>
                      <input type="text" className="form-control" id="android_app_link_merchant" placeholder="Android App Link Merchant"
                        value={settings.android_app_link_merchant ?? ''} onChange={(e) => update('android_app_link_merchant', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="ios_app_link_merchant">iOS App Link (Merchant)</label>
                      <input type="text" className="form-control" id="ios_app_link_merchant" placeholder="iOS App Link Merchant"
                        value={settings.ios_app_link_merchant ?? ''} onChange={(e) => update('ios_app_link_merchant', e.target.value)} />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-4">
                        <label className="form-label" htmlFor="favicon_icon">Favicon Icon</label>
                        <ImageUploadWithCropper
                          name="favicon_icon"
                          value={settings.favicon_icon ?? ''}
                          onChange={(url) => update('favicon_icon', url)}
                          aspectRatio="1/1"
                        />
                        <div className="text-muted small mt-1">Square image (e.g. 1:1). Accepted: JPEG, PNG, GIF, WebP</div>
                      </div>
                      <div className="mb-3 col-md-4">
                        <label className="form-label" htmlFor="backend_logo">Backend Logo</label>
                        <ImageUploadWithCropper
                          name="backend_logo"
                          value={settings.backend_logo ?? ''}
                          onChange={(url) => update('backend_logo', url)}
                        />
                        <div className="text-muted small mt-1">Accepted: JPEG, PNG, GIF, WebP</div>
                      </div>
                      <div className="mb-3 col-md-4">
                        <label className="form-label" htmlFor="backend_white_logo">Backend White Logo</label>
                        <ImageUploadWithCropper
                          name="backend_white_logo"
                          value={settings.backend_white_logo ?? ''}
                          onChange={(url) => update('backend_white_logo', url)}
                          className="bg-primary"
                        />
                        <div className="text-muted small mt-1">For dark sidebar. Accepted: JPEG, PNG, GIF, WebP</div>
                      </div>
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>

            {/* Default Setting */}
            <div className={`tab-pane fade ${activeTab === 'default_setting' ? 'show active' : ''}`} id="default_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Default Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleDefaultSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_currency">Default Currency</label>
                      <input type="text" className="form-control" id="default_currency" placeholder="e.g. USD, INR"
                        value={settings.default_currency ?? ''} onChange={(e) => update('default_currency', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_currency_position">Default Currency Position</label>
                      <select className="form-select" id="default_currency_position"
                        value={settings.default_currency_position ?? ''} onChange={(e) => update('default_currency_position', e.target.value)}>
                        <option value="">Select</option>
                        <option value="before">Before (e.g. $100)</option>
                        <option value="after">After (e.g. 100 USD)</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_timezone">Default Timezone</label>
                      <input type="text" className="form-control" id="default_timezone" placeholder="e.g. Asia/Kolkata"
                        value={settings.default_timezone ?? ''} onChange={(e) => update('default_timezone', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="date_format">Date Format</label>
                      <input type="text" className="form-control" id="date_format" placeholder="e.g. d/m/Y"
                        value={settings.date_format ?? ''} onChange={(e) => update('date_format', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="time_format">Time Format</label>
                      <input type="text" className="form-control" id="time_format" placeholder="e.g. H:i"
                        value={settings.time_format ?? ''} onChange={(e) => update('time_format', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="datetime_format">Datetime Format</label>
                      <input type="text" className="form-control" id="datetime_format" placeholder="e.g. d/m/Y H:i"
                        value={settings.datetime_format ?? ''} onChange={(e) => update('datetime_format', e.target.value)} />
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>

            {/* Default Pages Setting */}
            <div className={`tab-pane fade ${activeTab === 'default_pages_setting' ? 'show active' : ''}`} id="default_pages_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Default Pages Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleDefaultPagesSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="about_us">About Us</label>
                      <textarea className="form-control" id="about_us" rows="6" placeholder="About Us"
                        value={settings.about_us ?? ''} onChange={(e) => update('about_us', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="terms_and_condition">Terms and Condition</label>
                      <textarea className="form-control" id="terms_and_condition" rows="6" placeholder="Terms and Condition"
                        value={settings.terms_and_condition ?? ''} onChange={(e) => update('terms_and_condition', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="privacy_policy">Privacy Policy</label>
                      <textarea className="form-control" id="privacy_policy" rows="6" placeholder="Privacy Policy"
                        value={settings.privacy_policy ?? ''} onChange={(e) => update('privacy_policy', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="terms_and_condition_merchant">Terms and Condition (Merchant)</label>
                      <textarea className="form-control" id="terms_and_condition_merchant" rows="6" placeholder="Terms and Condition Merchant"
                        value={settings.terms_and_condition_merchant ?? ''} onChange={(e) => update('terms_and_condition_merchant', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="privacy_policy_merchant">Privacy Policy (Merchant)</label>
                      <textarea className="form-control" id="privacy_policy_merchant" rows="6" placeholder="Privacy Policy Merchant"
                        value={settings.privacy_policy_merchant ?? ''} onChange={(e) => update('privacy_policy_merchant', e.target.value)} />
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>

            {/* Email Setting */}
            <div className={`tab-pane fade ${activeTab === 'email_setting' ? 'show active' : ''}`} id="email_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Email Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleEmailSubmit}>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="mail_driver">Mail Driver</label>
                        <input type="text" className="form-control" id="mail_driver" placeholder="Mail Driver"
                          value={settings.mail_driver ?? ''} onChange={(e) => update('mail_driver', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_host">SMTP Host</label>
                        <input type="text" className="form-control" id="smtp_host" placeholder="SMTP Host"
                          value={settings.smtp_host ?? ''} onChange={(e) => update('smtp_host', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_port">SMTP Port</label>
                        <input type="text" className="form-control" id="smtp_port" placeholder="SMTP Port"
                          value={settings.smtp_port ?? ''} onChange={(e) => update('smtp_port', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_encryption">SMTP Encryption</label>
                        <input type="text" className="form-control" id="smtp_encryption" placeholder="e.g. tls, ssl"
                          value={settings.smtp_encryption ?? ''} onChange={(e) => update('smtp_encryption', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_username">SMTP Username</label>
                        <input type="text" className="form-control" id="smtp_username" placeholder="SMTP Username"
                          value={settings.smtp_username ?? ''} onChange={(e) => update('smtp_username', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_password">SMTP Password</label>
                        <input type="password" className="form-control" id="smtp_password" placeholder="SMTP Password"
                          value={settings.smtp_password ?? ''} onChange={(e) => update('smtp_password', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_from_email_address">From Email Address</label>
                        <input type="text" className="form-control" id="smtp_from_email_address" placeholder="From Email"
                          value={settings.smtp_from_email_address ?? ''} onChange={(e) => update('smtp_from_email_address', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_from_name">From Name</label>
                        <input type="text" className="form-control" id="smtp_from_name" placeholder="From Name"
                          value={settings.smtp_from_name ?? ''} onChange={(e) => update('smtp_from_name', e.target.value)} />
                      </div>
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>

            {/* SMS Gateway Setting */}
            <div className={`tab-pane fade ${activeTab === 'sms_gateway_setting' ? 'show active' : ''}`} id="sms_gateway_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">SMS Gateway Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSmsGatewaySubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header header-elements">
                            <h5 className="card-title mb-0">MSG91 Setting</h5>
                            <div className="card-action-element ms-auto">
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="sms_msg91_active"
                                  checked={smsGateway.msg91?.active === '1' || smsGateway.msg91?.active === true}
                                  onChange={(e) => setSmsGateway((prev) => ({
                                    ...prev,
                                    msg91: { ...prev.msg91, active: e.target.checked ? '1' : '' }
                                  }))} />
                                <label className="form-check-label" htmlFor="sms_msg91_active">Active</label>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="sms_msg91_authkey">MSG91 Auth Key</label>
                              <input type="text" className="form-control" id="sms_msg91_authkey"
                                value={smsGateway.msg91?.authkey ?? ''}
                                onChange={(e) => setSmsGateway((prev) => ({
                                  ...prev,
                                  msg91: { ...prev.msg91, authkey: e.target.value }
                                }))} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>

            {/* WhatsApp Gateway Setting */}
            <div className={`tab-pane fade ${activeTab === 'whatsapp_gateway_setting' ? 'show active' : ''}`} id="whatsapp_gateway_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">WhatsApp Gateway Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleWhatsappGatewaySubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header header-elements">
                            <h5 className="card-title mb-0">Gallabox Setting</h5>
                            <div className="card-action-element ms-auto">
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="whatsapp_gallabox_active"
                                  checked={whatsappGateway.gallabox?.active === '1' || whatsappGateway.gallabox?.active === true}
                                  onChange={(e) => setWhatsappGateway((prev) => ({
                                    ...prev,
                                    gallabox: { ...prev.gallabox, active: e.target.checked ? '1' : '' }
                                  }))} />
                                <label className="form-check-label" htmlFor="whatsapp_gallabox_active">Active</label>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="whatsapp_gallabox_api_key">API Key</label>
                              <input type="text" className="form-control" id="whatsapp_gallabox_api_key"
                                value={whatsappGateway.gallabox?.api_key ?? ''}
                                onChange={(e) => setWhatsappGateway((prev) => ({
                                  ...prev,
                                  gallabox: { ...prev.gallabox, api_key: e.target.value }
                                }))} />
                            </div>
                            <div className="mb-3">
                              <label className="form-label" htmlFor="whatsapp_gallabox_api_secret">API Secret</label>
                              <input type="text" className="form-control" id="whatsapp_gallabox_api_secret"
                                value={whatsappGateway.gallabox?.api_secret ?? ''}
                                onChange={(e) => setWhatsappGateway((prev) => ({
                                  ...prev,
                                  gallabox: { ...prev.gallabox, api_secret: e.target.value }
                                }))} />
                            </div>
                            <div className="mb-3">
                              <label className="form-label" htmlFor="whatsapp_gallabox_channel_id">Channel ID</label>
                              <input type="text" className="form-control" id="whatsapp_gallabox_channel_id"
                                value={whatsappGateway.gallabox?.channel_id ?? ''}
                                onChange={(e) => setWhatsappGateway((prev) => ({
                                  ...prev,
                                  gallabox: { ...prev.gallabox, channel_id: e.target.value }
                                }))} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>

            {/* Social Link Setting */}
            <div className={`tab-pane fade ${activeTab === 'social_link_setting' ? 'show active' : ''}`} id="social_link_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Social Link Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSocialLinkSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="youtube_url">YouTube URL</label>
                      <input type="text" className="form-control" id="youtube_url" placeholder="YouTube URL"
                        value={settings.youtube_url ?? ''} onChange={(e) => update('youtube_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="linkedin_url">LinkedIn URL</label>
                      <input type="text" className="form-control" id="linkedin_url" placeholder="LinkedIn URL"
                        value={settings.linkedin_url ?? ''} onChange={(e) => update('linkedin_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="instagram_url">Instagram URL</label>
                      <input type="text" className="form-control" id="instagram_url" placeholder="Instagram URL"
                        value={settings.instagram_url ?? ''} onChange={(e) => update('instagram_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="twitter_url">Twitter URL</label>
                      <input type="text" className="form-control" id="twitter_url" placeholder="Twitter URL"
                        value={settings.twitter_url ?? ''} onChange={(e) => update('twitter_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="facebook_url">Facebook URL</label>
                      <input type="text" className="form-control" id="facebook_url" placeholder="Facebook URL"
                        value={settings.facebook_url ?? ''} onChange={(e) => update('facebook_url', e.target.value)} />
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>

            {/* Queue Setting */}
            <div className={`tab-pane fade ${activeTab === 'queue_setting' ? 'show active' : ''}`} id="queue_setting" role="tabpanel">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Queue Setting</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleQueueSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_queue_time">Default Queue Time (minutes)</label>
                      <input type="number" className="form-control" id="default_queue_time" placeholder="e.g. 15"
                        value={settings.default_queue_time ?? ''} onChange={(e) => update('default_queue_time', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="max_queue_size">Max Queue Size</label>
                      <input type="number" className="form-control" id="max_queue_size" placeholder="e.g. 50"
                        value={settings.max_queue_size ?? ''} onChange={(e) => update('max_queue_size', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="advance_booking_days">Advance Booking Days</label>
                      <input type="number" className="form-control" id="advance_booking_days" placeholder="e.g. 7"
                        value={settings.advance_booking_days ?? ''} onChange={(e) => update('advance_booking_days', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="allow_queue_cancellation"
                          checked={settings.allow_queue_cancellation === '1' || settings.allow_queue_cancellation === true}
                          onChange={(e) => update('allow_queue_cancellation', e.target.checked ? '1' : '0')} />
                        <label className="form-check-label" htmlFor="allow_queue_cancellation">Allow Queue Cancellation</label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="auto_assign_queue_numbers"
                          checked={settings.auto_assign_queue_numbers === '1' || settings.auto_assign_queue_numbers === true}
                          onChange={(e) => update('auto_assign_queue_numbers', e.target.checked ? '1' : '0')} />
                        <label className="form-check-label" htmlFor="auto_assign_queue_numbers">Auto Assign Queue Numbers</label>
                      </div>
                    </div>
                    {btnSave(saving)}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
