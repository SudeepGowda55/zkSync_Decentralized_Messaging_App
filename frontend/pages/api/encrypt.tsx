import type { NextApiRequest, NextApiResponse } from 'next'
import { createCipheriv, createHash, publicEncrypt } from 'crypto';
import HDNode  from 'bip32';

const MESSAGE_APP_PATH = "m/1'";

function generateRootKey(seed: string): typeof HDNode  {
  const hash = createHash('sha256').update(seed).digest();
  return HDNode.fromSeedBuffer(hash);
}

function deriveChildKey(rootKey: typeof HDNode, identifier: string): typeof HDNode {
  const path = MESSAGE_APP_PATH + '/' + identifier;
  return rootKey.derivePath(path);
}

function generateEncryptionKey(rootKey: typeof HDNode, identifier: string, nonce: number): Buffer {
  const childKey = deriveChildKey(rootKey, identifier + nonce.toString());
  return childKey.privateKey;
}

function encryptMessage(message: string, encryptionKey: Buffer, alicePublicKey: Buffer): Buffer {
  const iv = createHash('sha256').update(encryptionKey).digest().slice(0, 16);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey, iv);
  const encryptedMessage = Buffer.concat([cipher.update(message, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const encryptedKey = publicEncrypt(alicePublicKey, encryptionKey);
  return Buffer.concat([encryptedKey, iv, tag, encryptedMessage]);
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const userpasswd = sessionStorage.getItem("key");

  if (userpasswd != null) {

    const rootKey = generateRootKey(userpasswd);

    const alicePublicKey = Buffer.from('0xdsgdgcsggsag');

    const identifier = "osfsfscft";

    const message = "hai";

    const nonce = 123456777;

    const encryptionKey = generateEncryptionKey(rootKey, identifier, nonce);

    const encryptedMessage = encryptMessage(message, encryptionKey, alicePublicKey);

    console.log(`Encrypted message: ${encryptedMessage.toString('hex')}`);
  }
  res.status(200).send("good")
}