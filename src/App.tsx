import React, {useContext, useEffect, useRef, useState} from 'react'
import zhCN from 'antd/lib/locale/zh_CN'
import type {InputRef} from 'antd'
import {ConfigProvider, Form, Input, Space, Table, TableProps, Tag, Typography} from 'antd'
import type {ColumnsType, ColumnType, ExpandableConfig, TableRowSelection} from 'antd/es/table/interface'
import type {FormInstance} from 'antd/es/form'
import type {GetComponentProps, RowClassName, TableComponents} from 'rc-table/es/interface'

const {Text} = Typography

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  'column-1': string
  'column-2': string
  'column-3': string
  'column-4': string
  'column-5': string
  'column-6': string
  'column-7': string
  tags: string[]
}

interface EditableRowProps {
  index: number
}

interface EditableCellProps {
  record: DataType
  editable: boolean
  dataIndex: keyof DataType
  title: React.ReactNode
  handleSave: (record: DataType) => void
  children: React.ReactNode
}

interface DefaultColumnType<T> extends ColumnType<T> {
  editable?: boolean
}

type DefaultColumnsType<T> = DefaultColumnType<T>[]

const EditableContext = React.createContext<FormInstance | null>(null)

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell: React.FC<EditableCellProps> = (
  {
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }
) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({[dataIndex]: record[dataIndex]})
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({...record, ...values})
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{paddingRight: 24}} onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export default function App() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])

  useEffect(() => {
    const mockData: DataType[] = []
    for (let i = 0; i < 100; i++) {
      mockData.push({
        key: i,
        name: 'John Brown',
        age: 30 + i,
        address: 'New York No. 1 Lake Park',
        'column-1': 'column-1',
        'column-2': 'column-2',
        'column-3': 'column-3',
        'column-4': 'column-4',
        'column-5': 'column-5',
        'column-6': 'column-6',
        'column-7': 'column-7',
        tags: ['nice', 'developer']
      })
    }
    console.log('init datasource')
    setDataSource(mockData)
  }, [])

  const handleSave = (row: DataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    setDataSource(newData)
  }

  const defaultColumns: DefaultColumnsType<DataType> = [
    {
      key: 'lineNum',
      title: '行号',
      width: '46px',
      fixed: 'left',
      render(text, record, index) {
        return (<b>{index + 1}</b>)
      }
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      filters: [
        {
          text: 'Joe',
          value: 'Joe'
        },
        {
          text: 'Jim',
          value: 'Jim'
        },
        {
          text: 'Submenu',
          value: 'Submenu',
          children: [
            {
              text: 'Green',
              value: 'Green'
            },
            {
              text: 'Black',
              value: 'Black'
            }
          ]
        }
      ],
      onFilter: (value, record: DataType) => {
        return record.name.indexOf(value as string) === 0
      },
      render: (text) => <a href={'#'}>{text}</a>
    },
    {
      key: 'name2',
      title: 'Name2',
      filterMode: 'tree',
      filterSearch: true,
      filters: [
        {
          text: 'Joe',
          value: 'Joe'
        },
        {
          text: 'Category 1',
          value: 'Category 1',
          children: [
            {
              text: 'Yellow',
              value: 'Yellow'
            },
            {
              text: 'Pink',
              value: 'Pink'
            }
          ]
        },
        {
          text: 'Category 2',
          value: 'Category 2',
          children: [
            {
              text: 'Green',
              value: 'Green'
            },
            {
              text: 'Black',
              value: 'Black'
            }
          ]
        }
      ],
      onFilter: (value, record: DataType) => {
        return record.name.indexOf(value as string) === 0
      },
      render: (text, {name}: DataType) => <a href={'#'}>{name}</a>
    },
    {
      key: 'age',
      dataIndex: 'age',
      title: 'Age',
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend'],
      sorter: (a: DataType, b: DataType) => a.age - b.age,
      editable: true
    },
    {
      key: 'address',
      dataIndex: 'address',
      title: 'Address'
    },
    {
      key: 'tags',
      dataIndex: 'tags',
      title: 'Tags',
      render: (_, {tags}: DataType) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green'
            if (tag === 'loser') {
              color = 'volcano'
            }
            return (
              <Tag key={tag} color={color}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </>
      )
    },
    {
      key: 'column-1',
      dataIndex: 'column-1',
      title: 'column-1'
    },
    {
      key: 'column-2',
      dataIndex: 'column-2',
      title: 'column-2'
    },
    {
      key: 'column-3',
      dataIndex: 'column-3',
      title: 'column-3'
    },
    {
      key: 'column-4',
      dataIndex: 'column-4',
      title: 'column-4'
    },
    {
      key: 'column-5',
      dataIndex: 'column-5',
      title: 'column-5'
    },
    {
      key: 'column-6',
      dataIndex: 'column-6',
      title: 'column-6'
    },
    {
      key: 'column-7',
      dataIndex: 'column-7',
      title: 'column-7'
    },
    {
      key: 'action',
      title: 'Action',
      render: (_, record: DataType) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      )
    }
  ]

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave
      })
    }
  })

  const rowClassName: RowClassName<DataType> = (record, index?: number) => {
    return index ? index % 2 === 0 ? 'even' : 'odd' : 'even'
  }

  const rowSelection: TableRowSelection<DataType> = {
    type: 'checkbox',
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE
    ],
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name
    })
  }

  const onRow: GetComponentProps<DataType> = (record) => ({
    onClick: () => {
      const newSelectedRowKeys = [...selectedRowKeys]
      const recordKeyIndex = newSelectedRowKeys.indexOf(record.key)
      if (recordKeyIndex >= 0) {
        newSelectedRowKeys.splice(recordKeyIndex, 1)
      } else {
        newSelectedRowKeys.push(record.key)
      }
      setSelectedRowKeys(newSelectedRowKeys)
    }
  })

  const expandable: ExpandableConfig<DataType> = {
    rowExpandable: (record) => record.name !== 'Not Expandable',
    expandedRowRender: (record) => <p>{record.name}</p>
  }

  const components: TableComponents<DataType> = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }

  const summary: TableProps<DataType>['summary'] = () => {
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>Total</Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={6}>
            <Text type="danger">{100}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={7}>
            <Text>{300}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={8}>Balance</Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={7}>
            <Text type="danger">{200}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    )
  }

  return (
    <div className={'app edit-table-wrap'}>
      <ConfigProvider locale={zhCN}>
        <Table<DataType>
          bordered
          size={'small'}
          className={'edit-table'}
          rowClassName={rowClassName}
          title={() => 'Header'}
          footer={() => 'Footer'}
          rowSelection={rowSelection}
          onRow={onRow}
          expandable={expandable}
          scroll={{x: 'max-content'}}
          pagination={{pageSize: 10}}
          components={components}
          summary={summary}
          columns={columns as ColumnsType<DataType>}
          dataSource={dataSource}
        />
      </ConfigProvider>
    </div>
  )
}
