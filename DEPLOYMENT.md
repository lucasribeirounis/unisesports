# UNIS eSports - Integration & Deployment Guide

## Overview

This guide explains how to integrate the HTML frontend with the Node.js backend database and deploy the system to `unisesports.com.br`.

## Architecture

### Components

1. **Frontend**: `unis-esports-2.html` - Static HTML file with modern UI and API integration
2. **Backend**: Node.js Express server with SQLite database
3. **Database**: SQLite (better-sqlite3) for storing participants and tournament brackets
4. **Data Security**: AES-256 encryption for sensitive data (email, phone) compliant with LGPD

### Data Flow

```
HTML Form → API Endpoints → Node.js Server → SQLite Database
                                     ↓
                            Encrypted Storage
                            (Email, Phone)
```

## Prerequisites

- Node.js 16+ and npm
- Git
- A domain name (e.g., unisesports.com.br)
- Hosting with Node.js support (Heroku, AWS, DigitalOcean, etc.)

## Local Development Setup

### 1. Install Dependencies

```bash
cd Node
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `better-sqlite3` - SQLite database

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your local values:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
ADMIN_USER=admin
ADMIN_PASS=unis2026
ENCRYPTION_KEY=vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3
ENCRYPTION_IV=81F5E19A629631EF
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### 4. Serve Frontend

Option A: Use a simple HTTP server for the HTML file:

```bash
# In the parent directory of Node/
npx http-server -p 8080
```

Then open `http://localhost:8080/unis-esports-2.html`.

**Note**: In development, the HTML file will try to connect to `http://localhost:3000` for API calls.

## Production Deployment

### Step 1: Prepare for Production

#### Update Environment Variables

Create a production `.env` file with:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://unisesports.com.br
ADMIN_USER=your_secure_admin_user
ADMIN_PASS=your_secure_admin_password
ENCRYPTION_KEY=<generate-32-char-hex>
ENCRYPTION_IV=<generate-16-char-hex>
```

**Security Notes**:
- Change `ADMIN_USER` and `ADMIN_PASS` from defaults
- Generate new encryption keys:
  ```bash
  # Generate ENCRYPTION_KEY (32 hex chars)
  node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
  
  # Generate ENCRYPTION_IV (16 hex chars)
  node -e "console.log(require('crypto').randomBytes(8).toString('hex'))"
  ```
- Never commit `.env` to GitHub (use `.gitignore`)

#### Update CORS Configuration

The `FRONTEND_URL` in `.env` is automatically added to the CORS whitelist. Update [server.js](server.js) if you need additional origins:

```javascript
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://unisesports.com.br'
];
```

### Step 2: Deploy Backend to Hosting

#### Option A: Heroku (Recommended for Simple Deployment)

1. Create Heroku account at heroku.com
2. Install Heroku CLI
3. Initialize Heroku app:
   ```bash
   heroku create unis-esports
   ```
4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://unisesports.com.br
   heroku config:set ADMIN_USER=your_username
   heroku config:set ADMIN_PASS=your_password
   heroku config:set ENCRYPTION_KEY=<your-key>
   heroku config:set ENCRYPTION_IV=<your-iv>
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```
6. Your API will be at `https://unis-esports.herokuapp.com`

#### Option B: DigitalOcean (VPS)

1. Create Ubuntu 20.04 droplet
2. SSH into droplet
3. Install Node.js and nginx:
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx
   ```
4. Clone repository and setup:
   ```bash
   git clone <your-repo> unis-esports
   cd unis-esports/Node
   npm install
   ```
5. Create `.env` file with production variables
6. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "unis-esports"
   pm2 startup
   pm2 save
   ```
7. Configure nginx as reverse proxy

#### Option C: AWS EC2, Azure, or Other Providers

Follow similar VPS setup steps as DigitalOcean.

### Step 3: Configure Frontend

Once backend is deployed, the HTML file automatically connects to the API based on the domain:

- **Local**: `http://localhost:3000/api`
- **Production**: `https://unisesports.com.br/api`

This is handled by the `API_BASE_URL` calculation in the HTML:

```javascript
const API_BASE_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://${window.location.hostname}:${window.location.port || 3000}/api`;
    }
    return `${window.location.protocol}//${window.location.host}/api`;
})();
```

### Step 4: Host Frontend

#### Option A: GitHub Pages (Static Hosting)

1. Rename HTML file to `index.html`
2. Push to GitHub repository
3. Enable GitHub Pages in repository settings

#### Option B: Netlify (Recommended)

1. Create Netlify account
2. Drag and drop `unis-esports-2.html` to deploy
3. Configure custom domain

#### Option C: S3 + CloudFront (AWS)

1. Upload HTML to S3 bucket
2. Configure CloudFront CDN
3. Setup custom domain

### Step 5: Configure Domain & HTTPS

1. Update DNS to point `unisesports.com.br` to your hosting
2. Setup SSL/TLS certificate (Let's Encrypt is free)
3. Force HTTPS redirect

## API Endpoints Reference

### Participants

**POST `/api/participants`** - Create participant
```json
{
  "name": "João Silva",
  "school": "Escola Estadual",
  "grade": "2º Ano",
  "age": 16,
  "email": "joao@escola.com.br",
  "nick": "JoaoXX",
  "game": "freefire",
  "type": "individual",
  "team_name": "JoaoXX",
  "members": "JoaoXX",
  "guardian": "Maria Silva",
  "guardian_phone": "(35) 99999-9999"
}
```

**GET `/api/participants`** - List all participants (public data only)

**DELETE `/api/participants/:id`** - Remove participant

### Brackets

**GET `/api/brackets`** - Get all brackets

**GET `/api/brackets/:game`** - Get bracket for specific game

**PUT `/api/brackets/:game`** - Save bracket

**DELETE `/api/brackets/:game`** - Delete bracket

### Admin

**POST `/api/admin/login`** - Authenticate admin
```json
{
  "username": "admin",
  "password": "unis2026"
}
```

## Data Security & LGPD Compliance

### Encrypted Fields

- **Email** - AES-256 encrypted in database
- **Guardian Phone** - AES-256 encrypted in database

### Public Data

Public participants list (`GET /api/participants`) returns only:
- Participant ID
- Nick
- Game
- Team Name
- School
- Type (Individual/Team)

Sensitive data (email, phone) is NOT included.

### Best Practices

1. Use strong admin credentials
2. Rotate encryption keys periodically
3. Backup database regularly
4. Monitor access logs
5. Use HTTPS everywhere
6. Keep Node.js and dependencies updated

## Testing API Integration

### Test Script

Use the included `test_api.js`:

```bash
# Make sure server is running
npm run dev

# In another terminal
node test_api.js
```

This creates a participant, updates flow, and verifies public data safety.

### Manual Testing

1. Open HTML in browser
2. Fill registration form
3. Check browser DevTools Network tab for API calls
4. Verify data in admin panel

## Troubleshooting

### "CORS error" when submitting form

- Check `FRONTEND_URL` in `.env` matches actual domain
- Verify `Access-Control-Allow-Origin` headers in server response

### Database locked error

- Close any other connections to `esports.db`
- Restart server
- Check file permissions

### API returns 404

- Verify backend is running
- Check API_BASE_URL in browser console
- Verify endpoints exist in `server.js`

### Encrypted data won't decrypt

- Verify `ENCRYPTION_KEY` and `ENCRYPTION_IV` are correct
- Check that key length matches (32 hex = 16 bytes for AES-256)
- Don't change keys after data is encrypted

## Maintenance

### Database Backups

```bash
# Backup
cp esports.db esports.db.backup.$(date +%s)

# Restore
cp esports.db.backup.1234567890 esports.db
```

### Monitoring

Monitor these metrics:
- API response time
- Database size
- Number of participants
- Server memory usage

### Updates

Keep dependencies updated:

```bash
npm update
npm audit fix
```

## Support

For issues or questions:
1. Check browser console for errors
2. Check server logs for stack traces
3. Verify all environment variables are set
4. Review this guide's troubleshooting section

## Project Structure

```
Node/
├── index.js                    # Simple server example
├── server.js                   # Main Express server
├── test_api.js                 # API integration tests
├── package.json                # Dependencies
├── .env                        # Environment (DO NOT COMMIT)
├── .env.example                # Template
├── .gitignore                  # Git ignore rules
├── esports.db                  # SQLite database
└── src/
    ├── config/
    │   └── database.js         # Database setup & schema
    ├── controllers/
    │   ├── participantController.js  # Participant logic
    │   ├── flowController.js         # Event flow logic
    │   └── bracketController.js      # Tournament logic
    ├── routes/
    │   ├── participantRoutes.js      # /api/participants
    │   ├── flowRoutes.js             # /api/flow
    │   └── bracketRoutes.js          # /api/brackets
    └── utils/
        └── security.js         # Encryption/decryption

../
└── unis-esports-2.html         # Frontend (HTML + CSS + JS)
```

## Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Caching**: Implement browser caching for static assets
3. **CDN**: Use CDN for HTML and assets distribution
4. **Gzip Compression**: Enable gzip in nginx/Express
5. **Database Queries**: Optimize SELECT queries

## Security Checklist

- [ ] Change default admin credentials
- [ ] Generate new encryption keys
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Backup database regularly
- [ ] Monitor access logs
- [ ] Update dependencies
- [ ] Use strong database passwords
- [ ] Implement rate limiting
- [ ] Add request validation

---

**Last Updated**: 2026
**Version**: 1.0
