"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
require("./style.less");
var ExportJsonExcel = require("js-export-excel");
var react_1 = require("react");
var antd_1 = require("antd");
var icons_1 = require("@ant-design/icons");
var react_resizable_1 = require("react-resizable");
var react_highlight_words_1 = require("react-highlight-words");
function ResizableCell(props) {
    var onResize = props.onResize, width = props.width, restProps = __rest(props, ["onResize", "width"]);
    if (!width) {
        return <th {...restProps}/>;
    }
    var _a = react_1.useState(0), offset = _a[0], setOffset = _a[1];
    return (<react_resizable_1.Resizable width={width + offset} height={0} handle={(<span className={"react-resizable-handle " + (offset && "active")} style={{ transform: "translateX(" + offset + "px)" }} onClick={function (e) {
        e.stopPropagation();
        e.preventDefault();
    }}/>)} draggableOpts={{ enableUserSelectHack: false }} onResize={function (e, _a) {
        var size = _a.size;
        setOffset(size.width - width);
    }} onResizeStop={function (e, data) {
        setOffset(0);
        onResize(e, data);
    }}>
            <th {...restProps} style={{ userSelect: "none" }}/>
        </react_resizable_1.Resizable>);
}
function EditTable(props) {
    var data = props.data, title = props.title, exportFileName = props.exportFileName, loading = props.loading, onAdd = props.onAdd, onEdit = props.onEdit, onView = props.onView, onDelete = props.onDelete, onResize = props.onResize, onChangeHide = props.onChangeHide, onChangePin = props.onChangePin;
    var columns = props.columns;
    var etColumns;
    var summaryNode = undefined;
    var searchInput = react_1.useRef(null);
    var _a = react_1.useState([]), selectedRows = _a[0], setSelectedRows = _a[1];
    var _b = react_1.useState(""), searchedColumn = _b[0], setSearchedColumn = _b[1];
    var _c = react_1.useState(""), searchedText = _c[0], setSearchedText = _c[1];
    var _d = react_1.useState(false), displayColDropdownVisible = _d[0], setDisplayColDropdownVisible = _d[1];
    var _e = react_1.useState(false), pinDropdownVisible = _e[0], setPinDropdownVisible = _e[1];
    var addRow = function () {
        onAdd && onAdd();
    };
    var editRow = function (record, index) {
        onEdit && onEdit();
    };
    var viewRow = function (record, index) {
        onView && onView();
    };
    var deleteRow = function (record, index) {
        onDelete && onDelete();
    };
    var components = {
        header: {
            cell: ResizableCell
        }
    };
    // 表格行ClassName设置
    var rowClassName = function (record, index) {
        return index ? index % 2 === 0 ? "even" : "odd" : "even";
    };
    // 导出excel表格，deps: [exportFileName, selectedRows]
    var exportExcel = react_1.useCallback(function () {
        if (!data || data.length === 0) {
            antd_1.message.info("没有可导出的数据");
            return;
        }
        var exportData = selectedRows.length === 0 ? data : data.filter(function (d) { return (selectedRows.indexOf(d["key"]) !== -1); });
        var sheetFilter = ["index"];
        var sheetHeader = ["行号"];
        columns.forEach(function (c) {
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
    }, [exportFileName, selectedRows]);
    // 选择显示列下拉组件
    var displayColMenu = function () {
        return (<antd_1.Menu style={{ maxHeight: 300, overflowY: "auto" }}>
                {columns.map(function (c, i) {
            return (<antd_1.Menu.Item key={c.key}>
                            <antd_1.Checkbox checked={!c.hide} onChange={function (e) {
                onChangeHide && onChangeHide(i, !e.target.checked);
            }}>{c.title}</antd_1.Checkbox>
                        </antd_1.Menu.Item>);
        })}
            </antd_1.Menu>);
    };
    // 选择固定列下拉组件
    var pinColMenu = function () {
        return (<antd_1.Menu style={{ maxHeight: 300, overflowY: "auto" }}>
                {columns.map(function (c, i) {
            return (<antd_1.Menu.Item key={c.key}>
                                <span style={{ marginRight: 5 }}>{c.title}</span>
                                <antd_1.Select options={[
                { label: "不固定列", value: "none" },
                { label: "固定左边", value: "left" },
                { label: "固定右边", value: "right" }
            ]} value={typeof c.fixed === "string" ? c.fixed : "none"} onChange={function (val) {
                onChangePin && onChangePin(i, val);
            }}/>
                            </antd_1.Menu.Item>);
        })}
            </antd_1.Menu>);
    };
    // 表格标题Node节点，deps: [title, exportExcel, displayColMenu, displayColDropdownVisible]
    var titleNode = function (data) {
        return (<div className={"edit-table-title clearfix"}>
                <p style={{ float: "left" }}>{title || " "}</p>
                <antd_1.Space style={{ float: "right" }}>
                    <antd_1.Button size={"small"} type={"dashed"} onClick={addRow}>新增一行</antd_1.Button>
                    <antd_1.Button size={"small"} type={"primary"} onClick={exportExcel}>导出数据</antd_1.Button>
                    <antd_1.Dropdown overlayClassName={"edit-table-dropdown"} overlay={displayColMenu} trigger={["click"]} visible={displayColDropdownVisible} onVisibleChange={function (visible) {
            setDisplayColDropdownVisible(visible);
        }}>
                        <antd_1.Button size={"small"} type={"link"}><icons_1.FilterOutlined style={{ color: "#bfbfbf" }}/></antd_1.Button>
                    </antd_1.Dropdown>
                    <antd_1.Dropdown overlayClassName={"edit-table-dropdown"} overlay={pinColMenu} trigger={["click"]} visible={pinDropdownVisible} onVisibleChange={function (visible) {
            setPinDropdownVisible(visible);
        }}>
                        <antd_1.Button size={"small"} type={"link"}><icons_1.PushpinOutlined style={{ color: "#bfbfbf" }}/></antd_1.Button>
                    </antd_1.Dropdown>
                </antd_1.Space>
            </div>);
    };
    // 过滤器搜索关键字，deps: []
    var handleSearch = react_1.useCallback(function (selectedKeys, confirm, filterKey) {
        confirm();
        setSearchedText(selectedKeys[0]);
        setSearchedColumn(filterKey);
    }, []);
    // 过滤器清空搜索条件，deps: [searchInput.current]
    var handleReset = react_1.useCallback(function (clearFilters) {
        clearFilters && clearFilters();
        searchInput.current.setValue("");
        setSearchedText("");
    }, [searchInput.current]);
    // 获取搜索相关属性值注入到columns中，deps: [handleReset, searchedColumn, searchedText]
    var getColumnSearchProps = react_1.useCallback(function (filterKey) {
        if (filterKey) {
            return {
                filterIcon: function (filtered) {
                    return (<icons_1.SearchOutlined style={{ marginRight: 25, color: filtered ? "#1890ff" : undefined }}/>);
                },
                filterDropdown: function (props) {
                    var setSelectedKeys = props.setSelectedKeys, selectedKeys = props.selectedKeys, confirm = props.confirm, clearFilters = props.clearFilters;
                    return (<div style={{ padding: 8 }}>
                            <antd_1.Input ref={function (node) { return searchInput.current = node; }} style={{ width: 188, marginBottom: 8, display: "block" }} placeholder={"输入关键字"} onPressEnter={function () { return handleSearch(selectedKeys, confirm, filterKey.toString()); }} onChange={function (e) { return setSelectedKeys(e.target.value ? [e.target.value] : []); }}/>
                            <antd_1.Space>
                                <antd_1.Button type="primary" icon={<icons_1.SearchOutlined />} size="small" style={{ width: 90 }} onClick={function () { return handleSearch(selectedKeys, confirm, filterKey.toString()); }}>查找</antd_1.Button>
                                <antd_1.Button size="small" style={{ width: 90 }} onClick={function () { return handleReset(clearFilters); }}>重置</antd_1.Button>
                            </antd_1.Space>
                        </div>);
                },
                onFilter: function (value, record) {
                    return record[filterKey] ? record[filterKey]
                        .toString().toLowerCase().includes(value.toLowerCase()) : false;
                },
                render: function (text) {
                    return (searchedColumn === filterKey ? (<react_highlight_words_1["default"] highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchedText]} autoEscape textToHighlight={text ? text.toString() : ""}/>) : text);
                }
            };
        }
        return {};
    }, [handleReset, searchedColumn, searchedText]);
    // 计算列属性，deps: [columns, getColumnSearchProps]
    etColumns = react_1.useMemo(function () {
        // 处理特殊设置属性
        etColumns = columns.map(function (col, idx) {
            if (col.sortKey) {
                col.sortDirections = ["descend", "ascend"];
                col.sorter = function (a, b) {
                    var A = a[col.sortKey];
                    var B = b[col.sortKey];
                    if (A < B) {
                        return -1;
                    }
                    else if (A > B) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                };
            }
            if (col.width) {
                col.onHeaderCell = function (column) {
                    var w = 0;
                    if (typeof column.width === "number") {
                        w = column.width;
                    }
                    return {
                        width: w,
                        onResize: function (e, data) {
                            onResize && onResize(e, data, idx);
                        }
                    };
                };
            }
            return __assign(__assign({}, col), getColumnSearchProps(col.filterKey));
        });
        // 获得所有非隐藏的内容列
        etColumns = etColumns.filter(function (col) { return !col.hide; });
        // 增加一列行号
        etColumns.unshift({
            key: "lineNum",
            title: "行号",
            width: "46px",
            fixed: "left",
            render: function (valuetext, record, index) {
                var i = index + 1;
                // eslint-disable-next-line react/prop-types
                data[index].index = i;
                return (<b>{i}</b>);
            }
        });
        // 增加可操作列
        etColumns.push({
            key: "options",
            title: "操作",
            width: "166px",
            fixed: "right",
            render: function (valuetext, record, index) {
                return (<antd_1.Space direction={"horizontal"} size={"small"}>
                        <antd_1.Button size={"small"} type={"dashed"} onClick={function () { return viewRow(record, index); }}>查看</antd_1.Button>
                        <antd_1.Button size={"small"} type={"link"} onClick={function () { return editRow(record, index); }}>编辑</antd_1.Button>
                        <antd_1.Popconfirm title={"确定删除当前行？"} onConfirm={function () { return deleteRow(record, index); }}>
                            <antd_1.Button size={"small"} type={"link"} danger={true}>删除</antd_1.Button>
                        </antd_1.Popconfirm>
                    </antd_1.Space>);
            }
        });
        return etColumns;
    }, [columns, getColumnSearchProps]);
    // 选中行操作属性配置对象，deps: [selectedRows]
    var rowSelection = react_1.useMemo(function () { return ({
        selections: [
            antd_1.Table.SELECTION_ALL,
            antd_1.Table.SELECTION_INVERT
        ],
        columnWidth: "35px",
        fixed: true,
        selectedRowKeys: selectedRows,
        onChange: function (selectedRowKeys, selectedRows) { return setSelectedRows(selectedRowKeys); }
    }); }, [selectedRows]);
    // 汇总合计节点
    summaryNode = function (pageData) {
        var total = [];
        var haveTotal = false;
        // eslint-disable-next-line react/prop-types
        columns.forEach(function (c, i) {
            var result = 0;
            if (c.totalKey) {
                haveTotal = true;
                pageData.forEach(function (data) {
                    // @ts-ignore
                    result += data[c.totalKey];
                });
            }
            total.push(result);
        });
        if (!haveTotal) {
            return (<></>);
        }
        return (<antd_1.Table.Summary.Row>
                <antd_1.Table.Summary.Cell index={0} colSpan={2}>合计：</antd_1.Table.Summary.Cell>
                
                {columns.map(function (c, i) {
            return (<antd_1.Table.Summary.Cell key={i} index={i + 1} colSpan={1}>
                            {c.totalKey ? total[i] : ""}
                        </antd_1.Table.Summary.Cell>);
        })}
                <antd_1.Table.Summary.Cell index={0} colSpan={1}/>
            </antd_1.Table.Summary.Row>);
    };
    return (<div className={"edit-table-wrap"}>
            <antd_1.Table className={"edit-table"} rowClassName={rowClassName} columns={etColumns} dataSource={data} title={titleNode} components={components} size={"small"} bordered={true} pagination={false} scroll={{ x: "max-content" }} rowSelection={rowSelection} loading={loading} summary={summaryNode}/>
        </div>);
}
exports["default"] = EditTable;
