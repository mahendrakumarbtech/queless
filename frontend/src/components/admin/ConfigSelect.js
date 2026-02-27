import React from 'react';
import Select from 'react-select';
import config from '../../config/config';

/**
 * Select2-style dropdown (no search) – options from config.SETTINGS_DROPDOWNS[key].
 * key: 'currency_position' | 'date_format' | 'time_format' | 'datetime_format'
 */
export default function ConfigSelect({ optionsKey, value, onChange, id, placeholder = 'Select' }) {
  const optionsObj = (config.SETTINGS_DROPDOWNS && config.SETTINGS_DROPDOWNS[optionsKey]) || {};
  const options = Object.entries(optionsObj).map(([val, label]) => ({
    value: val,
    label,
  }));

  const selected = options.find((o) => o.value === (value ?? '')) || null;

  return (
    <Select
      inputId={id}
      options={options}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : '')}
      placeholder={placeholder}
      isClearable
      isSearchable={false}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({ ...base, minHeight: 38 }),
      }}
    />
  );
}
