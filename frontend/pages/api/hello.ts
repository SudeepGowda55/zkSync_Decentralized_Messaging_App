// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as argon2 from "argon2";


function toHexString(bytes: Uint8Array): string {
  return Array.prototype.map
    .call(bytes, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

async function generateKeyFromPassword(password: string, salt: string): Promise<string> {
  const passwordBuffer = Buffer.from(password);
  const saltBuffer = Buffer.from(salt, "base64");
  const options = {
    timeCost: 4, 
    memoryCost: 2 ** 16, 
    parallelism: 2,
    hashLength: 32, 
    type: argon2.argon2id, 
  };
  const hashBuffer = await argon2.hash(passwordBuffer, { salt: saltBuffer, ...options, raw: true });
  const derivedKey = toHexString(hashBuffer);
  const specialChars = "@#$!%^&*()_+-=[]{};:'\"<>,.?/\\";
  const numSpecialChars = 4;
  let specialCharIndex = 0;
  let specialCharsAdded = 0;
  let derivedKeyWithSpecialChars = "";
  for (const element of derivedKey) {
    derivedKeyWithSpecialChars += element;
    if (specialCharIndex < specialChars.length && specialCharsAdded < numSpecialChars) {
      derivedKeyWithSpecialChars += specialChars[specialCharIndex];
      specialCharIndex++;
      specialCharsAdded++;
    }
  }
  return derivedKeyWithSpecialChars;
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<string> ) {
  const derivedKey = await generateKeyFromPassword(req.body.keys.passwd, req.body.keys.salt);
  res.status(200).send(derivedKey)
}
