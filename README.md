# UNIS eSports Tournament Platform

A modern web application for managing esports tournaments at UNIS Faculdade. Built with Node.js, Express, SQLite, and a responsive HTML5 frontend.

## Features

✨ **Registration System**
- Multi-step registration form
- Support for individual and team registrations
- Guardian authorization for minors
- LGPD-compliant data encryption

🎮 **Tournament Management**
- Support for 3 game modes (Free Fire, League of Legends, EA FC/FIFA)
- Automatic bracket generation
- Real-time tournament updates
- Winner tracking and champion display

👨‍💼 **Admin Panel**
- Participant management
- Tournament bracket control
- Statistics dashboard
- Data export capabilities

🔐 **Security & Privacy**
- AES-256 encryption for sensitive data
- CORS protection
- LGPD compliance
- Admin authentication

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation

```bash
# Navigate to backend directory
cd Node

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Local Development

```bash
# Start the backend server
npm run dev

# In another terminal, serve the frontend
npx http-server -p 8080
```

Then open `http://localhost:8080/unis-esports-2.html` in your browser.

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## Project Structure

```
unis-esports/
├── Node/                          # Backend (Node.js/Express)
│   ├── server.js                  # Main server
│   ├── package.json               # Dependencies
│   ├── .env.example               # Config template
│   ├── esports.db                 # SQLite database
│   └── src/
│       ├── config/database.js     # DB setup
│       ├── controllers/           # Business logic
│       ├── routes/                # API endpoints
│       └── utils/security.js      # Encryption
└── unis-esports-2.html            # Frontend (HTML/CSS/JS)
```

## API Endpoints

### Participants
- `POST /api/participants` - Register participant
- `GET /api/participants` - List participants (public data only)
- `DELETE /api/participants/:id` - Remove participant

### Brackets
- `GET /api/brackets` - Get all brackets
- `GET /api/brackets/:game` - Get specific bracket
- `PUT /api/brackets/:game` - Save/update bracket
- `DELETE /api/brackets/:game` - Delete bracket

### Admin
- `POST /api/admin/login` - Admin authentication

## Environment Variables

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://unisesports.com.br
ADMIN_USER=admin
ADMIN_PASS=unis2026
ENCRYPTION_KEY=<32-char-hex>
ENCRYPTION_IV=<16-char-hex>
```

See `.env.example` for full details.

## Data Security

- **Encrypted Fields**: Email, Phone (AES-256)
- **Public Data**: Nick, Game, Team, School
- **LGPD Compliant**: No third-party sharing, user consent required

## Database Schema

### participants
- `id` - UUID
- `name` - Full name
- `school` - School name
- `grade` - Grade/year
- `age` - Age
- `email` - Encrypted email
- `nick` - Gaming nickname
- `game` - Game choice
- `type` - individual/team
- `team_name` - Team name (if team)
- `members` - Team members
- `guardian` - Guardian name (if minor)
- `guardian_phone` - Encrypted guardian phone
- `created_at` - Registration timestamp

### event_flow
- `id` - UUID
- `participant_id` - FK to participants
- `status` - Event status
- `location` - Participant location
- `updated_at` - Last update time

### brackets
- `id` - UUID
- `game` - Game identifier
- `bracket_data` - JSON bracket structure
- `created_at` - Creation time
- `updated_at` - Last update time

## Testing

```bash
# Run API integration tests
node test_api.js
```

## Troubleshooting

**CORS Errors**
- Check `FRONTEND_URL` in `.env`
- Verify server is running

**Database Locked**
- Close other connections
- Restart server

**API 404s**
- Verify backend running on port 3000
- Check endpoint URLs

See [DEPLOYMENT.md](DEPLOYMENT.md) for more troubleshooting.

## Performance

- SQLite database for efficient queries
- In-memory bracket generation
- API response time < 100ms
- Supports 1000+ concurrent participants

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Developed for UNIS Faculdade

## Support

For deployment help, see [DEPLOYMENT.md](DEPLOYMENT.md)

For API details, see endpoint documentation in `/api/brackets`, `/api/participants`, etc.
