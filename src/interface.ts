import {
    DetailedHTMLProps, SyntheticEvent, ThHTMLAttributes, TdHTMLAttributes,
    HTMLAttributes, ReactNode, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes
} from "react";
import {ColumnType} from "antd/es/table";
import {CustomizeComponent, CustomizeScrollBody, DataIndex, DefaultRecordType} from "rc-table/lib/interface";
import {ResizeCallbackData} from "react-resizable";

// 默认单条数据格式类型，包含必须的数据键值
export interface IDefaultRecordType extends DefaultRecordType {
    key: string,
    index?: number
}

// 数据集合类型
export type IData<RT> = RT[];

// 默认数据键值集合
export type IDefaultRecordKeys = Exclude<keyof IDefaultRecordType, number | string>

// 单条数据记录key值集合接口，排除index
export type IRecordKey<RT> = Exclude<keyof RT, IDefaultRecordKeys>;

// 单列属性拓展接口
export interface IColumnType<RT> extends ColumnType<RT> {
    filterKey?: IRecordKey<RT>,
    sortKey?: IRecordKey<RT>,
    totalKey?: IRecordKey<RT>,
    editKey?: IRecordKey<RT>,
    isEditable?: boolean,
    renderFormItem?: IRenderFormItem,
    hide?: boolean,
}

// 所有列类型
export type IColumnsType<RT> = IColumnType<RT>[];

// 可伸缩列props类型，原生th接收
export type ITableHeadProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;

// table body行组件props
export type ITableBodyRowProps = DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

// 可编辑格props类型，原生td接收
export type ITableBodyProps = DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;

// 可伸缩列props类型，拓展属性
export interface IResizableCellProps extends ITableHeadProps {
    width?: number,
    onResize?: (e: SyntheticEvent, data: ResizeCallbackData) => void,
}

// 可编辑格行props类型，拓展属性
export interface IEditableRowProps extends ITableBodyRowProps {
    index?: number
}

// 渲染item方法，和isEditable，editKey配合使用，定制渲染表格编辑项
export type IRenderFormItem = ForwardRefExoticComponent<PropsWithoutRef<IRenderFormItemProps> & RefAttributes<IRenderFormItemRef>>

// 渲染item方法的ref方法
export interface IRenderFormItemProps<T = any> {
    save: () => void,
    id?: string,
    value?: T,
    onChange?: (v: T) => {}
}

// 渲染item方法的ref方法
export interface IRenderFormItemRef {
    focus: () => void
}

// 可编辑格props类型，拓展属性
export interface IEditBodyCellProps<RT> extends ITableBodyProps {
    children?: ReactNode,
    editKey?: IRecordKey<RT>,
    isEditable?: boolean,
    renderFormItem?: IRenderFormItem
    record?: RT,
    dataIndex?: DataIndex
    index?: number,
    onSave?: IOnSaveData<RT>
}

// 固定列选择事件触发返回参数
export type IFixed = "left" | "right" | "none";

// 添加数据事件类型函数
export interface IOnAddData {
    (): void
}

// 编辑数据事件类型函数
export interface IOnEditData<RT> {
    (record: RT, index: number): void
}

// 查看数据事件类型函数
export interface IOnViewData<RT> {
    (record: RT, index: number): void
}

// 删除数据事件类型函数
export interface IOnDeleteData<RT> {
    (record: RT, index: number): void
}

// 删除数据事件类型函数
export interface IOnSaveData<RT> {
    (editKey: IRecordKey<RT>, index: number, editRecord: any): void
}

// 改变列大小事件
export interface IOnResize {
    (e: SyntheticEvent, resizeData: ResizeCallbackData, index: number): void
}

// 显示或隐藏列事件
export interface IOnChangeHide {
    (idx: number, status: boolean): void
}

// 固定列事件
export interface IOnChangePin {
    (idx: number, val: IFixed): void
}

// 表格组件中，可隐藏内容
export interface IHideContent {
    addBtn?: boolean,
    editBtn?: boolean,
    deleteBtn?: boolean,
    viewBtn?: boolean,
    exportBtn?: boolean,
}

// 自定义body渲染组件
export type ITableBody<RT> = CustomizeScrollBody<RT> | {
    wrapper?: CustomizeComponent,
    row?: CustomizeComponent,
    cell?: CustomizeComponent
}

// EditTable props类型
export interface IEditTableProps<RT> {
    columns: IColumnsType<RT>,
    data: IData<RT>,
    title?: string,
    rightTitleNode?: ReactNode,
    loading?: boolean,
    exportFileName?: string,
    hideContent?: IHideContent,
    tableBody?: ITableBody<RT>,
    onAdd?: IOnAddData,
    onEdit?: IOnEditData<RT>,
    onView?: IOnViewData<RT>,
    onDelete?: IOnDeleteData<RT>,
    onSave?: IOnSaveData<RT>,
    onResize?: IOnResize,
    onChangeHide?: IOnChangeHide,
    onChangePin?: IOnChangePin,
}
