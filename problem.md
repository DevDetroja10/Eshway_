# Implement `maxRate` Bandwidth Throttling

### Overview
In many testing and CLI scenarios, developers need to simulate slow network connections (e.g., matching 3G speeds or limiting upload bandwidth). Currently, Axios uploads data as fast as the system allows.

The goal is to implement a `maxRate` configuration option to limit the upload speed of the request body.

### Requirements
1.  **Configuration**: The `AxiosRequestConfig` must accept a new optional property `maxRate` (number, in bytes per second).
2.  **Logic**:
    * If `maxRate` is defined and > 0, the request body (Buffer, String, or Stream) must be throttled.
    * The implementation must calculate the necessary delay for each data chunk to maintain the target average speed.
    * The formula `delay = (chunkSize / maxRate) * 1000` (ms) should be used as a baseline.
3.  **Scope**: This change must be implemented in the **Node.js HTTP adapter** (`lib/adapters/http.js`).
4.  **Determinism**: 
    * Tests must verify timing logic without relying on real-world wall-clock time.
    * Behavior must be consistent for both Buffer and Stream inputs.

### Example Usage
```javascript
axios.post('http://example.com/upload', fileStream, {
  maxRate: 1024 // 1KB/s
});