import express from 'express';
import cors from 'cors';
import participantRoutes from './src/routes/participantRoutes.js';
import flowRoutes from './src/routes/flowRoutes.js';
import bracketRoutes from './src/routes/bracketRoutes.js';

const app = express();

// ===== CORS Configuration for production deployment =====
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL || 'https://unisesports.com.br'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ===== Health check endpoint =====
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== Admin Authentication endpoint =====
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'unis2026';

    if (username === adminUser && password === adminPass) {
        return res.status(200).json({ success: true, message: 'Autenticado com sucesso.' });
    }

    return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos.' });
});

// ===== API Routes =====
app.use('/api/participants', participantRoutes);
app.use('/api/flow', flowRoutes);
app.use('/api/brackets', bracketRoutes);

// ===== 404 Handler =====
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`Servidor rodando em ${NODE_ENV} na porta ${PORT}`);
    console.log(`Frontend esperado: ${process.env.FRONTEND_URL || 'https://unisesports.com.br'}`);
});
