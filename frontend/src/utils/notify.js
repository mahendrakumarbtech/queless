/**
 * Unified notify: Swal (modal) or Toast (non-blocking).
 * Use notify.success(), .error(), .warning(), .info() with options.
 * Pass useSwal: true for modal (SweetAlert2), otherwise toast is used.
 *
 * @example
 * notify.success('Saved!');
 * notify.error({ text: 'Failed', useSwal: true });
 * notify.success({ title: 'Success', text: 'Done', useSwal: true });
 */

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const DEFAULT_TITLES = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

function normalizeArgs(messageOrOptions, opts = {}) {
  if (typeof messageOrOptions === 'string') {
    return { text: messageOrOptions, ...opts };
  }
  return { ...messageOrOptions, ...opts };
}

function showToast(type, title, text) {
  /* Toast me sirf message dikhate hain, title (Success/Error) nahi – Swal ke liye title use hota hai */
  const message = text || title || '';
  toast(message, { type });
}

async function showSwal(type, title, text, options = {}) {
  return Swal.fire({
    icon: type,
    title: title || DEFAULT_TITLES[type],
    text: text || undefined,
    confirmButtonText: options.confirmButtonText ?? 'OK',
    ...options,
  });
}

function createNotifier(type) {
  return function (messageOrOptions, opts = {}) {
    const { title, text, useSwal = false, ...rest } = normalizeArgs(messageOrOptions, opts);
    const displayTitle = title ?? DEFAULT_TITLES[type];
    const displayText = text ?? (typeof messageOrOptions === 'string' ? messageOrOptions : '');

    if (useSwal) {
      return showSwal(type, displayTitle, displayText, rest);
    }
    showToast(type, displayTitle, displayText);
  };
}

const notify = {
  success: createNotifier('success'),
  error: createNotifier('error'),
  warning: createNotifier('warning'),
  info: createNotifier('info'),
};

export default notify;
