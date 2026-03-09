import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_URL;
const BASE_URL = config.BASE_URL;
const DEFAULT_PLACEHOLDER = config.DEFAULT_IMAGE_PLACEHOLDER;
const IMAGE_ACCEPT = config.IMAGE_UPLOAD_ACCEPT;

function getDisplayUrl(value) {
  if (!value) return DEFAULT_PLACEHOLDER;
  if (value.startsWith('http') || value.startsWith('data:')) return value;
  return `${BASE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

export default function ImageUploadWithCropper({
  name,
  value = '',
  onChange,
  aspectRatio = '',
  className = '',
  accept = IMAGE_ACCEPT,
}) {
  const [previewUrl, setPreviewUrl] = useState(() => getDisplayUrl(value));
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cropperImgRef = useRef(null);
  const cropperInstanceRef = useRef(null);
  const pendingFileRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(getDisplayUrl(value));
  }, [value]);

  const widthRatio = aspectRatio ? parseInt(aspectRatio.split('/')[0], 10) : 0;
  const heightRatio = aspectRatio ? parseInt(aspectRatio.split('/')[1], 10) : 0;
  const hasAspectRatio = widthRatio > 0 && heightRatio > 0;

  const uploadBlob = async (blob) => {
    setUploading(true);
    try {
      const formData = new FormData();
      const ext = blob.type === 'image/png' ? '.png' : '.jpg';
      formData.append('file', blob, `upload-${Date.now()}${ext}`);
      const { data } = await axios.post(`${API_URL}/admin/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success && data.data && data.data.url) {
        const url = data.data.url;
        onChange(url);
        setPreviewUrl(getDisplayUrl(url));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      if (!hasAspectRatio) {
        pendingFileRef.current = file;
        uploadBlob(file);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const actualRatio = img.width / img.height;
        const targetRatio = widthRatio / heightRatio;
        if (Math.abs(actualRatio - targetRatio) < 0.01) {
          uploadBlob(file);
          return;
        }
        pendingFileRef.current = { blob: file, dataUrl };
        setCropperSrc(dataUrl);
        setCropperOpen(true);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const closeCropper = () => {
    if (cropperInstanceRef.current) {
      cropperInstanceRef.current.destroy();
      cropperInstanceRef.current = null;
    }
    setCropperOpen(false);
    setCropperSrc(null);
    pendingFileRef.current = null;
  };

  useEffect(() => {
    if (!cropperOpen || !cropperSrc) return;
    cropperInstanceRef.current = null;
    return () => {
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
        cropperInstanceRef.current = null;
      }
    };
  }, [cropperOpen, cropperSrc]);

  const handleCropperImageLoad = () => {
    if (!cropperOpen || !cropperSrc || !cropperImgRef.current || !hasAspectRatio) return;
    if (cropperInstanceRef.current) return;
    const ratio = widthRatio / heightRatio;
    const cropper = new Cropper(cropperImgRef.current, {
      aspectRatio: ratio,
      viewMode: 0,
      autoCropArea: 1,
      zoomable: true,
      scalable: false,
      responsive: true,
      cropBoxResizable: true,
      cropBoxMovable: true,
      guides: true,
      center: true,
      highlight: true,
    });
    cropperInstanceRef.current = cropper;
  };

  const handleCropDone = () => {
    const cropper = cropperInstanceRef.current;
    if (!cropper || typeof cropper.getCroppedCanvas !== 'function') return;
    const canvas = cropper.getCroppedCanvas({ imageSmoothingEnabled: true, imageSmoothingQuality: 'high' });
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          uploadBlob(blob);
          closeCropper();
        }
      },
      'image/png',
      0.95
    );
  };

  const handleRemove = () => {
    onChange('');
    setPreviewUrl(DEFAULT_PLACEHOLDER);
  };

  const hasImage = value && value.length > 0;

  return (
    <div className={`image-upload-area ${className}`.trim()}>
      <div className="image-preview">
        <div
          className="imagePreview"
          style={{
            backgroundImage: `url(${previewUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </div>
      <div className="image-edit">
        <input
          ref={fileInputRef}
          type="file"
          className="d-none"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <label
          className={`imageUploadBtn ${hasImage ? 'd-none' : ''}`}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <i className="bx bx-upload me-1"></i>
          {uploading ? 'Uploading...' : 'Upload image'}
        </label>
        <span
          className={`removeImageBtn ${hasImage ? '' : 'd-none'}`}
          onClick={handleRemove}
        >
          <i className="bx bx-x"></i> Remove
        </span>
      </div>
      {cropperOpen && cropperSrc && (
        <div key={name} className="cropper-model show" style={{ display: 'block' }}>
          <div className="cropper-popup">
            <div className="cropper-inner" style={{ height: 400, backgroundColor: '#000' }}>
              <img
                ref={cropperImgRef}
                src={cropperSrc}
                alt="Crop"
                style={{ maxWidth: '100%', maxHeight: 400, display: 'block' }}
                onLoad={handleCropperImageLoad}
              />
            </div>
            <div className="d-flex justify-content-between mt-2 flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm cropper-zoom-in"
                onClick={() => cropperInstanceRef.current && cropperInstanceRef.current.zoom(0.1)}
              >
                <i className="bx bx-zoom-in me-1"></i> Zoom In
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm cropper-zoom-out"
                onClick={() => cropperInstanceRef.current && cropperInstanceRef.current.zoom(-0.1)}
              >
                <i className="bx bx-zoom-out me-1"></i> Zoom Out
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm cropper-reset"
                onClick={() => cropperInstanceRef.current && cropperInstanceRef.current.reset()}
              >
                <i className="bx bx-reset me-1"></i> Reset
              </button>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={closeCropper}>
                Close
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleCropDone}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
