/// <reference types="react" />
import "./style.less";
import { IEditTableProps, IDefaultRecordType } from "./interface";
export default function Index<RT extends IDefaultRecordType>(props: IEditTableProps<RT>): JSX.Element;