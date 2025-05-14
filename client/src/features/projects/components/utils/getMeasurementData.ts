import { MeasurementData } from "./types";
import sendMessage from "./sendMessage";

export default async function GetMeasurementData() {
  console.log("Starting measurement data retrieval...");
  console.log("Requesting device information...");

  // Step 1: Request device information
  const deviceResponse = await sendMessage("*IDN?\r\n", "getMeasurementData");
  let device = { model: "Unknown", fullResponse: "" };
  if (Array.isArray(deviceResponse)) {
    if (deviceResponse.length < 1) {
      console.error("Failed to identify device.");
      return [false, null];
    }

    device = {
      model: deviceResponse[1] ?? "Unknown",
      fullResponse: deviceResponse.join(","),
    };
  }
  console.log(`Connected to device: ${device.model}`);
  console.log(`Full device response: ${device.fullResponse}`);

  let success: boolean | null = null;
  let receivedData: any | null = null;

  // Step 2: Attempt to get measurement data with retries
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`Attempt ${attempt} to get measurement data...`);

    try {
      const result = await getMeasurementDataFromDevice(device); // Pass device info to the function

      if (result) {
        success = true;
        receivedData = result;
        console.log("Measurement data successfully retrieved.");
        break;
      }
    } catch (error) {
      console.warn(`Measurement attempt ${attempt} failed. Retrying...`, error);
      success = false;
    }
  }

  if (!success) {
    console.error("Failed to retrieve measurement data after 5 attempts.");
  }

  console.log("Final Success Status:", success);
  console.log("Received Data:", receivedData);
  return [success ?? false, receivedData];
}

async function getMeasurementDataFromDevice(device: {
  model: string;
  fullResponse: string;
}) {
  console.log(`Retrieving measurement data for device: ${device.model}`);

  try {
    const { memoryTime, systemTime } = await syncDeviceTime();
    console.log("Synchronized Time:", { memoryTime, systemTime });

    const { interval, flag } = await getMemoryConfig();
    console.log("Memory Config:", { interval, flag });

    const channelData = [];
    for (let channelId = 1; channelId <= 2; channelId++) {
      const channel = await getChannelData(channelId);
      channelData.push(channel);
    }

    const sampleData = await getSampleData();

    return {
      success: true,
      receivedData: {
        deviceModel: device.model,
        memoryTime,
        systemTime,
        interval,
        flag,
        channelData,
        sampleData,
      },
    };
  } catch (error) {
    console.error("Error during measurement data retrieval:", error);
    return { success: false, receivedData: null };
  }
}

// Synchronize device time with the system time
async function syncDeviceTime(): Promise<{
  memoryTime: Date;
  systemTime: Date;
}> {
  const memoryTimeResponse = await sendMessage(
    ":MEMORY:DATETIME?\r\n",
    "getMeasurementData"
  );
  const systemTimeResponse = await sendMessage(
    ":SYSTEM:DATETIME?\r\n",
    "getMeasurementData"
  );
  let memoryTime = new Date();
  let systemTime = new Date();
  let triggerTime;
  if (Array.isArray(memoryTimeResponse) && Array.isArray(systemTimeResponse)) {
    memoryTime = parseDateTime(memoryTimeResponse);
    systemTime = parseDateTime(systemTimeResponse);

    const now = new Date();
    triggerTime = new Date(
      memoryTime.getTime() + (now.getTime() - systemTime.getTime())
    );
  }

  console.log("Synchronized trigger time:", triggerTime);
  return { memoryTime, systemTime };
}

function parseDateTime(response: string[]): Date {
  if (response.length === 6) {
    return new Date(
      parseInt(response[0]),
      parseInt(response[1]) - 1,
      parseInt(response[2]),
      parseInt(response[3]),
      parseInt(response[4]),
      parseInt(response[5])
    );
  }
  throw new Error("Invalid datetime response.");
}

// Retrieve memory configuration
async function getMemoryConfig(): Promise<{ interval: number; flag: boolean }> {
  const memoryConfigResponse = await sendMessage(
    ":MEMORY:CONFIG?\r\n",
    "getMeasurementData"
  );

  if (Array.isArray(memoryConfigResponse)) {
    if (memoryConfigResponse.length === 10) {
      const interval = parseInt(memoryConfigResponse[2]);
      const flag = parseInt(memoryConfigResponse[1]) === 1;
      return { interval, flag };
    }
  }
  throw new Error("Invalid memory configuration response.");
}

// Get channel data for a specific channel
async function getChannelData(channelId: number): Promise<ChannelData> {
  const memoryUnitResponse = await sendMessage(
    `:MEMORY:UNIT? ${channelId}?\r\n`,
    "getMeasurementData"
  );
  const scalingSetResponse = await sendMessage(
    `:SCALING:SET? ${channelId}?\r\n`,
    "getMeasurementData"
  );
  let channelData: ChannelData = { memoryUnit: [], scalingSet: [] };
  if (Array.isArray(memoryUnitResponse) && Array.isArray(scalingSetResponse)) {
    // Parse responses to build channel data structure
    channelData = parseChannelData(memoryUnitResponse, scalingSetResponse);
  }
  return channelData;
}

// Parse channel data (mock implementation - adjust as needed)
function parseChannelData(
  memoryUnitResponse: string[],
  scalingSetResponse: string[]
): ChannelData {
  return {
    memoryUnit: memoryUnitResponse,
    scalingSet: scalingSetResponse,
  };
}

// Retrieve and process sample data
async function getSampleData(): Promise<any> {
  //number[][]
  const sampleResponse = await sendMessage(
    ":MEMORY:SAMPLE?\r\n",
    "getMeasurementData"
  );
  console.log("Sample data response:", sampleResponse);
  if (Array.isArray(sampleResponse)) {
    if (sampleResponse.length === 2) {
      const maxBytes = parseInt(sampleResponse[1]);
      const startAddress = parseInt(sampleResponse[0]);
      let samples: number[][] = [];

      for (let offset = 0; offset < maxBytes; offset += 150) {
        const bdataResponse = await sendMessage(
          `:MEMORY:BDATA? ${startAddress + offset},150\r\n`,
          "getMeasurementData"
        );

        if ((bdataResponse as MeasurementData).measurements.length > 0) {
          const parsedData = (
            bdataResponse as MeasurementData
          ).measurements.map((value) => {
            console.log("Value:", value);
            return value;
          });
          parsedData.forEach((data) => samples.push(data));
          console.log("Sample data chunk:", parsedData);
        }
      }

      console.log("Full sample data retrieved:", samples);
      return samples;
    }
  } else {
    throw new Error("Invalid sample data response.");
  }
}

// Type definitions
interface ChannelData {
  memoryUnit: string[];
  scalingSet: string[];
}
