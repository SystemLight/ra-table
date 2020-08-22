import "./style.less";
import React from "react";
import { IEditTableProps, IDefaultRecordType } from "./interface";
export declare const EditableContext: React.Context<any>;
export default function EditTable<RT extends IDefaultRecordType>(props: IEditTableProps<RT>): JSX.Element;
