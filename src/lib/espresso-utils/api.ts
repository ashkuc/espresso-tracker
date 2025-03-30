const sanitizeUrl = (url: string) => {
  let _url = url;

  if (!_url.startsWith('http')) {
    _url = `http://${_url}`;
  }

  if (url.endsWith('/')) {
    _url = _url.slice(0, -1);
  }

  return new URL(_url).toString();
};

type TransactionsWithProof = {
  proof?: {
    ns_index: number[];
    ns_payload: string;
    ns_proof: {
      prefix_elems: string;
      suffix_elems: string;
      prefix_bytes: string[];
      suffix_bytes: string[];
    };
  };
  transactions?: {
    namespace: number;
    payload: string;
  }[];
};

export class EspressoApi {
  readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = sanitizeUrl(baseUrl);
  }

  async getStatusBlockHeight(): Promise<bigint> {
    const url = `${this.baseUrl}v0/status/block-height`;
    console.log(`Getting block height for ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to get block height with status: ${response.status}: ${response.statusText}`,
      );
    }
    const asString = await response.text();

    console.log(`asString: ${asString}`);
    return BigInt(asString);
  }

  async getTransactionsWithProof(
    block: bigint,
    namespace: number,
  ): Promise<TransactionsWithProof> {
    const response = await fetch(
      `${this.baseUrl}v0/availability/block/${block}/namespace/${namespace}`,
    );

    return response.json();
  }
}
