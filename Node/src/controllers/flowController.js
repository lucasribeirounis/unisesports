import crypto from 'crypto';
import db from '../config/database.js';

export const updateFlowStatus = (req, res) => {
    try {
        const { participant_id } = req.params;
        const { status, location } = req.body;
        const updated_at = new Date().toISOString();

        const existing = db.prepare('SELECT id FROM event_flow WHERE participant_id = ?').get(participant_id);

        if (existing) {
            db.prepare(`
                UPDATE event_flow 
                SET status = ?, location = ?, updated_at = ? 
                WHERE participant_id = ?
            `).run(status, location, updated_at, participant_id);
        } else {
            const id = crypto.randomUUID();
            db.prepare(`
                INSERT INTO event_flow (id, participant_id, status, location, updated_at) 
                VALUES (?, ?, ?, ?, ?)
            `).run(id, participant_id, status, location, updated_at);
        }

        return res.status(200).json({ message: 'Status de fluxo atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar status de fluxo:', error);
        return res.status(500).json({ error: 'Erro interno ao atualizar status' });
    }
};

export const getFlowStatus = (req, res) => {
    try {

        const rows = db.prepare(`
            SELECT p.id, p.nick, f.status, f.location, f.updated_at
            FROM participants p
            JOIN event_flow f ON p.id = f.participant_id
        `).all();

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar status de fluxo:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar status de fluxo' });
    }
};
