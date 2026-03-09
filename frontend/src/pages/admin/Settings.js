import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import notify from '../../utils/notify';
import config from '../../config/config';
import { usePublicSettings } from '../../context/PublicSettingsContext';
import ImageUploadWithCropper from '../../components/admin/ImageUploadWithCropper';
import AdminOptionsSelect from '../../components/admin/AdminOptionsSelect';
import ConfigSelect from '../../components/admin/ConfigSelect';

const API_URL = config.API_URL;

const TABS = [
  { id: 'general_setting', labelKey: 'adminSettings:tabs.general' },
  { id: 'default_setting', labelKey: 'adminSettings:tabs.default' },
  { id: 'default_pages_setting', labelKey: 'adminSettings:tabs.defaultPages' },
  { id: 'email_setting', labelKey: 'adminSettings:tabs.email' },
  { id: 'sms_gateway_setting', labelKey: 'adminSettings:tabs.smsGateway' },
  { id: 'whatsapp_gateway_setting', labelKey: 'adminSettings:tabs.whatsappGateway' },
  { id: 'social_link_setting', labelKey: 'adminSettings:tabs.socialLinks' },
  { id: 'queue_setting', labelKey: 'adminSettings:tabs.queue' },
];

const emptySmsGateway = () => ({ msg91: { active: '', authkey: '' } });
const emptyWhatsappGateway = () => ({ gallabox: { active: '', api_key: '', api_secret: '', channel_id: '' } });

const Settings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({});
  const [smsGateway, setSmsGateway] = useState(emptySmsGateway());
  const [whatsappGateway, setWhatsappGateway] = useState(emptyWhatsappGateway());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general_setting');
  const { refetchPublicSettings } = usePublicSettings();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/admin/settings`);
        const d = data.data || {};
        // Normalize logo keys: show website_logo/website_white_logo, fallback to old keys
        const normalized = { ...d };
        if (d.backend_logo != null && normalized.website_logo == null) normalized.website_logo = d.backend_logo;
        if (d.backend_white_logo != null && normalized.website_white_logo == null) normalized.website_white_logo = d.backend_white_logo;
        setSettings(normalized);
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
      await refetchPublicSettings();
      await notify.success({
        title: t('adminSettings:messages.successTitle'),
        text: t('adminSettings:messages.saved'),
        // useSwal: true,
      });
    } catch (err) {
      await notify.error({
        title: t('adminSettings:messages.errorTitle'),
        text: err.response?.data?.message || t('adminSettings:messages.saveFailed'),
        useSwal: true,
      });
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
      website_logo: settings.website_logo,
      website_white_logo: settings.website_white_logo,
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
          <span className="visually-hidden">{t('common:loading')}</span>
        </div>
      </div>
    );
  }

  const btnSave = (saving) => (
    <button type="submit" className="btn btn-primary" disabled={saving}>
      <i className="bx bx-save me-2"></i>
      {saving ? t('adminSettings:buttons.saving') : t('adminSettings:buttons.saveChanges')}
    </button>
  );

  return (
    <div className="container-fluid p-0">
      <h1 className="h3 mb-3">{t('adminSettings:title')}</h1>

      <div className="row">
        <div className="col-md-3 col-xl-2 mb-2">
          <div className="card">
            <div className="card-header header-elements">
              <div className="card-action-title mb-0">{t('adminSettings:title')}</div>
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
                  {t(tab.labelKey)}
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
                  <h5 className="card-title mb-0">{t('adminSettings:general.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleGeneralSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="website_name">{t('adminSettings:general.websiteName.label')}</label>
                      <input type="text" className="form-control" id="website_name" placeholder={t('adminSettings:general.websiteName.placeholder')}
                        value={settings.website_name ?? ''} onChange={(e) => update('website_name', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="website_tagline">{t('adminSettings:general.websiteTagline.label')}</label>
                      <input type="text" className="form-control" id="website_tagline" placeholder={t('adminSettings:general.websiteTagline.placeholder')}
                        value={settings.website_tagline ?? ''} onChange={(e) => update('website_tagline', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="contact_person">{t('adminSettings:general.contactPerson.label')}</label>
                      <input type="text" className="form-control" id="contact_person" placeholder={t('adminSettings:general.contactPerson.placeholder')}
                        value={settings.contact_person ?? ''} onChange={(e) => update('contact_person', e.target.value)} />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_email">{t('adminSettings:general.websiteEmail.label')}</label>
                        <input type="text" className="form-control" id="website_email" placeholder={t('adminSettings:general.websiteEmail.placeholder')}
                          value={settings.website_email ?? ''} onChange={(e) => update('website_email', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_telephone_no">{t('adminSettings:general.websiteTelephoneNo.label')}</label>
                        <input type="text" className="form-control" id="website_telephone_no" placeholder={t('adminSettings:general.websiteTelephoneNo.placeholder')}
                          value={settings.website_telephone_no ?? ''} onChange={(e) => update('website_telephone_no', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_mobile_no">{t('adminSettings:general.websiteMobileNo.label')}</label>
                        <input type="text" className="form-control" id="website_mobile_no" placeholder={t('adminSettings:general.websiteMobileNo.placeholder')}
                          value={settings.website_mobile_no ?? ''} onChange={(e) => update('website_mobile_no', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="website_whatsapp_no">{t('adminSettings:general.websiteWhatsappNo.label')}</label>
                        <input type="text" className="form-control" id="website_whatsapp_no" placeholder={t('adminSettings:general.websiteWhatsappNo.placeholder')}
                          value={settings.website_whatsapp_no ?? ''} onChange={(e) => update('website_whatsapp_no', e.target.value)} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="android_app_link">{t('adminSettings:general.androidAppLink.label')}</label>
                      <input type="text" className="form-control" id="android_app_link" placeholder={t('adminSettings:general.androidAppLink.placeholder')}
                        value={settings.android_app_link ?? ''} onChange={(e) => update('android_app_link', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="ios_app_link">{t('adminSettings:general.iosAppLink.label')}</label>
                      <input type="text" className="form-control" id="ios_app_link" placeholder={t('adminSettings:general.iosAppLink.placeholder')}
                        value={settings.ios_app_link ?? ''} onChange={(e) => update('ios_app_link', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="android_app_link_merchant">{t('adminSettings:general.androidAppLinkMerchant.label')}</label>
                      <input type="text" className="form-control" id="android_app_link_merchant" placeholder={t('adminSettings:general.androidAppLinkMerchant.placeholder')}
                        value={settings.android_app_link_merchant ?? ''} onChange={(e) => update('android_app_link_merchant', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="ios_app_link_merchant">{t('adminSettings:general.iosAppLinkMerchant.label')}</label>
                      <input type="text" className="form-control" id="ios_app_link_merchant" placeholder={t('adminSettings:general.iosAppLinkMerchant.placeholder')}
                        value={settings.ios_app_link_merchant ?? ''} onChange={(e) => update('ios_app_link_merchant', e.target.value)} />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-4">
                        <label className="form-label" htmlFor="favicon_icon">{t('adminSettings:general.faviconIcon.label')}</label>
                        <ImageUploadWithCropper
                          name="favicon_icon"
                          value={settings.favicon_icon ?? ''}
                          onChange={(url) => update('favicon_icon', url)}
                          aspectRatio="1/1"
                        />
                        <div className="text-muted small mt-1">{t('adminSettings:general.hints.favicon')}</div>
                      </div>
                      <div className="mb-3 col-md-4">
                        <label className="form-label" htmlFor="website_logo">{t('adminSettings:general.websiteLogo.label')}</label>
                        <ImageUploadWithCropper
                          name="website_logo"
                          value={settings.website_logo ?? ''}
                          onChange={(url) => update('website_logo', url)}
                        />
                        <div className="text-muted small mt-1">{t('adminSettings:general.hints.logoLight')}</div>
                      </div>
                      <div className="mb-3 col-md-4">
                        <label className="form-label" htmlFor="website_white_logo">{t('adminSettings:general.websiteWhiteLogo.label')}</label>
                        <ImageUploadWithCropper
                          name="website_white_logo"
                          value={settings.website_white_logo ?? ''}
                          onChange={(url) => update('website_white_logo', url)}
                          className="bg-primary"
                        />
                        <div className="text-muted small mt-1">{t('adminSettings:general.hints.logoDark')}</div>
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
                  <h5 className="card-title mb-0">{t('adminSettings:default.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleDefaultSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_currency">{t('adminSettings:default.defaultCurrency.label')}</label>
                      <AdminOptionsSelect
                        type="currency"
                        value={settings.default_currency ?? ''}
                        onChange={(v) => update('default_currency', v)}
                        placeholder={t('adminSettings:default.defaultCurrency.placeholder')}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_currency_position">{t('adminSettings:default.defaultCurrencyPosition.label')}</label>
                      <ConfigSelect
                        optionsKey="currency_position"
                        id="default_currency_position"
                        value={settings.default_currency_position ?? ''}
                        onChange={(v) => update('default_currency_position', v)}
                        placeholder={t('adminSettings:default.defaultCurrencyPosition.placeholder')}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_timezone">{t('adminSettings:default.defaultTimezone.label')}</label>
                      <AdminOptionsSelect
                        type="timezone"
                        value={settings.default_timezone ?? ''}
                        onChange={(v) => update('default_timezone', v)}
                        placeholder={t('adminSettings:default.defaultTimezone.placeholder')}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="date_format">{t('adminSettings:default.dateFormat.label')}</label>
                      <ConfigSelect
                        optionsKey="date_format"
                        id="date_format"
                        value={settings.date_format ?? ''}
                        onChange={(v) => update('date_format', v)}
                        placeholder={t('adminSettings:default.dateFormat.placeholder')}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="time_format">{t('adminSettings:default.timeFormat.label')}</label>
                      <ConfigSelect
                        optionsKey="time_format"
                        id="time_format"
                        value={settings.time_format ?? ''}
                        onChange={(v) => update('time_format', v)}
                        placeholder={t('adminSettings:default.timeFormat.placeholder')}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="datetime_format">{t('adminSettings:default.datetimeFormat.label')}</label>
                      <ConfigSelect
                        optionsKey="datetime_format"
                        id="datetime_format"
                        value={settings.datetime_format ?? ''}
                        onChange={(v) => update('datetime_format', v)}
                        placeholder={t('adminSettings:default.datetimeFormat.placeholder')}
                      />
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
                  <h5 className="card-title mb-0">{t('adminSettings:defaultPages.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleDefaultPagesSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="about_us">{t('adminSettings:defaultPages.aboutUs.label')}</label>
                      <textarea className="form-control" id="about_us" rows="6" placeholder={t('adminSettings:defaultPages.aboutUs.placeholder')}
                        value={settings.about_us ?? ''} onChange={(e) => update('about_us', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="terms_and_condition">{t('adminSettings:defaultPages.termsAndCondition.label')}</label>
                      <textarea className="form-control" id="terms_and_condition" rows="6" placeholder={t('adminSettings:defaultPages.termsAndCondition.placeholder')}
                        value={settings.terms_and_condition ?? ''} onChange={(e) => update('terms_and_condition', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="privacy_policy">{t('adminSettings:defaultPages.privacyPolicy.label')}</label>
                      <textarea className="form-control" id="privacy_policy" rows="6" placeholder={t('adminSettings:defaultPages.privacyPolicy.placeholder')}
                        value={settings.privacy_policy ?? ''} onChange={(e) => update('privacy_policy', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="terms_and_condition_merchant">{t('adminSettings:defaultPages.termsAndConditionMerchant.label')}</label>
                      <textarea className="form-control" id="terms_and_condition_merchant" rows="6" placeholder={t('adminSettings:defaultPages.termsAndConditionMerchant.placeholder')}
                        value={settings.terms_and_condition_merchant ?? ''} onChange={(e) => update('terms_and_condition_merchant', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="privacy_policy_merchant">{t('adminSettings:defaultPages.privacyPolicyMerchant.label')}</label>
                      <textarea className="form-control" id="privacy_policy_merchant" rows="6" placeholder={t('adminSettings:defaultPages.privacyPolicyMerchant.placeholder')}
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
                  <h5 className="card-title mb-0">{t('adminSettings:email.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleEmailSubmit}>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="mail_driver">{t('adminSettings:email.mailDriver.label')}</label>
                        <input type="text" className="form-control" id="mail_driver" placeholder={t('adminSettings:email.mailDriver.placeholder')}
                          value={settings.mail_driver ?? ''} onChange={(e) => update('mail_driver', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_host">{t('adminSettings:email.smtpHost.label')}</label>
                        <input type="text" className="form-control" id="smtp_host" placeholder={t('adminSettings:email.smtpHost.placeholder')}
                          value={settings.smtp_host ?? ''} onChange={(e) => update('smtp_host', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_port">{t('adminSettings:email.smtpPort.label')}</label>
                        <input type="text" className="form-control" id="smtp_port" placeholder={t('adminSettings:email.smtpPort.placeholder')}
                          value={settings.smtp_port ?? ''} onChange={(e) => update('smtp_port', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_encryption">{t('adminSettings:email.smtpEncryption.label')}</label>
                        <input type="text" className="form-control" id="smtp_encryption" placeholder={t('adminSettings:email.smtpEncryption.placeholder')}
                          value={settings.smtp_encryption ?? ''} onChange={(e) => update('smtp_encryption', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_username">{t('adminSettings:email.smtpUsername.label')}</label>
                        <input type="text" className="form-control" id="smtp_username" placeholder={t('adminSettings:email.smtpUsername.placeholder')}
                          value={settings.smtp_username ?? ''} onChange={(e) => update('smtp_username', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_password">{t('adminSettings:email.smtpPassword.label')}</label>
                        <input type="password" className="form-control" id="smtp_password" placeholder={t('adminSettings:email.smtpPassword.placeholder')}
                          value={settings.smtp_password ?? ''} onChange={(e) => update('smtp_password', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_from_email_address">{t('adminSettings:email.fromEmailAddress.label')}</label>
                        <input type="text" className="form-control" id="smtp_from_email_address" placeholder={t('adminSettings:email.fromEmailAddress.placeholder')}
                          value={settings.smtp_from_email_address ?? ''} onChange={(e) => update('smtp_from_email_address', e.target.value)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="smtp_from_name">{t('adminSettings:email.fromName.label')}</label>
                        <input type="text" className="form-control" id="smtp_from_name" placeholder={t('adminSettings:email.fromName.placeholder')}
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
                  <h5 className="card-title mb-0">{t('adminSettings:smsGateway.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSmsGatewaySubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header header-elements">
                            <h5 className="card-title mb-0">{t('adminSettings:smsGateway.msg91.title')}</h5>
                            <div className="card-action-element ms-auto">
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="sms_msg91_active"
                                  checked={smsGateway.msg91?.active === '1' || smsGateway.msg91?.active === true}
                                  onChange={(e) => setSmsGateway((prev) => ({
                                    ...prev,
                                    msg91: { ...prev.msg91, active: e.target.checked ? '1' : '' }
                                  }))} />
                                <label className="form-check-label" htmlFor="sms_msg91_active">{t('adminSettings:smsGateway.msg91.active')}</label>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="sms_msg91_authkey">{t('adminSettings:smsGateway.msg91.authKey')}</label>
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
                  <h5 className="card-title mb-0">{t('adminSettings:whatsappGateway.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleWhatsappGatewaySubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header header-elements">
                            <h5 className="card-title mb-0">{t('adminSettings:whatsappGateway.gallabox.title')}</h5>
                            <div className="card-action-element ms-auto">
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="whatsapp_gallabox_active"
                                  checked={whatsappGateway.gallabox?.active === '1' || whatsappGateway.gallabox?.active === true}
                                  onChange={(e) => setWhatsappGateway((prev) => ({
                                    ...prev,
                                    gallabox: { ...prev.gallabox, active: e.target.checked ? '1' : '' }
                                  }))} />
                                <label className="form-check-label" htmlFor="whatsapp_gallabox_active">{t('adminSettings:whatsappGateway.gallabox.active')}</label>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="whatsapp_gallabox_api_key">{t('adminSettings:whatsappGateway.gallabox.apiKey')}</label>
                              <input type="text" className="form-control" id="whatsapp_gallabox_api_key"
                                value={whatsappGateway.gallabox?.api_key ?? ''}
                                onChange={(e) => setWhatsappGateway((prev) => ({
                                  ...prev,
                                  gallabox: { ...prev.gallabox, api_key: e.target.value }
                                }))} />
                            </div>
                            <div className="mb-3">
                              <label className="form-label" htmlFor="whatsapp_gallabox_api_secret">{t('adminSettings:whatsappGateway.gallabox.apiSecret')}</label>
                              <input type="text" className="form-control" id="whatsapp_gallabox_api_secret"
                                value={whatsappGateway.gallabox?.api_secret ?? ''}
                                onChange={(e) => setWhatsappGateway((prev) => ({
                                  ...prev,
                                  gallabox: { ...prev.gallabox, api_secret: e.target.value }
                                }))} />
                            </div>
                            <div className="mb-3">
                              <label className="form-label" htmlFor="whatsapp_gallabox_channel_id">{t('adminSettings:whatsappGateway.gallabox.channelId')}</label>
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
                  <h5 className="card-title mb-0">{t('adminSettings:socialLinks.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSocialLinkSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="youtube_url">{t('adminSettings:socialLinks.youtubeUrl.label')}</label>
                      <input type="text" className="form-control" id="youtube_url" placeholder={t('adminSettings:socialLinks.youtubeUrl.placeholder')}
                        value={settings.youtube_url ?? ''} onChange={(e) => update('youtube_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="linkedin_url">{t('adminSettings:socialLinks.linkedinUrl.label')}</label>
                      <input type="text" className="form-control" id="linkedin_url" placeholder={t('adminSettings:socialLinks.linkedinUrl.placeholder')}
                        value={settings.linkedin_url ?? ''} onChange={(e) => update('linkedin_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="instagram_url">{t('adminSettings:socialLinks.instagramUrl.label')}</label>
                      <input type="text" className="form-control" id="instagram_url" placeholder={t('adminSettings:socialLinks.instagramUrl.placeholder')}
                        value={settings.instagram_url ?? ''} onChange={(e) => update('instagram_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="twitter_url">{t('adminSettings:socialLinks.twitterUrl.label')}</label>
                      <input type="text" className="form-control" id="twitter_url" placeholder={t('adminSettings:socialLinks.twitterUrl.placeholder')}
                        value={settings.twitter_url ?? ''} onChange={(e) => update('twitter_url', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="facebook_url">{t('adminSettings:socialLinks.facebookUrl.label')}</label>
                      <input type="text" className="form-control" id="facebook_url" placeholder={t('adminSettings:socialLinks.facebookUrl.placeholder')}
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
                  <h5 className="card-title mb-0">{t('adminSettings:queue.title')}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleQueueSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="default_queue_time">{t('adminSettings:queue.defaultQueueTime.label')}</label>
                      <input type="number" className="form-control" id="default_queue_time" placeholder={t('adminSettings:queue.defaultQueueTime.placeholder')}
                        value={settings.default_queue_time ?? ''} onChange={(e) => update('default_queue_time', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="max_queue_size">{t('adminSettings:queue.maxQueueSize.label')}</label>
                      <input type="number" className="form-control" id="max_queue_size" placeholder={t('adminSettings:queue.maxQueueSize.placeholder')}
                        value={settings.max_queue_size ?? ''} onChange={(e) => update('max_queue_size', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="advance_booking_days">{t('adminSettings:queue.advanceBookingDays.label')}</label>
                      <input type="number" className="form-control" id="advance_booking_days" placeholder={t('adminSettings:queue.advanceBookingDays.placeholder')}
                        value={settings.advance_booking_days ?? ''} onChange={(e) => update('advance_booking_days', e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="allow_queue_cancellation"
                          checked={settings.allow_queue_cancellation === '1' || settings.allow_queue_cancellation === true}
                          onChange={(e) => update('allow_queue_cancellation', e.target.checked ? '1' : '0')} />
                        <label className="form-check-label" htmlFor="allow_queue_cancellation">{t('adminSettings:queue.allowQueueCancellation')}</label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="auto_assign_queue_numbers"
                          checked={settings.auto_assign_queue_numbers === '1' || settings.auto_assign_queue_numbers === true}
                          onChange={(e) => update('auto_assign_queue_numbers', e.target.checked ? '1' : '0')} />
                        <label className="form-check-label" htmlFor="auto_assign_queue_numbers">{t('adminSettings:queue.autoAssignQueueNumbers')}</label>
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
