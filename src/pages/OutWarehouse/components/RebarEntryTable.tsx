import React, {useEffect, useRef, useState} from 'react';
import {OutWarehouseDataType,OutWarehouseRebarDataType} from "@/pages/OutWarehouse/data";
import {Divider, Modal, Tag} from "antd";
import {
  delectOutWareHouseRebarById,

  getRebarCategories,
  getOutwarehouseRebarByOutWarehouseId
} from "@/pages/OutWarehouse/service";
import {CheckCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons/lib";
import ProTable from '@ant-design/pro-table';
import {ProColumns} from "@ant-design/pro-table/es/Table";
import {ActionType} from "@ant-design/pro-table/lib/Table";
import {Key} from "antd/es/table/interface";
import { text } from 'express';

const confirm = Modal.confirm;


interface OutWarehouseTableProps {
  current: Partial<OutWarehouseDataType>;
  onEdit: (id: string) => void;
  onRefresh: () => void;
  onSelectedChange: (keys: Key[]) => void;
}

let RebarEntryTable: React.FC<OutWarehouseTableProps> = (props) => {

  const {current, onEdit, onRefresh, onSelectedChange} = props;

  const actionRef = useRef<ActionType>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [rebarEntryList, setRebarEntryList] = useState<OutWarehouseRebarDataType[]>([]);

  useEffect(() => {
    if (current.id) {
      getOutwarehouseRebarByOutWarehouseId(current.id).then(data => {
        setRebarEntryList(data);
      });
    }
  }, [current]);

  const onSelectChange = (keys: any[]) => {
    onSelectedChange(keys);
    setSelectedRowKeys(keys);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '你确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后将无法恢复该数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        await delectOutWareHouseRebarById(id);
        // if (current.id) {
        //   getRebarEntryListByWarehouseId(current.id).then(data => {
        //     setRebarEntryList(data);
        //   });
        // }
        onRefresh();
        if (actionRef.current) actionRef.current.reloadAndRest();
      }
    })
  };

  const columns: ProColumns<OutWarehouseRebarDataType>[] = [
    // {
    //   title: '料牌打印',
    //   dataIndex: 'hasPrinted',
    //   render: (text, record) => {
    //     return record.hasPrinted ?
    //       <Tag icon={<CheckCircleOutlined/>} color="success">
    //         已打印
    //       </Tag> :
    //       <Tag icon={<ExclamationCircleOutlined/>} color="warning">
    //         未打印
    //       </Tag>
    //   }
    // },
    {
      title: '材料种类',
      dataIndex: 'rebarCategory',
      render: (text, record) => {
        return getRebarCategories().find(item => record.rebarCategory === item.id)?.type;
      }
    },
    {
      title: '规格',
      dataIndex: 'specification',
    },
    {
      title: '直径',
      dataIndex: 'diameter',
    },
    {
      title: '长度(mm)',
      dataIndex: 'length',
    },
    {
      title: '批次号',
      dataIndex: 'batchNumber',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      render:(text,record) =>{
        return record.deviceName;
      }
    },
    {
      title: '出库数量',
      dataIndex:'outboundQuantity',
    },
    {
      title: '理重(T)',
      dataIndex: 'outboundTheoreticalWeight',
      hideInSearch: true,
      render: (text, record) => {
        return record.outboundTheoreticalWeight.toFixed(3);
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => {
        const editButton = 
          <a onClick={e => {
            e.preventDefault();
            onEdit(record.id);
          }} >编辑</a>;
        const deleteButton = 
          <a onClick={e => {
            e.preventDefault();
            handleDelete(record.id);
          }}>删除</a>;
        return (
          <>
            {editButton}
            <Divider type={"vertical"}/>
            {deleteButton}
          </>
        )
      }
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <ProTable<OutWarehouseRebarDataType>
      bordered
      rowKey={"id"}
      columns={columns}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={rebarEntryList}
      pagination={false}
      actionRef={actionRef}
      rowSelection={rowSelection}
    />
  )
};

export default RebarEntryTable;

