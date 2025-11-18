import QRCode from 'qrcode';

const defaultOptions = {
  errorCorrectionLevel: 'M',
  type: 'image/png',
  margin: 2,
  color: { dark: '#000000', light: '#FFFFFFFF' },
};

export async function generateQrBase64(content, options = {}) {
  const dataUrl = await QRCode.toDataURL(content, {
    ...defaultOptions,
    ...options,
  });
  return dataUrl.replace(/^data:image\/png;base64,/, '');
}

