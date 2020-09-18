import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload,} from "antd";
import {
  getRebarCategories,outwarehouseRebarById
} from "@/pages/OutWarehouse/service";
import {getDeviceListByCompanyId} from "@/pages/Device/service";
import {DeviceDataType} from "@/pages/Device/data";
import {getWarehouseStorageListByCompanyId} from "@/pages/WarehouseStorage/service";
import {WarehouseStorageDataType} from "@/pages/WarehouseStorage/data";
import {PlusOutlined,} from "@ant-design/icons/lib";
import {RcFile} from "antd/es/upload";
import { OutWarehouseRebarDataType} from "@/pages/OutWarehouse/data";


const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const tailLayout = {
  wrapperCol: {offset: 7, span: 13},
};

const Option = Select.Option;

interface RebarEntryFormProps {
  visible: boolean;
  type: string;
  currentId: string | undefined;
  onCancel: () => void;
  onFinish: (values: Partial<OutWarehouseRebarDataType>) => void;
}

const RebarEntryForm: React.FC<RebarEntryFormProps> = (props) => {

  const {visible, type, currentId, onCancel, onFinish} = props;

  const [fileList, setFileList] = useState<any[]>([]);

  const [warehouseEntryId, setWarehouseEntryId] = useState<string | undefined>(undefined);

  const [outwarehouseId, setoutwarehouseId] = useState<string | undefined>(undefined);

  const [deviceList, setdeviceList] = useState<DeviceDataType[]>([]);

  const [warehouseStorageList, setwarehouseStorageList] = useState<WarehouseStorageDataType[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    //初始化时，加载设备列表
    getDeviceListByCompanyId().then(data => {
      setdeviceList(data);
    });
    getWarehouseStorageListByCompanyId().then(data => {
      setwarehouseStorageList(data);
    })
  }, []);


  useEffect(() => {
    if (currentId !== undefined) {
      outwarehouseRebarById(currentId).then(res => {
        form.setFieldsValue(res);
        if (res && res.outwarehouseId) {
          setWarehouseEntryId(res.outwarehouseId);
        }
      });
    }
  }, [currentId]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setoutwarehouseId(undefined);
    }
  }, [visible]);

  // // 上传附件
  // const handleUpload = (file: RcFile) => {
  //   // 包装成 formData 用于转换成文件流格式
  //   const formData = new FormData();
  //   formData.set('file', file);
  //   uploadAccessories(formData).then(data => {
  //     message.success(`图片上传成功`);
  //     // 创建列表
  //     setFileList([...fileList, data]);
  //   });
  //   // 返回 false 禁止组件自动上传
  //   return false;
  // };

  // const uploadButton = (
  //   <div>
  //     <PlusOutlined/>
  //     <div className={"ant-upload-text"}>上传</div>
  //   </div>
  // );

  const renderForm = (): React.ReactNode => {
    return (
      <Form form={form} {...formLayout}
            onFinish={(values) => {
              if (outwarehouseId) values = {...values, outwarehouseId};
              onFinish(values)
            }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label={"材料种类"} name={"rebarCategory"} rules={[{required: true}]}>
              <Select>
                {getRebarCategories().map(item => {
                  return (
                    <Option value={item.id}>{item.type}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label={"规格"} name={"specification"} rules={[{required: true}]}>
              {/* <Select>
                {warehouseStorageList.map(item => {
                  return (
                    <Option value={item.id}>{item.specification}</Option>
                  )
                })}
              </Select> */}
              <Input placeholder={"规格"}/>
            </Form.Item>
            <Form.Item label={"直径"} name={"diameter"} rules={[{required: true}]}>
            {/* <Select>
                {warehouseStorageList.map(item => {
                  return (
                    <Option value={item.id}>{item.diameter}</Option>
                  )
                })}
              </Select> */}
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"长度"} name={"length"} rules={[{required: true}]}>
              <InputNumber/>
              </Form.Item>
            <Form.Item label={"批次号"} name={"batchNumber"} rules={[{required: true}]}>
              <Input placeholder={"批次号"}/>
            </Form.Item>
            <Form.Item name={"deviceName"} label={"加工设备"} rules={[{required: true}]}>
              <Select>
                {deviceList.map(item => {
                  return (
                    <Option value={item.name}>{item.name}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label={"出库数量"} name={"outboundQuantity"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
            <Form.Item label={"理重"} name={"outboundTheoreticalWeight"} rules={[{required: true}]}>
              <InputNumber/>
            </Form.Item>
          </Col>
        </Row>
     
        <Form.Item {...tailLayout}>
          <>
            <Button type={"primary"} htmlType={"submit"}>提交</Button>
            <Button type={"primary"} onClick={onCancel} style={{marginLeft: 8}}>取消</Button>
          </>
        </Form.Item>
      </Form>
    )
  };

  return (
    <Modal
      title={type === 'create' ? "新建钢筋明细" : "编辑钢筋明细"}
      visible={visible}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      {renderForm()}
    </Modal>
  );

};

export default RebarEntryForm;
