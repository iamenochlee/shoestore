import { BigNumber } from "ethers";

export type StateDispatch<T> = React.Dispatch<T>;

export type Args =
  | (string | number | File | BigNumber | undefined)[]
  | undefined;

export type Preview = string | null | ArrayBuffer | undefined;
export type TXType = "bought" | "sold" | "create";
export interface Shoe {
  id: BigNumber;
  name: string;
  brand: string;
  owner: string;
  size: BigNumber;
  price: BigNumber;
  isListed: boolean;
  image: string;
}
export interface UserHistory {
  id: BigNumber;
  name: string;
  brand: string;
  price: BigNumber;
  with: string;
  txType: TXType;
  time: BigNumber;
}

export interface ShoeDetails {
  name: string;
  brand: string;
  size: number;
  price: number | BigNumber;
  image: File | undefined;
}

export interface InputProps {
  name: keyof ShoeDetails;
  value?: string | number;
  type?: string;
  min?: number;
  placeholder?: string;
  step?: string;
  handleChange: StateDispatch<Partial<ShoeDetails>>;
}
export interface ImageInputProps {
  name: keyof ShoeDetails;
  value?: string | number;
  placeholder?: string;
  step?: string;
  preview: string | null | ArrayBuffer | undefined;
  setPreview: StateDispatch<string | null | ArrayBuffer | undefined>;
  handleChange: StateDispatch<Partial<ShoeDetails>>;
}

export interface NavbarProps {
  setIndex: StateDispatch<number>;
  index: number;
}

export interface AddShoeProps {
  setIndex: StateDispatch<number>;
}

export interface ListedShoeProps {
  shoe: Shoe;
  refetch: () => void;
}

export interface ModalProps {
  newPrice: string;
  setNewPrice: StateDispatch<string>;
  toggleModal: () => void;
  shoe: Shoe;
  isActive: boolean;
  refetch: () => void;
}

export interface UserShoeProps {
  shoe: Shoe;
  refetch: () => void;
}
