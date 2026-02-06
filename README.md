# FitPlanner Pro

A modern, client-side fitness and nutrition planning web application with tiered monetization via Square payment links.

## 🚀 Features

### Free Tier
- Daily nutrition tracking (calories, protein, carbs, sugar)
- Data persistence via LocalStorage
- Guest or registered access
- Recent entries history

### Pro Tier (Basic Pack - $5)
- All Free features
- Nutrition goal setting
- Progress tracking with visual indicators
- Target calories and protein

### Standard Tier (Standard Pack - $10)
- All Pro features
- Enhanced goal tracking
- Advanced analytics
- Priority support

### Elite Tier (Premium Pack - $20)
- All Standard features
- Complete workout plans (Push/Pull/Legs)
- Exercise recommendations
- Full feature access

## 🎨 Design

FitPlanner Pro features a bold, modern dark theme with:
- **Typography**: Archivo Black for headings, DM Sans for body
- **Color Scheme**: Dark backgrounds with vibrant green (#00ff88) and pink (#ff3366) accents
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-friendly design

## 📦 Technology Stack

- **HTML** - Structure
- **CSS** - Styling with CSS custom properties
- **Vanilla JavaScript** - App logic (no frameworks)
- **LocalStorage** - Data persistence
- **Square Payment Links** - Monetization
- **GitHub Pages** - Hosting

## 🔧 File Structure

```
fitplanner-pro/
├── index.html      # Main UI and layout
├── style.css       # Complete styling
├── app.js          # Nutrition tracking & feature logic
├── auth.js         # Local authentication system
├── payments.js     # Square tier unlocking
├── admin.js        # Admin override panel (CTRL+SHIFT+A)
├── .nojekyll       # Disable Jekyll on GitHub Pages
└── README.md       # This file
```

## 🚀 Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Save and wait for deployment

Your app will be live at: `https://yourusername.github.io/repository-name`

## 💳 Payment Setup

### Square Payment Links

The app uses the following Square payment links:

- **Basic Pack ($5)**: https://square.link/u/EaNUJ0gy
- **Standard Pack ($10)**: https://square.link/u/0cNYptZb
- **Premium Pack ($20)**: https://square.link/u/6Y9uWLVv
- **Donation**: https://square.link/u/91I3ruxV

### How Payment Unlocking Works

1. User clicks upgrade button on Pricing page
2. Redirected to Square payment page
3. After payment, configure Square to redirect to:
   - Basic: `your-app-url.com/?unlock=PRO`
   - Standard: `your-app-url.com/?unlock=STANDARD`
   - Premium: `your-app-url.com/?unlock=ELITE`
4. App detects URL parameter and unlocks features
5. Tier is stored in LocalStorage

### Configuring Square Redirects

In your Square Dashboard:
1. Go to your payment link
2. Add redirect URL with unlock parameter
3. Format: `https://yourusername.github.io/repo-name/?unlock=TIER`

## 🔐 Admin Panel

Press **CTRL + SHIFT + A** to open the hidden admin panel.

Features:
- View current user and tier
- Manually set tier for testing
- Clear all local data
- Testing and support tool

## 🗄️ Data Storage

All data is stored in browser LocalStorage:

- **User Accounts**: Email and password (local only)
- **Nutrition Entries**: Tracked meals and macros
- **Goals**: User-set targets
- **Tier**: Subscription level

**Note**: Data is device-specific and not synced across browsers.

## 🎯 User Flow

### First Visit
1. User sees authentication modal
2. Can register, login, or continue as guest
3. Starts with FREE tier

### Daily Use
1. Add nutrition entries
2. View daily summaries
3. (Pro+) Set and track goals
4. (Elite) Access workout plans

### Upgrading
1. Click "Upgrade" tab
2. Choose plan
3. Complete Square payment
4. Get redirected with unlock parameter
5. Features unlock automatically

## 🛠️ Local Development

1. Clone the repository
2. Open `index.html` in a browser
3. No build process needed!

Or use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

Then visit `http://localhost:8000`

## 📱 Features by Tier

| Feature | Free | Pro | Standard | Elite |
|---------|------|-----|----------|-------|
| Nutrition Tracking | ✓ | ✓ | ✓ | ✓ |
| Goal Setting | ✗ | ✓ | ✓ | ✓ |
| Enhanced Analytics | ✗ | ✗ | ✓ | ✓ |
| Workout Plans | ✗ | ✗ | ✗ | ✓ |

## 🔒 Security Notes

**This is a client-side only application:**
- No real authentication (passwords stored in LocalStorage)
- No server-side verification
- Trust-based tier unlocking
- Suitable for MVP/demonstration purposes

**For Production:**
- Implement proper backend authentication
- Add payment verification via Square API
- Use encrypted storage
- Add cross-device sync
- Implement rate limiting

## 🐛 Known Limitations

- No cross-device sync
- No cloud backup
- Payment verification is client-side only
- Data lost if LocalStorage is cleared
- No password recovery

## 📄 License

This is a demonstration project. Use at your own discretion.

## 🤝 Support

For issues or questions:
1. Check the console for errors
2. Use CTRL+SHIFT+A admin panel for testing
3. Clear LocalStorage to reset
4. Make a donation to support development!

---

**Built with ❤️ for the fitness community**

Track smarter, achieve faster with FitPlanner Pro! 💪
