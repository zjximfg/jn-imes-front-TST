import React, {useRef, useState} from 'react';
import {Button, Divider,  Modal, Tag} from "antd";
import {ActionType, ProColumns} from "@ant-design/pro-table/es/Table";
import {
  ExclamationCircleOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons/lib";
import {PageContainer} from "@ant-design/pro-layout";
import ProTable from "@ant-design/pro-table";
import {OutWarehouseQueryParamsDataType,OutWarehouseDataType,OutWarehouseRebarDataType} from "@/pages/OutWarehouse/data";
import {getOutwarehousePageByCompanyId,delectById,updateOutWarehouse,updateOutwarehouseRebar,insertOutwarehouseRebar} from "@/pages/OutWarehouse/service";
import RebarEntryTable from "@/pages/OutWarehouse/components/RebarEntryTable";
import WarehouseEntryForm from "@/pages/OutWarehouse/components/WarehouseEntryForm";
import RebarEntryForm from "@/pages/OutWarehouse/components/RebarEntryForm";
import EditableTable from "@/pages/OutWarehouse/components/EditableTable";
import TableForm from "@/pages/OutWarehouse/components/TableForm";
import { Key } from "antd/es/table/interface";


const confirm = Modal.confirm;

const OutWarehouse: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [visible, setVisible] = useState<boolean>(false);
  // const [outwarehouseVisible, setOutWarehouseVisible] = useState<boolean>(false);
  const [outWarehouseRecordVisible, seoutWarehouseRecordVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [OutWarehouseRecordId, setOutWarehouseRecordId] = useState<string | undefined>(undefined);
  // const [OutWarehouseId, setOutWarehouseId] = useState<string | undefined>(undefined);
  

  let printList = new Map<string, string[]>();

  const [type, setType] = useState<string>("create");

  const handleEdit = (id: string) => {
    setCurrentId(id);
    setType("edit");
    setVisible(true);
  };

  const handleRebarEntryEdit = (id: string) => {
    setOutWarehouseRecordId(id);
    setType("edit");
    seoutWarehouseRecordVisible(true);
  };


  const handleAdd = () => {
    setCurrentId(undefined);
    setType("create");
    setVisible(true);
  };

  const handleRebarAdd = (id: string) => {
    setCurrentId(id);
    setOutWarehouseRecordId(undefined);
    setType("create");
    seoutWarehouseRecordVisible(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '你确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法恢复该数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        const res = await delectById(id);
        if (res) {
          if (actionRef.current)
            actionRef.current.reloadAndRest();
        }
      }
    })
  };

  const handleCancel = () => {
    setCurrentId(undefined);
    setOutWarehouseRecordId(undefined);
    seoutWarehouseRecordVisible(false);
    setVisible(false);
  };

  const handleFinish = async (values: Partial<OutWarehouseDataType>) => {
    if (currentId && type === 'edit') {
      // 编辑
      await updateOutWarehouse(currentId, values);
    } else {
      // 新建
  
    }
    setVisible(false);
    setCurrentId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };


  const handleRebarEntryFinish = async (values: Partial<OutWarehouseRebarDataType>) => {
    if (OutWarehouseRecordId && type ==='edit' ) {
      // 编辑
      await updateOutwarehouseRebar(OutWarehouseRecordId, values);
    } else{
      //新建
      values = {...values, outWarehouseId: currentId};
      await insertOutwarehouseRebar(values);
    }
    seoutWarehouseRecordVisible(false);
    setOutWarehouseRecordId(undefined);
    if (actionRef.current)
      actionRef.current.reloadAndRest();
  };

    const handleSelectedChange = (keys: Key[], id: string) => {
      printList.set(id, keys as string[]);
    };

    // const handlePrint = () => {
    //   //todo
    //   printList.forEach((value) => {
    //     printRebarEntries(value);
    //   });
    // };
    //打印原材牌
    // const handleImport = (warehouseEntryId: string, file: RcFile) => {
    //   // 包装成 formData 用于转换成文件流格式
    //   const formData = new FormData();
    //   formData.set('file', file);
    //   importExcel(warehouseEntryId, formData).then(() => {
    //     if (actionRef.current)
    //       actionRef.current.reloadAndRest();
    //     message.success(`文件导入成功`);
    //   });
    //   // 返回 false 禁止组件自动上传
    //   return false;
    // };

    // const handleDownload = () => {
    //   setDownloadLoading(true);
    //   if (downloadLoading) return;
    //   downloadTemplateExcel().then(res => {
    //     if (res.size === 0) return;
    //     const fileName = "Rebar Entry Import Template.xlsx";
    //     if (fileName) {
    //       downloadCallback(res, fileName);
    //     }
    //   }).finally(() => {
    //     setDownloadLoading(false);
    //   });
    // };

    const handleRefresh = () => {
      if (actionRef.current)
        actionRef.current.reloadAndRest();
    };

    const columns: ProColumns<OutWarehouseDataType>[] = [
      {
        title: "流水号",
        dataIndex: 'id',
        render: (text, record) => {
          return (
            <Tag icon={<InfoCircleOutlined />} color="#55acee">
              {record.id}
            </Tag>
          )
        }
      },

      {
        title: '使用用途',
        dataIndex: 'purpose',
        hideInSearch: true,
        render: (text, record) => {
          return record.purpose;
        }
      },
      {
        title: '领用时间',
        dataIndex: 'recipientsTime',
        hideInSearch: true,
        valueType: 'dateTime',
      },
      {
        title: '领用人',
        dataIndex: 'recipient',
        hideInSearch: true,
        render: (text, record) => {
          return record.recipient;
        }
      },
      {
        title: '领用单位',
        dataIndex: 'recipientsUnit',
        hideInSearch: true,
        render: (text, record) => {
          return record.recipientsUnit;
        }
      },
     
      {
        title: '操作',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <a onClick={e => {
                e.preventDefault();
                handleEdit(record.id);
              }}>编辑</a>
              <Divider type={"vertical"} />
              <a onClick={e => {
                e.preventDefault();
                handleDelete(record.id);
              }}>删除</a>
            <Divider type={"vertical"} />
            <a onClick={e => {
              e.preventDefault();
              handleRebarAdd(record.id);
            }}>添加钢筋明细</a>
            <Divider type={"vertical"} />
             </>
          )
        }
      }
    ];


    const expandedRowRender = (record: OutWarehouseDataType) => {

      return <RebarEntryTable current={record} onEdit={handleRebarEntryEdit} onRefresh={handleRefresh} onSelectedChange={(keys) => handleSelectedChange(keys, record.id)} />
    };

    return (
      <PageContainer>
      <ProTable<OutWarehouseDataType>
        rowKey={"id"}
        headerTitle={"原材出库单"}
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const pageParams: OutWarehouseQueryParamsDataType = {
            current: params.current? params.current : 1,
            pageSize: params.pageSize? params.pageSize : 20,
            ...params,
          };
          return await getOutwarehousePageByCompanyId(pageParams);
        }}
        beforeSearchSubmit={params => {
          if (params.receivingTimeRange) {
            return {
              receivingTimeStart: params.receivingTimeRange[0],
              receivingTimeEnd: params.receivingTimeRange[1],
              ...params
            }
          }
          return params
        }}
        expandable={{expandedRowRender}}
        toolBarRender={() => {
          return [
            <Button type={"primary"} onClick={() => handleAdd()}>
              <PlusOutlined /> 新建出库单
            </Button>,
            <Button  >
              <ExportOutlined /> 导出
            </Button>
            

          ]
        }}
      />
     <WarehouseEntryForm visible={visible} type={type} currentId={currentId} onCancel={handleCancel} onFinish={handleFinish}/>
      <RebarEntryForm visible={outWarehouseRecordVisible} type={type} currentId={OutWarehouseRecordId} onCancel={handleCancel} onFinish={handleRebarEntryFinish}/>
      <EditableTable/>
      <TableForm/>
    </PageContainer>
    )
};

export default OutWarehouse;
