# useDevices Hook API Documentation

## Overview

The `useDevices` hook provides functionality for fetching and managing device data from the blockchain. It offers two main functions for retrieving device information with different performance characteristics and use cases.

## Functions

### `_fetchDeviceInstances(deviceAddresses: string[]): Promise<DeviceType[]>`

**Purpose**: Batch fetch multiple devices for initial app loading

**When to use**:
- App startup/initial load
- Refreshing the entire device list
- When you need all devices at once

**Performance**: Optimized for bulk operations using the batch calls contract

**Parameters**:
- `deviceAddresses: string[]` - Array of device contract addresses

**Returns**: `Promise<DeviceType[]>` - Array of complete device objects

**Example**:
```typescript
const deviceAddresses = ["0x123...", "0x456...", "0x789..."];
const devices = await _fetchDeviceInstances(deviceAddresses);
// Returns: [
//   { address: "0x123...", sn: "DEV001", deviceState: 1, ... },
//   { address: "0x456...", sn: "DEV002", deviceState: 0, ... },
//   { address: "0x789...", sn: "DEV003", deviceState: 2, ... }
// ]
```

**Implementation Details**:
- Uses `batchCalls` for efficient blockchain queries
- Fetches: `sn`, `customer`, `deviceState`, `metadata` (mapped to `metadaURI`), `visible`
- Returns devices with basic blockchain data only
- IPFS metadata fetching is deferred to individual device pages

---

### `fetchDeviceInstance(address: string): Promise<DeviceType>`

**Purpose**: Fetch a single device after creation (used internally by addDevice)

**When to use**:
- Internal use only - called automatically after creating a new device
- Not used for individual device updates or page loading

**Performance**: Single device query, includes additional fields

**Parameters**:
- `address: string` - Single device contract address

**Returns**: `Promise<DeviceType>` - Complete device object with additional fields

**Example**:
```typescript
// This is called internally by addDevice, not directly by components
const deviceAddress = "0x123...";
const device = await fetchDeviceInstance(deviceAddress);
// Returns: {
//   address: "0x123...",
//   sn: "DEV001",
//   customer: "0xabc...",
//   deviceState: 1,
//   metadaURI: "QmHash...",
//   visible: true,
//   installationText: "",
//   blockText: "",
//   blockWarning: "",
//   toleranceWindow: 0
// }
```

**Implementation Details**:
- Creates individual device contract instance
- Fetches all device properties including additional fields
- Used internally by `addDevice` to fetch the newly created device
- Includes fields not available in batch operations

---

## Usage Patterns

### Initial App Load
```typescript
// In CucoProvider.tsx
useEffect(() => {
  if (cucoContract) {
    fetchDevices(); // Uses _fetchDeviceInstances internally
  }
}, [cucoContract]);
```

### After Device Changes
```typescript
// In Device.tsx after save
const handleSaveAll = async () => {
  // ... save logic ...
  await refetchDevices(); // Refreshes all devices using _fetchDeviceInstances
};
```

### Device Page Loading
```typescript
// In Device.tsx
useEffect(() => {
  const foundDevice = fetchedDevices.find(d => d.sn === deviceSN);
  if (foundDevice) {
    setDevice(foundDevice); // Uses cached data from _fetchDeviceInstances
  }
}, [fetchedDevices]);
```

### Adding New Devices
```typescript
// In useDevices.ts - addDevice function
const addDevice = async (customer: string, sn: string, metadata: string) => {
  // ... create device on blockchain ...
  const newDeviceAddress = parsedLog?.args.deviceAddress;
  setDevices([...devices, await fetchDeviceInstance(newDeviceAddress)]); // Uses fetchDeviceInstance
};
```

## Performance Considerations

| Function | Use Case | Performance | Data Completeness |
|----------|----------|-------------|-------------------|
| `_fetchDeviceInstances` | Bulk loading, device updates | Fast (batch calls) | Basic blockchain data |
| `fetchDeviceInstance` | New device creation only | Slower (individual calls) | Complete data + extra fields |

## Data Flow

1. **App Start**: `fetchDevices()` → `_fetchDeviceInstances()` → Device list
2. **Device Page**: Uses cached data from step 1
3. **After Changes**: `refetchDevices()` → `_fetchDeviceInstances()` → Updated list
4. **New Device**: `addDevice()` → `fetchDeviceInstance()` → Add to list

## Notes

- IPFS metadata is not fetched by these functions
- Device pages handle IPFS loading separately for performance
- Batch operations are preferred for initial loading
- Individual fetches are used for updates and detailed views
