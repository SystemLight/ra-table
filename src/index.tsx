import "./style.less";

const ExportJsonExcel = require("js-export-excel");

import React, {
    useCallback, useMemo, useState,
    useRef, Key, SyntheticEvent, useContext,
    useEffect
} from "react";
import {
    Table, Button, Space, Popconfirm,
    Input, Dropdown, Menu, Checkbox, Select,
    message, Form
} from "antd";
import {SearchOutlined, FilterOutlined, PushpinOutlined} from "@ant-design/icons";
import {Resizable, ResizeCallbackData} from "react-resizable";
import Highlighter from "react-highlight-words";
import {TableRowSelection, FilterDropdownProps} from "antd/lib/table/interface";
import {TableComponents} from "rc-table/lib/interface";

import {
    IEditTableProps, IColumnType, IRecordKey,
    IResizableCellProps, IColumnsType, IFixed,
    IDefaultRecordType, IEditBodyCellProps, IEditableRowProps, IRenderFormItemProps
} from "./interface";

export const EditableContext = React.createContext<any>(null);

function ResizableHeaderCell(props: IResizableCellProps) {
    const {onResize, width, ...restProps} = props;

    if (!width) {
        return <th {...restProps}/>;
    }

    const [offset, setOffset] = useState(0);

    const handle = (
        <span
            className={`react-resizable-handle ${offset && "active"}`}
            style={{transform: `translateX(${offset}px)`}}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        />
    );

    const _onResize = (e: SyntheticEvent, {size}: ResizeCallbackData) => {
        setOffset(size.width - width);
    };

    const onResizeStop = (e: SyntheticEvent, data: ResizeCallbackData) => {
        setOffset(0);
        onResize && onResize(e, data);
    };

    return (
        <Resizable
            width={width + offset} height={0} handle={handle}
            draggableOpts={{enableUserSelectHack: false}}
            onResize={_onResize}
            onResizeStop={onResizeStop}
        >
            <th {...restProps} style={{userSelect: "none"}}/>
        </Resizable>
    );
}

function EdiBodyRow({index, ...restProps}: IEditableRowProps) {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false} name={`k${index}`}>
            <EditableContext.Provider value={form}>
                <tr {...restProps}/>
            </EditableContext.Provider>
        </Form>
    );
}

function EditBodyCell<RT>(
    {
        dataIndex, record, index, editKey,
        isEditable, onSave, renderFormItem,
        children, ...restProps
    }: IEditBodyCellProps<RT>
) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<any>(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        if (record && editKey) {
            setEditing(true);
            form.setFieldsValue({[editKey]: record[editKey]});
        } else {
            throw new Error("未提供record或editKey参数");
        }
    };

    const save = () => {
        if (editKey && index !== undefined) {
            setEditing(false);
            form.validateFields().then((editRecord: any) => {
                onSave && onSave(editKey, index, editRecord);
            });
        } else {
            throw new Error("未提供editKey或index参数");
        }
    };

    let childNode = children;
    if (isEditable) {
        childNode = editing ? (
            <Form.Item noStyle={true} name={dataIndex}>
                {renderFormItem ? React.createElement(renderFormItem, {save, ref: inputRef}) : (
                    <Input autoComplete={"off"} style={{padding: 0}} ref={inputRef} onPressEnter={save} onBlur={save}/>
                )}
            </Form.Item>
        ) : (
            <div className="cell-value-wrap" onClick={toggleEdit}>{children}</div>
        );
    }

    return (
        <td {...restProps}>{childNode}</td>
    );
}

export default function EditTable<RT extends IDefaultRecordType>(props: IEditTableProps<RT>) {
    const {
        data, columns, title, exportFileName, loading,
        hideContent, rightTitleNode, tableBody,
        onAdd, onEdit, onView, onDelete, onSave,
        onResize, onChangeHide, onChangePin
    } = props;

    let summaryNode = undefined;
    const components: TableComponents<RT> = {
        header: {
            cell: ResizableHeaderCell
        },
        body: Object.assign({
            row: EdiBodyRow,
            cell: EditBodyCell
        }, tableBody)
    };

    const searchInput = useRef<any>(null);
    const [selectedRows, setSelectedRows] = useState<Key[]>([]);
    const [searchedColumn, setSearchedColumn] = useState<string>("");
    const [searchedText, setSearchedText] = useState<string>("");
    const [displayColDropdownVisible, setDisplayColDropdownVisible] = useState<boolean>(false);
    const [pinDropdownVisible, setPinDropdownVisible] = useState<boolean>(false);

    // 增加数据
    const addRow = () => {
        onAdd && onAdd();
    };

    // 修改数据
    const editRow = (record: RT, index: number) => {
        onEdit && onEdit(record, index);
    };

    // 查看数据
    const viewRow = (record: RT, index: number) => {
        onView && onView(record, index);
    };

    // 删除数据
    const deleteRow = (record: RT, index: number) => {
        onDelete && onDelete(record, index);
    };

    // 保存单元格内容
    const saveCell = (editKey: IRecordKey<RT>, index: number, editRecord: any) => {
        onSave && onSave(editKey, index, editRecord);
    };

    // 表格行ClassName设置
    const rowClassName = (record: RT, index?: number) => {
        return index ? index % 2 === 0 ? "even" : "odd" : "even";
    };

    // 导出excel表格，deps: [data, exportFileName, selectedRows]
    const exportExcel = useCallback(() => {
        if (!data || data.length === 0) {
            message.info("没有可导出的数据");
            return;
        }
        const exportData = selectedRows.length === 0 ? data : data.filter((d) => (selectedRows.indexOf(d["key"]) !== -1));
        const sheetFilter: any[] = ["index"];
        const sheetHeader: any[] = ["行号"];
        columns.forEach((c) => {
            sheetFilter.push(c.dataIndex);
            sheetHeader.push(c.title);
        });
        new ExportJsonExcel({
            fileName: "数据" || exportFileName,
            sheetFilter: ["index", "name"],
            sheetHeader: ["行号", "姓名"],
            datas: [
                {
                    sheetData: exportData,
                    sheetName: "sheet",
                    sheetFilter: sheetFilter,
                    sheetHeader: sheetHeader
                }
            ]
        }).saveExcel();
    }, [data, exportFileName, selectedRows]);

    // 选择显示列下拉组件
    const displayColMenu = () => {
        return (
            <Menu style={{maxHeight: 300, overflowY: "auto"}}>
                {columns.map((c: IColumnType<RT>, i) => {
                    return (
                        <Menu.Item key={c.key}>
                            <Checkbox checked={!c.hide} onChange={(e) => {
                                onChangeHide && onChangeHide(i, !e.target.checked);
                            }}>{c.title}</Checkbox>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    };

    // 选择固定列下拉组件
    const pinColMenu = () => {
        return (
            <Menu style={{maxHeight: 300, overflowY: "auto"}}>
                {
                    columns.map((c, i) => {
                        return (
                            <Menu.Item key={c.key}>
                                <span style={{marginRight: 5}}>{c.title}</span>
                                <Select
                                    options={[
                                        {label: "不固定列", value: "none"},
                                        {label: "固定左边", value: "left"},
                                        {label: "固定右边", value: "right"}
                                    ]}
                                    value={typeof c.fixed === "string" ? c.fixed : "none"}
                                    onChange={(val: IFixed) => {
                                        onChangePin && onChangePin(i, val);
                                    }}
                                />
                            </Menu.Item>
                        );
                    })
                }
            </Menu>
        );
    };

    // 表格标题Node节点，deps: [title, exportExcel, displayColMenu, displayColDropdownVisible]
    const titleNode = (data: RT[]) => {
        return (
            <div className={"edit-table-title clearfix"}>
                <p style={{float: "left"}}>{title || " "}</p>
                <Space style={{float: "right"}}>
                    {rightTitleNode}
                    {hideContent?.addBtn ? "" : (
                        <Button size={"small"} type={"dashed"} onClick={addRow}>新增一行</Button>
                    )}
                    {hideContent?.exportBtn ? "" : (
                        <Button size={"small"} type={"primary"} onClick={exportExcel}>导出数据</Button>
                    )}
                    <Dropdown
                        overlayClassName={"edit-table-dropdown"}
                        overlay={displayColMenu} trigger={["click"]} visible={displayColDropdownVisible}
                        onVisibleChange={(visible) => {
                            setDisplayColDropdownVisible(visible);
                        }}>
                        <Button size={"small"} type={"link"} icon={<FilterOutlined style={{color: "#bfbfbf"}}/>}/>
                    </Dropdown>
                    <Dropdown
                        overlayClassName={"edit-table-dropdown"}
                        overlay={pinColMenu} trigger={["click"]} visible={pinDropdownVisible}
                        onVisibleChange={(visible) => {
                            setPinDropdownVisible(visible);
                        }}>
                        <Button size={"small"} type={"link"} icon={<PushpinOutlined style={{color: "#bfbfbf"}}/>}/>
                    </Dropdown>
                </Space>
            </div>
        );
    };

    // 过滤器搜索关键字，deps: []
    const handleSearch = useCallback((selectedKeys: Key[], confirm: () => void, filterKey: string) => {
        confirm();
        setSearchedText(selectedKeys[0] as string);
        setSearchedColumn(filterKey);
    }, []);

    // 过滤器清空搜索条件，deps: [searchInput.current]
    const handleReset = useCallback((clearFilters?: () => void) => {
        clearFilters && clearFilters();
        searchInput.current.setValue("");
        setSearchedText("");
    }, [searchInput.current]);

    // 获取搜索相关属性值注入到columns中，deps: [handleReset, searchedColumn, searchedText]
    const getColumnSearchProps = useCallback((filterKey?: IRecordKey<RT>): IColumnType<RT> => {
        if (filterKey) {
            return {
                filterIcon: (filtered: boolean) => {
                    return (
                        <SearchOutlined style={{marginRight: 25, color: filtered ? "#1890ff" : undefined}}/>
                    );
                },
                filterDropdown({setSelectedKeys, selectedKeys, confirm, clearFilters}: FilterDropdownProps) {
                    return (
                        <div style={{padding: 8}}>
                            <Input
                                ref={(node) => searchInput.current = node}
                                style={{width: 188, marginBottom: 8, display: "block"}}
                                placeholder={"输入关键字"}
                                onPressEnter={() => handleSearch(selectedKeys, confirm, filterKey.toString())}
                                onChange={(e) =>
                                    setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined/>}
                                    size="small"
                                    style={{width: 90}}
                                    onClick={() => handleSearch(selectedKeys, confirm, filterKey.toString())}
                                >查找</Button>
                                <Button
                                    size="small"
                                    style={{width: 90}}
                                    onClick={() => handleReset(clearFilters)}
                                >重置</Button>
                            </Space>
                        </div>
                    );
                },
                onFilter: (value, record) => {
                    return record[filterKey] ? record[filterKey]
                        .toString().toLowerCase().includes(value.toString().toLowerCase()) : false;
                },
                render(text) {
                    return (
                        searchedColumn === filterKey ? (
                            <Highlighter
                                highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                                searchWords={[searchedText]}
                                autoEscape
                                textToHighlight={text ? text.toString() : ""}
                            />
                        ) : text
                    );
                }
            };
        }
        return {};
    }, [handleReset, searchedColumn, searchedText]);

    // 计算列属性，deps: [columns, getColumnSearchProps]
    const expandColumns = useMemo<IColumnsType<RT>>(() => {
        let eColumns: IColumnsType<RT>;

        // 处理特殊设置属性
        eColumns = columns.map((col: IColumnType<RT>, idx) => {
            if (col.sortKey) {
                col.sortDirections = ["descend", "ascend"];
                col.sorter = (a, b) => {
                    const A = a[(col.sortKey as IRecordKey<RT>)];
                    const B = b[(col.sortKey as IRecordKey<RT>)];
                    if (A < B) {
                        return -1;
                    } else if (A > B) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
            }
            if (col.width) {
                col.onHeaderCell = (column: IColumnType<RT>): IResizableCellProps => {
                    let w = 0;
                    if (typeof column.width === "number") {
                        w = column.width;
                    }
                    return {
                        width: w,
                        onResize: (e, resizeData) => {
                            onResize && onResize(e, resizeData, idx);
                        }
                    };
                };
            }
            if (col.isEditable) {
                col.onCell = (record: RT, index?: number): IEditBodyCellProps<RT> => {
                    return {
                        isEditable: true,
                        editKey: col.editKey,
                        record: record,
                        index: index,
                        dataIndex: col.dataIndex,
                        renderFormItem: col.renderFormItem,
                        onSave: saveCell
                    };
                };
            }
            return {
                ...col,
                ...getColumnSearchProps(col.filterKey)
            };
        });

        // 获得所有非隐藏的内容列
        eColumns = eColumns.filter((col: IColumnType<RT>) => !col.hide);

        // 增加一列行号
        eColumns.unshift({
            key: "lineNum",
            title: "行号",
            width: "46px",
            fixed: "left",
            render(valuetext: any, record, index) {
                const i = index + 1;
                data[index].index = i;
                return (<b>{i}</b>);
            }
        });

        // 增加可操作列
        eColumns.push({
            key: "options",
            title: "操作",
            width: 54 * (3 -
                Number(Boolean(hideContent?.viewBtn)) -
                Number(Boolean(hideContent?.editBtn)) -
                Number(Boolean(hideContent?.deleteBtn))
            ),
            fixed: "right",
            render(valuetext: any, record, index) {
                return (
                    <Space direction={"horizontal"} size={"small"}>
                        {hideContent?.viewBtn ? "" : (
                            <Button size={"small"} type={"dashed"} onClick={() => viewRow(record, index)}>查看</Button>
                        )}
                        {hideContent?.editBtn ? "" : (
                            <Button size={"small"} type={"link"} onClick={() => editRow(record, index)}>编辑</Button>
                        )}
                        {hideContent?.deleteBtn ? "" : (
                            <Popconfirm title={"确定删除当前行？"} onConfirm={() => deleteRow(record, index)}>
                                <Button size={"small"} type={"link"} danger={true}>删除</Button>
                            </Popconfirm>
                        )}
                    </Space>
                );
            }
        });

        return eColumns;
    }, [data, columns, getColumnSearchProps]);

    // 选中行操作属性配置对象，deps: [selectedRows]
    const rowSelection: TableRowSelection<RT> = useMemo(() => (
        {
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT
            ],
            columnWidth: "35px",
            fixed: true,
            selectedRowKeys: selectedRows,
            onChange: (selectedRowKeys, selectedRows) => setSelectedRows(selectedRowKeys)
        }
    ), [selectedRows]);

    // 汇总合计节点
    summaryNode = (pageData: RT[]) => {
        const total: number[] = [];
        let haveTotal = false;

        columns.forEach((c, i) => {
            let result = 0;
            if (c.totalKey) {
                haveTotal = true;
                pageData.forEach((data) => {
                    // @ts-ignore
                    result += data[c.totalKey];
                });
            }
            total.push(result);
        });

        if (!haveTotal) {
            return (<></>);
        }

        return (
            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>合计：</Table.Summary.Cell>
                {columns.filter((c) => !c.hide).map((c, i) => {
                    return (
                        <Table.Summary.Cell key={i} index={i + 1} colSpan={1}>
                            {c.totalKey ? total[i] : ""}
                        </Table.Summary.Cell>
                    );
                })}
                <Table.Summary.Cell index={0} colSpan={1}/>
            </Table.Summary.Row>
        );
    };

    const onRow = (data: RT, index?: number): IEditableRowProps => {
        return {
            index: index
        };
    };

    return (
        <div className={"edit-table-wrap"}>
            <Table
                className={"edit-table"} rowClassName={rowClassName}
                columns={expandColumns} dataSource={data} title={titleNode} components={components}
                size={"small"} bordered={true} pagination={false} scroll={{x: "max-content"}}
                rowSelection={rowSelection} loading={loading} summary={summaryNode} onRow={onRow}
            />
        </div>
    );
}
