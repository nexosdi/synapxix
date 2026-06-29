export type StoreItemType = 'avatar' | 'banner' | string;

export type StoreItemStatus = 'available' | 'owned' | 'insufficient_funds';

export interface StoreItem {
  store_item_id: string;
  name: string;
  type: StoreItemType;
  price: number;
  description: string;
  preview_url: string;
  is_active: boolean;
}

export interface StoreItemViewModel extends StoreItem {
  status: StoreItemStatus;
}