import { DetailedHTMLProps, SyntheticEvent, ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes, ReactNode, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "react";
import { ColumnType } from "antd/es/table";
import { CustomizeComponent, CustomizeScrollBody, DataIndex, DefaultRecordType } from "rc-table/lib/interface";
import { ResizeCallbackData } from "react-resizable";
export interface IDefaultRecordType extends DefaultRecordType {
    key: string;
    index?: number;
}
export declare type IData<RT> = RT[];
export declare type IDefaultRecordKeys = Exclude<keyof IDefaultRecordType, number | string>;
export declare type IRecordKey<RT> = Exclude<keyof RT, IDefaultRecordKeys>;
export interface IColumnType<RT> extends ColumnType<RT> {
    filterKey?: IRecordKey<RT>;
    sortKey?: IRecordKey<RT>;
    totalKey?: IRecordKey<RT>;
    editKey?: IRecordKey<RT>;
    isEditable?: boolean;
    renderFormItem?: IRenderFormItem;
    hide?: boolean;
}
export declare type IColumnsType<RT> = IColumnType<RT>[];
export declare type ITableHeadProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
export declare type ITableBodyRowProps = DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
export declare type ITableBodyProps = DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
export interface IResizableCellProps extends ITableHeadProps {
    width?: number;
    onResize?: (e: SyntheticEvent, data: ResizeCallbackData) => void;
}
export interface IEditableRowProps extends ITableBodyRowProps {
    index?: number;
}
export declare type IRenderFormItem = ForwardRefExoticComponent<PropsWithoutRef<IRenderFormItemProps> & RefAttributes<IRenderFormItemRef>>;
export interface IRenderFormItemProps<T = any> {
    save: () => void;
    id?: string;
    value?: T;
    onChange?: (v: T) => {};
}
export interface IRenderFormItemRef {
    focus: () => void;
}
export interface IEditBodyCellProps<RT> extends ITableBodyProps {
    children?: ReactNode;
    editKey?: IRecordKey<RT>;
    isEditable?: boolean;
    renderFormItem?: IRenderFormItem;
    record?: RT;
    dataIndex?: DataIndex;
    index?: number;
    onSave?: IOnSaveData<RT>;
}
export declare type IFixed = "left" | "right" | "none";
export interface IOnAddData {
    (): void;
}
export interface IOnEditData<RT> {
    (record: RT, index: number): void;
}
export interface IOnViewData<RT> {
    (record: RT, index: number): void;
}
export interface IOnDeleteData<RT> {
    (record: RT, index: number): void;
}
export interface IOnSaveData<RT> {
    (editKey: IRecordKey<RT>, index: number, editRecord: any): void;
}
export interface IOnResize {
    (e: SyntheticEvent, resizeData: ResizeCallbackData, index: number): void;
}
export interface IOnChangeHide {
    (idx: number, status: boolean): void;
}
export interface IOnChangePin {
    (idx: number, val: IFixed): void;
}
export interface IHideContent {
    addBtn?: boolean;
    editBtn?: boolean;
    deleteBtn?: boolean;
    viewBtn?: boolean;
    exportBtn?: boolean;
}
export declare type ITableBody<RT> = CustomizeScrollBody<RT> | {
    wrapper?: CustomizeComponent;
    row?: CustomizeComponent;
    cell?: CustomizeComponent;
};
export interface IEditTableProps<RT> {
    columns: IColumnsType<RT>;
    data: IData<RT>;
    title?: string;
    rightTitleNode?: ReactNode;
    loading?: boolean;
    exportFileName?: string;
    hideContent?: IHideContent;
    tableBody?: ITableBody<RT>;
    onAdd?: IOnAddData;
    onEdit?: IOnEditData<RT>;
    onView?: IOnViewData<RT>;
    onDelete?: IOnDeleteData<RT>;
    onSave?: IOnSaveData<RT>;
    onResize?: IOnResize;
    onChangeHide?: IOnChangeHide;
    onChangePin?: IOnChangePin;
}
