import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const secretKey = process.env.ENCRYPTION_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = process.env.ENCRYPTION_IV || '81F5E19A629631EF';

export const encrypt = (text) => {
  if (!text) return text;
  
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
};

export const decrypt = (hash) => {
  if (!hash) return hash;
  
  try {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv));
    let decrypted = decipher.update(hash, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Erro de segurança na descriptografia do dado:', error.message);
    return null;
  }
};
