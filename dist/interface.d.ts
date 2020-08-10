import { DefaultRecordType } from "rc-table/lib/interface";
import { ColumnType } from "antd/es/table";
import { DetailedHTMLProps, SyntheticEvent, ThHTMLAttributes } from "react";
import { ResizeCallbackData } from "react-resizable";
export interface IDefaultRecordType extends DefaultRecordType {
    index?: number;
}
export declare type IData<RT> = RT[];
export declare type IRecordKey<RT> = Exclude<keyof RT, "index">;
export interface IColumnType<RT> extends ColumnType<RT> {
    filterKey?: IRecordKey<RT>;
    sortKey?: IRecordKey<RT>;
    totalKey?: IRecordKey<RT>;
    hide?: boolean;
}
export declare type IColumnsType<RT> = IColumnType<RT>[];
export declare type ITableHeadProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
export interface IResizableCell extends ITableHeadProps {
    width: number;
    onResize: (e: SyntheticEvent, data: ResizeCallbackData) => void;
}
export declare type IFixed = "left" | "right" | "none";
export interface IOnAddData {
    (): void;
}
export interface IOnEditData {
    (): void;
}
export interface IOnViewData {
    (): void;
}
export interface IOnDeleteData {
    (): void;
}
export interface IEditTableProps<RT> {
    columns: IColumnsType<RT>;
    data: IData<RT>;
    title?: string;
    exportFileName?: string;
    onAdd?: IOnAddData;
    onEdit?: IOnEditData;
    onView?: IOnViewData;
    onDelete?: IOnDeleteData;
    onResize?: (e: SyntheticEvent, data: ResizeCallbackData, index: number) => void;
    onChangeHide?: (idx: number, status: boolean) => void;
    onChangePin?: (idx: number, val: IFixed) => void;
    loading?: boolean;
}
