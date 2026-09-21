import React, { useState, useRef, useEffect, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import './App.css';

const App = () => {
  const [qrType, setQrType] = useState('url');
  const [inputValues, setInputValues] = useState({
    url: '',
    text: '',
    email: '',
    phone: '',
    wifiSSID: '',
    wifiPassword: '',
    wifiSecurity: 'WPA'
  });

  const [customization, setCustomization] = useState({
    size: 256,
    fgColor: '#000000',
    bgColor: '#ffffff',
    errorLevel: 'H',
    margin: 10
  });

  const [recentQRs, setRecentQRs] = useState([]);
  const [downloadError, setDownloadError] = useState('');
  const qrRef = useRef();

  // Load recent QRs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentQRs');
    if (saved) {
      try {
        setRecentQRs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent QRs:', e);
      }
    }
  }, []);

  // Save recent QRs to localStorage
  useEffect(() => {
    localStorage.setItem('recentQRs', JSON.stringify(recentQRs.slice(0, 10)));
  }, [recentQRs]);

  // Compute validation errors as a pure, memoized value (no setState during render —
  // that was causing the "Too many re-renders" crash).
  const errors = useMemo(() => {
    const newErrors = {};

    switch (qrType) {
      case 'url':
        if (!inputValues.url.trim()) {
          newErrors.url = 'URL is required';
        } else if (!/^https?:\/\/.+/.test(inputValues.url)) {
          newErrors.url = 'Invalid URL format';
        }
        break;
      case 'text':
        if (!inputValues.text.trim()) {
          newErrors.text = 'Text is required';
        }
        break;
      case 'email':
        if (!inputValues.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValues.email)) {
          newErrors.email = 'Invalid email format';
        }
        break;
      case 'phone':
        if (!inputValues.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,}$/.test(inputValues.phone.replace(/[\s-]/g, ''))) {
          newErrors.phone = 'Invalid phone number (min 10 digits)';
        }
        break;
      case 'wifi':
        if (!inputValues.wifiSSID.trim()) {
          newErrors.wifiSSID = 'Network name is required';
        }
        break;
      default:
        break;
    }

    return newErrors;
  }, [qrType, inputValues]);

  const isValid = Object.keys(errors).length === 0;

  // Generate QR code value based on type
  const getQRValue = () => {
    switch (qrType) {
      case 'url':
        return inputValues.url;
      case 'text':
        return inputValues.text;
      case 'email':
        return `mailto:${inputValues.email}`;
      case 'phone':
        return `tel:${inputValues.phone.replace(/[\s-]/g, '')}`;
      case 'wifi':
        return `WIFI:T:${inputValues.wifiSecurity};S:${inputValues.wifiSSID};P:${inputValues.wifiPassword};;`;
      default:
        return '';
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle customization changes
  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: name === 'size' ? parseInt(value) : name === 'margin' ? parseInt(value) : value
    }));
  };

  // Download QR code as PNG
  const downloadQR = async () => {
    if (!isValid) return;
    setDownloadError('');

    try {
      const element = qrRef.current.querySelector('canvas');
      const image = await html2canvas(element, {
        backgroundColor: customization.bgColor,
        scale: 2
      });
      const link = document.createElement('a');
      link.href = image.toDataURL('image/png');
      link.download = `qrcode-${Date.now()}.png`;
      link.click();

      // Add to recent QRs
      const newQR = {
        id: Date.now(),
        type: qrType,
        value: getQRValue(),
        timestamp: new Date().toLocaleString()
      };
      setRecentQRs(prev => [newQR, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError('Failed to download QR code');
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!isValid) return;
    try {
      const element = qrRef.current.querySelector('canvas');
      element.toBlob(blob => {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]).catch(err => console.error('Copy failed:', err));
      });
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Load recent QR
  const loadRecentQR = (qr) => {
    setQrType(qr.type);
    const key = Object.keys(inputValues).find(k => k.includes(qr.type));
    setInputValues(prev => ({
      ...prev,
      [key]: qr.value
    }));
  };

  const qrValue = getQRValue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
          <p className="text-gray-600">Create and customize QR codes instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input & Customization */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configuration</h2>

            {/* QR Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">QR Type</label>
              <select
                value={qrType}
                onChange={(e) => setQrType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="url">URL</option>
                <option value="text">Plain Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
                <option value="wifi">WiFi</option>
              </select>
            </div>

            {/* Dynamic Input Fields */}
            <div className="mb-6">
              {qrType === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                  <input
                    type="url"
                    name="url"
                    value={inputValues.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                </div>
              )}

              {qrType === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <textarea
                    name="text"
                    value={inputValues.text}
                    onChange={handleInputChange}
                    placeholder="Enter your text"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
                </div>
              )}

              {qrType === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={inputValues.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              )}

              {qrType === 'phone' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={inputValues.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              )}

              {qrType === 'wifi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
                    <input
                      type="text"
                      name="wifiSSID"
                      value={inputValues.wifiSSID}
                      onChange={handleInputChange}
                      placeholder="WiFi Network"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.wifiSSID && <p className="text-red-500 text-sm mt-1">{errors.wifiSSID}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password (Optional)</label>
                    <input
                      type="password"
                      name="wifiPassword"
                      value={inputValues.wifiPassword}
                      onChange={handleInputChange}
                      placeholder="WiFi password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Security</label>
                    <select
                      name="wifiSecurity"
                      value={inputValues.wifiSecurity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">No Password</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Customization Options */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Customize</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size: {customization.size}px
                  </label>
                  <input
                    type="range"
                    name="size"
                    min="128"
                    max="512"
                    step="32"
                    value={customization.size}
                    onChange={handleCustomizationChange}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foreground Color</label>
                    <input
                      type="color"
                      name="fgColor"
                      value={customization.fgColor}
                      onChange={handleCustomizationChange}
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <input
                      type="color"
                      name="bgColor"
                      value={customization.bgColor}
                      onChange={handleCustomizationChange}
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction Level</label>
                  <select
                    name="errorLevel"
                    value={customization.errorLevel}
                    onChange={handleCustomizationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margin: {customization.margin}px
                  </label>
                  <input
                    type="range"
                    name="margin"
                    min="0"
                    max="50"
                    step="5"
                    value={customization.margin}
                    onChange={handleCustomizationChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 mt-6 space-y-2">
              <button
                onClick={downloadQR}
                disabled={!isValid}
                className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                  isValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                📥 Download as PNG
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!isValid}
                className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                  isValid
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                📋 Copy to Clipboard
              </button>
            </div>
          </div>

          {/* Right Panel - Preview & Recent */}
          <div>
            {/* QR Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview</h2>
              <div
                ref={qrRef}
                className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-lg"
                style={{ backgroundColor: customization.bgColor }}
              >
                {isValid && (
                  <QRCodeCanvas
                    value={qrValue}
                    size={customization.size}
                    level={customization.errorLevel}
                    includeMargin={true}
                    fgColor={customization.fgColor}
                    bgColor={customization.bgColor}
                  />
                )}
                {!isValid && (
                  <p className="text-gray-400 text-center">Enter valid information to preview QR code</p>
                )}
              </div>
              {!isValid && Object.keys(errors).length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">Please fix the following errors:</p>
                  {Object.values(errors).map((err, i) => (
                    <p key={i} className="text-red-600 text-sm">• {err}</p>
                  ))}
                </div>
              )}
              {downloadError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{downloadError}</p>
                </div>
              )}
            </div>

            {/* Recent QRs */}
            {recentQRs.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent QR Codes</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {recentQRs.map(qr => (
                    <button
                      key={qr.id}
                      onClick={() => loadRecentQR(qr)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200"
                    >
                      <p className="text-sm font-medium text-gray-800 capitalize">{qr.type}</p>
                      <p className="text-xs text-gray-500 truncate">{qr.value.substring(0, 50)}</p>
                      <p className="text-xs text-gray-400">{qr.timestamp}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
