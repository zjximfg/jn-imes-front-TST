import {request} from 'umi';
import {
  OutWarehouseQueryParamsDataType,
  OutWarehouseDataType,
  WarehouseStorageDataType,
  OutWarehouseRebarDataType
} from "@/pages/OutWarehouse/data";

export function getProcurementMethods() {
  return [
    {
      id: 0,
      type: '采购入库'
    },
    {
      id: 1,
      type: '调拨入库'
    },
  ];
}

// export function createNewRebarEntry() {
//   return {
//     key: "0",
//     id: '',
//     warehouseEntryId: "",
//     rebarCategory: 0, //钢筋种类，0=棒材， 1=线材
//     manufacturer: "", //制造商
//     specification: "",
//     diameter: 0,
//     length: 0,
//     quantity: 0,  // 捆数
//     quantityUnit: "",   //捆
//     packageQuantity: 0,   //包装数量
//     packageQuantityUnit: "",  //根
//     theoreticalWeight: 0,
//     actualWeight: 0,
//     batch0: 0,     // 批次号
//     usagePosition: "",
//     experimentCode: "",   //VO  , TODO 暂不知道来源
//     driver: "",
//     vehicle: "",
//     remarks: "",
//   }
// }
export function createNewOutWarehouseRecord() {
  return{
  key: "0",
  id: '',
  outwarehouseId: "",
  warehouseStorageId: "",
  rebarStorageId: "",
  rebarCategory: 0, //钢筋种类，0=棒材， 1=线材
  specification: "", //规格
  diameter: 0, //直径
  length: 0, //长度
  batchNumber: 0, //批次号
  deviceName: "", //设备名称
  outboundQuantity: 0, //出库数量
  outboundQuantityUnit: "", //出库单位 根
  outboundTheoreticalWeight: 0, //出库理重
  outboundActualWeight: 0, //出库实重
  }
}

export function getRebarCategories() {
  return [
    {
      id: 0,
      type: '棒材'
    },
    {
      id: 1,
      type: '线材'
    },
  ];
}
///要再确认
export async function echo(data:Array<WarehouseStorageDataType>){
  return request("/api/warehouse/outWarehouse/echo",{
    method:'post',
    data
  })
}

export async function outWarehouse(data:Partial<OutWarehouseDataType>){
  return request("/api/warehouse/outWarehouse/",{
    method:'post',
    data
  })
}

export async function getOutwarehousePageByCompanyId(params: OutWarehouseQueryParamsDataType){
  return request("/api/warehouse/outWarehouse/page",{
    method: 'get',
    params
  })
}

export async function getOutWarehouseById(id:string){
  return request<OutWarehouseDataType>("/api/warehouse/outWarehouse/" + id,{
    method:'get',
  })
}
export async function updateOutWarehouse(id:string,data: Partial<OutWarehouseDataType>){
  return request("/api/warehouse/outWarehouse/"+id,{
    method: 'put',
    data
  })
}
export async function delectById(id: string) {
  return request("/api/warehouse/outWarehouse/"+ id,{
    method:'delete',
  })
}
export async function getOutwarehouseRebarByOutWarehouseId(outwarehouseId: string){
  return request<OutWarehouseRebarDataType[]>("/api/warehouse/outwarehouseRebar",{
    method:'get',
    params:{outwarehouseId}
  })
}
export async function outwarehouseRebarById(id: string) {
  return request<Partial<OutWarehouseRebarDataType>>("/api/warehouse/outwarehouseRebar/" + id, {
    method: 'get',
  })
}


export async function insertOutwarehouseRebar(data: Partial<OutWarehouseRebarDataType>){
  return request("/api/warehouse/outwarehouseRebar",{
    method:'post',
    data
  })
}


export async function updateOutwarehouseRebar(id: string,data: Partial<OutWarehouseRebarDataType>){
  return request("/api/warehouse/outwarehouseRebar/"+id,{
    method:'put',
    data
  })
}
export async function delectOutWareHouseRebarById(id:string){
  return request("/api/warehouse/outwarehouseRebar/"+id,{
    method:'delete',
  })
}
