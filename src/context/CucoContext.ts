import { createContext } from "react";
import { Contract } from "ethers";

export interface DeviceType {
  address: string,
  sn: string,
  customer: string,
  deviceState: number,
  metadataURI: string,
  visible: boolean,
  IT: string, //installationText
  BT: string, //blockText
  BW: string, //blockWarning
  TW: number, //toleranceWindow
  MaxUC: number, 
  ticketlifetime: number
}

export interface CustomerType {
  name: string,
  parent: string,
  parentName: string,
  address: string;
  authorizedUsers: string[];
  deviceMetadata: string; // the default metadata for a device created by this customer
}


type CucoContextType = { // The context is an array of providers
  cucoContract: Contract | null;
  fetchCuco: () => void;
  fetchedDevices: Array<DeviceType>;
  refetchDevices: () => void;
  addDevice: (_customer:string, _sn:string, _metadata:string, _deviceState:number) => void;
  setDeviceState: (_state:number, _address:string) => void;
  toggleDeviceVisible: (_address:string) => void;
  setDeviceMetadataURI: (_address:string, _metadataURI:string) => void;
  fetchedCustomers: Array<CustomerType>;
  refetchCustomers: () => void;
  createCustomer: (_parentAddress:string, _name:string, _deviceMetadata:string) => Promise<void>;
  addAdmin: (_customerAddress:string, _newAdmin:string) => void;
  getCustomerDeviceMetadata: (_customerAddress:string) => Promise<string>;
};


const CucoContext = createContext<CucoContextType>({
    // Default context
    cucoContract: null,
    fetchCuco: () => {},
    fetchedDevices: [],
    refetchDevices: () => {},
    addDevice: () => {},
    setDeviceState: () => {},
    toggleDeviceVisible: () => {},
    setDeviceMetadataURI: () => {},
    fetchedCustomers: [],
    refetchCustomers: () => {},
    createCustomer: async () => {},
    addAdmin: () => {},
    getCustomerDeviceMetadata: async () => "",
});

export default CucoContext;
