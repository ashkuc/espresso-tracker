import {ethers} from 'ethers';
import * as rlp from 'rlp';

export const base64ToUint8Array = (base64: string) => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64');
  } else {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  }
}


const logger = console;


export const decodeEspressoTransaction = async (
  base64EncodedPayload: string,
): Promise<ethers.Transaction[]> => {
  const transactions: ethers.Transaction[] = [];

  const raw = base64ToUint8Array(base64EncodedPayload);
  logger.log('Raw payload length:', raw.length);
  logger.log('Full payload hex:', raw.toString('hex'));

  const rlpStart = raw.findIndex(
    (byte, i) => (byte >= 0xc0 || byte >= 0xf8) && i > 16,
  );

  if (rlpStart === -1) {
    logger.log('RLP section not found in payload');
    return transactions;
  }

  const rlpData = raw.subarray(rlpStart);
  logger.log('RLP start offset:', rlpStart);
  logger.log('RLP data (hex):', rlpData.toString('hex'));

  let decoded;
  try {
    decoded = rlp.decode(rlpData);
  } catch (error: any) {
    logger.log('RLP decode failed:', error);

    return transactions;
  }

  if (!Array.isArray(decoded)) {
    logger.log('Unexpected RLP format:', decoded);

    return transactions;
  }

  logger.log('Top-level RLP array length:', decoded.length);

  decoded.forEach((item, i) => {
    try {
      logger.log(`\n--- TX ITEM ${i} ---`);

      if (Buffer.isBuffer(item)) {
        logger.log(
          'Skipping raw buffer item (not a tx):',
          item.toString('hex'),
        );
        return;
      }

      if (!Array.isArray(item) || item.length < 2) {
        logger.log(`TX[${i}]: Unexpected structure`, item);
        return;
      }

      const [, l2Envelope] = item;
      let txBytes = l2Envelope as Buffer;
      if (!txBytes) {
        logger.log('Unexpected tx bytes:', item);
        return;
      }

      if (![0x02, 0x01, 0xf8].includes(txBytes[0]!) && txBytes.length > 1) {
        logger.log(
          `TX[${i}]: Stripping prefix byte 0x${txBytes[0]!.toString(16)}`,
        );
        txBytes = txBytes.slice(1);
      }

      const parsed = ethers.utils.parseTransaction(`0x${txBytes.toString('hex')}`);

      transactions.push(parsed);
    } catch (error: any) {
      logger.log(`Failed to decode TX[${i}]`, error);
    }
  });

  return transactions;
};
