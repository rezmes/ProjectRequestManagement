import { IDropdownOption } from "office-ui-fabric-react";

export interface IResourceRow {
  item: IDropdownOption;
  quantity: number;
  pricePerUnit: number;
}

export interface IResourceRowProps {
  row   : IResourceRow;
  total : number;
  onQty : (v:string) => void;
  onPrice : (v:string) => void;
  onRemove: () => void;
  onItem: (opt?: IDropdownOption) => void;
}
