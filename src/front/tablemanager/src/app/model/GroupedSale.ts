import { Sales } from "./Sales";

export interface GroupedSale {
    day?: string;
    month?:string;
    year?: string;
    sales: Sales[];
  }