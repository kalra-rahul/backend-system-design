const crypto = require('crypto');


exports.encrypt = (text) => {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32-byte key
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

exports.decrypt = (text) => {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32-byte key
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};