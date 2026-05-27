# Quick Start Guide

## 1️⃣ Install Dependencies

```bash
cd Node
npm install
```

## 2️⃣ Create .env File

```bash
cp .env.example .env
```

Edit `.env` if you want to change defaults for local development.

## 3️⃣ Start Backend

```bash
npm run dev
```

You should see:
```
Banco de dados e tabelas inicializados com sucesso.
Servidor rodando em development na porta 3000
Frontend esperado: http://localhost:3000
```

## 4️⃣ Serve Frontend

In another terminal:

```bash
# Navigate to parent directory of Node/
cd ..

# Serve HTML
npx http-server -p 8080

# Or use Python
python3 -m http.server 8080
```

## 5️⃣ Open in Browser

Visit: `http://localhost:8080/unis-esports-2.html`

You should see the application working with:
- Registration form
- Participant list (after registration)
- Admin panel (login with admin/unis2026)
- Tournament brackets

## 6️⃣ Verify Integration

### Test Registration
1. Go to "Inscrição" tab
2. Fill out form completely
3. Submit
4. You should see confirmation with registration number

### Check Admin Panel
1. Go to "Admin" tab
2. Login with `admin` / `unis2026`
3. You should see the participant you just registered

### Test Bracket
1. In Admin panel, click "Gerar chaveamento" for any game
2. Bracket should generate with participants
3. Click "Avançar vencedor" to advance winners

## 7️⃣ Deploy to Production

### For unisesports.com.br

See **DEPLOYMENT.md** for:
- Environment setup
- Hosting options (Heroku, DigitalOcean, AWS, etc.)
- Domain configuration
- HTTPS setup
- Deployment steps

### Quick Production Setup

1. **Choose Hosting**: Heroku (easiest), DigitalOcean, AWS, etc.
2. **Update .env** with production values
3. **Push to GitHub**
4. **Deploy from GitHub** to your hosting
5. **Update FRONTEND_URL** in .env to your domain
6. **Configure DNS** to point to your hosting
7. **Setup HTTPS** with Let's Encrypt or AWS
8. **Test in production**

## 🧪 API Test

```bash
# While server is running
node test_api.js
```

This creates a participant, updates status, and verifies data is saved.

## 📝 Files to Know

- `server.js` - Main server file
- `unis-esports-2.html` - Frontend (can be served from any web server)
- `.env.example` - Configuration template
- `DEPLOYMENT.md` - Production deployment guide
- `README.md` - Full project documentation

## ⚠️ Important Notes

### Development
- Frontend automatically connects to `http://localhost:3000`
- Database stored in `esports.db` (local file)
- Admin: `admin` / `unis2026`

### Production  
- Frontend URL detected from domain automatically
- `.env` file controls production settings
- Must set strong admin credentials
- Must generate new encryption keys
- `.env` file MUST NOT be committed to Git

## 🔑 Key Environment Variables

| Variable | Local | Production |
|----------|-------|-----------|
| NODE_ENV | development | production |
| FRONTEND_URL | http://localhost:3000 | https://unisesports.com.br |
| ADMIN_USER | admin | <change-this> |
| ADMIN_PASS | unis2026 | <change-this> |

## ✅ Checklist Before Deploying to unisesports.com.br

- [ ] `npm install` completed
- [ ] `.env` file created
- [ ] `npm run dev` starts without errors
- [ ] HTML file loads in browser
- [ ] Can register participant
- [ ] Admin panel works
- [ ] Bracket generation works
- [ ] `npm test` passes (if tests added)
- [ ] Database has no errors
- [ ] All data encrypts/decrypts properly

## 🆘 Common Issues

**"Cannot find module 'cors'"**
```bash
npm install cors
```

**"CORS error" in browser**
- Make sure server is running on port 3000
- Check browser console for exact error
- See DEPLOYMENT.md troubleshooting

**"Database is locked"**
- Stop server and restart
- Close any other connections to esports.db

**API returns 404**
- Verify server is running
- Check port is 3000
- Verify endpoint path is correct

## 📚 Documentation

- **INTEGRATION_SUMMARY.md** - What was done and how it works
- **DEPLOYMENT.md** - Complete deployment guide
- **README.md** - Project overview

## 🚀 You're Ready!

The application is fully integrated and ready for:
1. ✅ Local development testing
2. ✅ GitHub upload
3. ✅ Production deployment to unisesports.com.br

All data flows from the HTML frontend → API → Node.js → SQLite database.

---

**Need help?** Check DEPLOYMENT.md for complete deployment guide!
