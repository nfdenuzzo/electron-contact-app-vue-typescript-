import crypto from 'crypto';
const algorithm = 'aes-256-ctr';

//Here "aes-256-cbc" is the advance encryption standard we are using for encryption.
//Text is the Confidential data which we need to encrypt using 'password'(Key).

export function encrypt(text, password) {
  const cipher = crypto.createCipher(algorithm, password);
  let cryptedData = cipher.update(text, 'utf8', 'hex');
  cryptedData += cipher.final('hex');
  return cryptedData;
}

export function decrypt(text, password) {
  const decipher = crypto.createDecipher(algorithm, password);
  let decryptedData = decipher.update(text, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

