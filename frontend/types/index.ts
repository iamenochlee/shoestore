import { BigNumber } from "ethers";

export type StateDispatch<T> = React.Dispatch<T>;

export type Args =
  | (string | number | File | BigNumber | undefined)[]
  | undefined;

export type Preview = string | null | ArrayBuffer | undefined;

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
  step?: any;
  handleChange: StateDispatch<Partial<ShoeDetails>>;
}
export interface ImageInputProps {
  name: keyof ShoeDetails;
  value?: string | number;
  placeholder?: string;
  step?: any;
  preview: string | null | ArrayBuffer | undefined;
  setPreview: StateDispatch<string | null | ArrayBuffer | undefined>;
  handleChange: StateDispatch<Partial<ShoeDetails>>;
}

export interface NavbarProps {
  setIndex: StateDispatch<number>;
  isConnected: boolean;
  index: number;
}

export interface AddShoeProps {
  setIndex: StateDispatch<number>;
}
