import crypto from 'crypto';
import db from '../config/database.js';
import { encrypt } from '../utils/security.js';

export const createParticipant = (req, res) => {
    try {
        const {
            name, school, grade, age, email, nick, game, type,
            team_name, members, guardian, guardian_phone
        } = req.body;

        const id = crypto.randomUUID();
        const encryptedEmail = encrypt(email);
        const encryptedPhone = encrypt(guardian_phone);
        const created_at = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO participants (
                id, name, school, grade, age, email, nick, game, type, 
                team_name, members, guardian, guardian_phone, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id, name, school, grade, age, encryptedEmail, nick, game, type,
            team_name, members, guardian, encryptedPhone, created_at
        );

        return res.status(201).json({ id });
    } catch (error) {
        console.error('Erro ao criar participante:', error);
        return res.status(500).json({ error: 'Erro interno ao criar participante.' });
    }
};

export const getPublicParticipants = (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT id, nick, game, team_name, school, type
            FROM participants
        `);
        const participants = stmt.all();
        
        return res.status(200).json(participants);
    } catch (error) {
        console.error('Erro ao buscar participantes:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar participantes.' });
    }
};

export const deleteParticipant = (req, res) => {
    try {
        const { id } = req.params;

        const info = db.prepare('DELETE FROM participants WHERE id = ?').run(id);

        if (info.changes === 0) {
            return res.status(404).json({ error: 'Participante não encontrado.' });
        }

        return res.status(200).json({ message: 'Participante removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar participante:', error);
        return res.status(500).json({ error: 'Erro interno ao deletar participante.' });
    }
};
