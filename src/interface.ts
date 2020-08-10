import {DefaultRecordType} from "rc-table/lib/interface";
import {ColumnType} from "antd/es/table";
import {DetailedHTMLProps, SyntheticEvent, ThHTMLAttributes} from "react";
import {ResizeCallbackData} from "react-resizable";

// 可编辑表格类型声明
export interface IDefaultRecordType extends DefaultRecordType {
    index?: number
}

// 所有数据类型
export type IData<RT> = RT[];

// 单条数据记录key值集合接口
export type IRecordKey<RT> = Exclude<keyof RT, "index">;

// 单列属性拓展接口
export interface IColumnType<RT> extends ColumnType<RT> {
    filterKey?: IRecordKey<RT>,
    sortKey?: IRecordKey<RT>,
    totalKey?: IRecordKey<RT>,
    hide?: boolean
}

// 所有列类型
export type IColumnsType<RT> = IColumnType<RT>[];

// 可伸缩列props类型，原生th接收
export type ITableHeadProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;

// 可伸缩列props类型，拓展属性
export interface IResizableCell extends ITableHeadProps {
    width: number,
    onResize: (e: SyntheticEvent, data: ResizeCallbackData) => void;
}

// 固定列选择事件触发返回参数
export type IFixed = "left" | "right" | "none";

// 添加数据事件类型函数
export interface IOnAddData {
    (): void
}

// 编辑数据事件类型函数
export interface IOnEditData {
    (): void
}

// 查看数据事件类型函数
export interface IOnViewData {
    (): void
}

// 删除数据事件类型函数
export interface IOnDeleteData {
    (): void
}

// EditTable props类型
export interface IEditTableProps<RT> {
    columns: IColumnsType<RT>,
    data: IData<RT>,
    title?: string,
    exportFileName?: string
    onAdd?: IOnAddData,
    onEdit?: IOnEditData,
    onView?: IOnViewData,
    onDelete?: IOnDeleteData,
    onResize?: (e: SyntheticEvent, data: ResizeCallbackData, index: number) => void;
    onChangeHide?: (idx: number, status: boolean) => void
    onChangePin?: (idx: number, val: IFixed) => void
    loading?: boolean
}
