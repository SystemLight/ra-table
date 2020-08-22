# ra-antd-table

基于react antd进行拓展的表格组件

## 安装

```
npm install ra-antd-table
```

## 使用示例

```
import React, {useState} from 'react';
import EditTable from "ra-antd-table";
import {IColumnsType} from "ra-antd-table/dist/interface";

const columns = [
    {
        key: "name",
        dataIndex: "name",
        sortKey: "name",
        title: "姓名"
    },
    {
        key: "age",
        dataIndex: "age",
        sortKey: "age",
        filterKey: "age",
        totalKey: "age",
        width: 180,
        title: "年龄"
    },
    {
        key: "size",
        dataIndex: "size",
        sortKey: "size",
        filterKey: "size",
        title: "位置"
    }
];

const data = [
    {
        key: "1",
        name: "SystemLight",
        age: 23,
        size: 1
    },
    {
        key: "2",
        name: "Lisys",
        age: 18,
        size: 2
    },
    {
        key: "3",
        name: "kirito",
        age: 12,
        size: 3
    }
];

function App() {
    const [colState, setColState] = useState<IColumnsType<any>>(columns);
    return (
        <>
            <div className={"s-wrap"} style={{paddingTop: 15}}>
                <EditTable<any>
                    columns={colState}
                    data={data} title={"表格标题"}
                    onResize={(e, {size}, i) => {
                        colState[i].width = size.width;
                        setColState([...colState]);
                    }}
                    onChangeHide={(idx, status) => {
                        colState[idx].hide = status;
                        setColState([...colState]);
                    }}
                    onChangePin={(idx, val) => {
                        colState[idx].fixed = val === "none" ? undefined : val;
                        setColState([...colState]);
                    }}
                />
            </div>
        </>
    );
}

export default App;
```
