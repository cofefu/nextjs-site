export interface IProduct {
  id: number;
  type: number;
  name: string;
  description: string;
  variations: IProductVariation[];
}

export interface IProductVariation {
  id: number;
  size: number;
  price: number;
}

export interface ITopping {
  id: number;
  name: string;
  price: number;
}

export interface ICoffeehouse {
  id: number;
  name: string;
  placement: string;
  open_time: string;
  close_time: string;
}
