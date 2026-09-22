# QR Code Generator

A simple web app to generate and customize QR codes for URLs, text, emails, phone numbers, and WiFi networks. Built for the GDG on Campus SRM technical recruitment task.

**Live:** https://qr-code-generator-nine-steel.vercel.app

## Screenshots

![Desktop view](screenshots/desktop.png)
![QR example](screenshots/qr-example.png)
![Mobile view](screenshots/mobile-1.png)

## Features

- Generate QR codes for URL, plain text, email, phone number, and WiFi
- Customize size, colors, error correction level
- Download as PNG or copy to clipboard
- Keeps your last 10 QR codes (saved in localStorage, so they're still there after a refresh)
- Works on mobile too

## Built with

- React + Vite
- Tailwind CSS
- qrcode.react for generating the codes
- html2canvas for the PNG export

## Running it locally

```bash
git clone https://github.com/jagadeshwar2007/qr-code-generator.git
cd qr-code-generator
npm install
npm run dev
```

Opens at `http://localhost:5173`

To build for production:
```bash
npm run build
```

## Notes

- All error correction levels tested and QR codes still scan fine with high correction (30%) even with custom colors
- Validates input before letting you download (invalid URLs, emails, etc. show an error instead of generating a broken QR)
