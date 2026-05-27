import crypto from 'crypto';
import db from '../config/database.js';

export const getBracket = (req, res) => {
    try {
        const { game } = req.params;

        const bracket = db.prepare('SELECT bracket_data FROM brackets WHERE game = ?').get(game);

        if (!bracket) {
            return res.status(404).json({ error: 'Chaveamento não encontrado para esta modalidade.' });
        }

        const data = JSON.parse(bracket.bracket_data);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao buscar chaveamento:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar chaveamento.' });
    }
};

export const getAllBrackets = (req, res) => {
    try {
        const brackets = db.prepare('SELECT game, bracket_data FROM brackets').all();

        const result = {};
        brackets.forEach(b => {
            result[b.game] = JSON.parse(b.bracket_data);
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao buscar chaveamentos:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar chaveamentos.' });
    }
};

export const saveBracket = (req, res) => {
    try {
        const { game } = req.params;
        const bracketData = req.body;

        const existing = db.prepare('SELECT id FROM brackets WHERE game = ?').get(game);

        const bracketJson = JSON.stringify(bracketData);
        const now = new Date().toISOString();

        if (existing) {
            db.prepare('UPDATE brackets SET bracket_data = ?, updated_at = ? WHERE game = ?').run(
                bracketJson,
                now,
                game
            );
        } else {
            const id = crypto.randomUUID();
            db.prepare('INSERT INTO brackets (id, game, bracket_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(
                id,
                game,
                bracketJson,
                now,
                now
            );
        }

        return res.status(200).json({ message: 'Chaveamento salvo com sucesso.', game, data: bracketData });
    } catch (error) {
        console.error('Erro ao salvar chaveamento:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar chaveamento.' });
    }
};

export const deleteBracket = (req, res) => {
    try {
        const { game } = req.params;

        const info = db.prepare('DELETE FROM brackets WHERE game = ?').run(game);

        if (info.changes === 0) {
            return res.status(404).json({ error: 'Chaveamento não encontrado.' });
        }

        return res.status(200).json({ message: 'Chaveamento removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar chaveamento:', error);
        return res.status(500).json({ error: 'Erro interno ao deletar chaveamento.' });
    }
};
