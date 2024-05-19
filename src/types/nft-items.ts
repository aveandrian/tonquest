export interface NftItemsInfoResponse {
  nft_items: NftItem[];
}

export interface NftItem {
  address: string;
  collection_address: string;
  owner_address: string;
  init: boolean;
  index: string;
  last_transaction_lt: string;
  code_hash: string;
  data_hash: string;
  content: {
    uri: string;
  };
  collection: Collection;
}

export interface Collection {
  address: string;
  owner_address: string;
  last_transaction_lt: string;
  next_item_index: string;
  collection_content: string;
  code_hash: string;
  data_hash: string;
}
