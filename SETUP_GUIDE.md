# QR Code Generator - Complete Setup Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Initialize Node Project
```bash
cd qr-code-generator
npm install
```

This installs all dependencies:
- react & react-dom
- qrcode.react (for QR generation)
- html2canvas (for downloading)
- tailwindcss (for styling)
- vite (build tool)

### Step 2: Run Development Server
```bash
npm run dev
```

The app opens automatically at `http://localhost:5173`

### Step 3: Test All Features
- [ ] Generate URL QR code
- [ ] Generate Email QR code
- [ ] Generate Phone QR code
- [ ] Generate WiFi QR code
- [ ] Generate Text QR code
- [ ] Customize colors
- [ ] Customize size
- [ ] Download as PNG
- [ ] Copy to clipboard
- [ ] Check recent QRs persist

### Step 4: Build for Production
```bash
npm run build
```

Creates optimized `dist/` folder ready for deployment

---

## 🚀 Deploy to Vercel (Recommended)

### Method 1: Using Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Method 2: Via GitHub (Best for Team)
1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial QR Generator commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/qr-code-generator.git
   git push -u origin main
   ```

2. Go to https://vercel.com/new
3. Select your GitHub repository
4. Click Deploy (auto-detects Vite!)
5. Get shareable URL instantly

---

## 📸 Screenshots to Add

Create a `screenshots/` folder in your GitHub repo and add:

1. **Desktop Preview** - Full app with QR preview
2. **Mobile View** - Responsive mobile layout
3. **Customization** - Color picker and size slider
4. **QR Types** - Different QR type examples
5. **Recent QRs** - Recent QR codes list

### How to Take Screenshots:
```bash
# Option 1: Use browser DevTools
# Open in Chrome → F12 → Ctrl+Shift+P → "Screenshot"

# Option 2: Online tool
# https://screenshot.guru/
```

---

## 📋 GitHub Repository Structure

```
qr-code-generator/
├── index.html
├── main.jsx
├── App.jsx
├── App.css
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
├── .gitignore
└── screenshots/
    ├── desktop.png
    ├── mobile.png
    ├── customization.png
    ├── qr-types.png
    └── recent-qrs.png
```

---

## ✅ Checklist Before Submission

- [ ] Code runs without errors (`npm run dev`)
- [ ] All 10 required features implemented
- [ ] All QR types working (URL, Text, Email, Phone, WiFi)
- [ ] Customization panel fully functional
- [ ] Download as PNG working
- [ ] Recent QRs persist across refresh
- [ ] Responsive on mobile/tablet/desktop
- [ ] Input validation working
- [ ] No plagiarism (100% original)
- [ ] GitHub repo is PUBLIC
- [ ] README is comprehensive
- [ ] Screenshots added to repo
- [ ] Deployed to Vercel/Netlify (working link)
- [ ] Submitted before October 4, 2026

---

## 🎯 Submission Requirements

### What to Submit:
1. ✅ **GitHub Repository Link** (MUST be public)
   ```
   https://github.com/yourusername/qr-code-generator
   ```

2. ✅ **Live Deployment Link** (Vercel/Netlify)
   ```
   https://qr-code-generator-xyz.vercel.app
   ```

3. ✅ **Screenshots in Repository**
   - Add 3-5 screenshots showing the app
   - Include desktop and mobile views

4. ✅ **README with Setup Instructions**
   - Already created! ✓

### Submit To:
- Email: technical@gdgsrm.com
- Include repository link and live demo

---

## 🐛 Troubleshooting

### Issue: `npm install` fails
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Vite port 5173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: QR code not downloading
- Check browser console for errors (F12)
- Try different browser
- Ensure download permissions enabled

### Issue: Colors not saving
- Clear browser localStorage
- Disable private/incognito mode

---

## 📚 Useful Resources

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- [html2canvas](https://html2canvas.hertzen.com/)

---

## 🎉 You're Ready!

Your QR Code Generator is complete and submission-ready. Good luck! 🚀
