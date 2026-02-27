import React, { useCallback, useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;

/**
 * Select2-like dropdown: options from common API GET /api/admin/options?type=...&q=...
 * type: 'currency' | 'timezone'
 */
export default function AdminOptionsSelect({ type, value, onChange, placeholder = 'Select...' }) {
  const [initialOption, setInitialOption] = useState(null);

  const loadOptions = useCallback(
    (inputValue) => {
      return axios
        .get(`${API_URL}/admin/options`, { params: { type, q: inputValue || '' } })
        .then((res) => {
          const list = (res.data && res.data.data) || [];
          return list.map((o) => ({ value: o.id, label: o.text }));
        })
        .catch(() => []);
    },
    [type]
  );

  useEffect(() => {
    if (!value) {
      setInitialOption(null);
      return;
    }
    loadOptions('').then((opts) => {
      const found = opts.find((o) => o.value === value);
      setInitialOption(found || { value, label: value });
    });
  }, [type, value]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = value
    ? (initialOption || { value, label: value })
    : null;

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : '')}
      placeholder={placeholder}
      isClearable
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({ ...base, minHeight: 38 }),
      }}
    />
  );
}
