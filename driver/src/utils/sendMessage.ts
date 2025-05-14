import serialHandler from "./serialHandler";
import { Command, MeasurementData } from "../types";

const commandQueue: Command[] = [];
let isProcessingQueue = false;

export default async function sendMessage(
  message: string,
  label: string
): Promise<string[] | object> {
  return new Promise((resolve, reject) => {
    commandQueue.push({ message, label, resolve, reject });
    if (!isProcessingQueue) {
      processQueue();
    }
  });
}

async function processQueue() {
  if (commandQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const { message, label, resolve, reject } = commandQueue.shift()!;

  const timeout = setTimeout(async () => {
    console.error("Command timed out. Resetting port...");
    try {
      await serialHandler.resetReadWrite(); // reset the port
      console.log("Port successfully reset after timeout.");
      processQueue(); // Retry the queue
    } catch (e) {
      console.error("Failed to reset port after timeout:", e);
    }
  }, 30000); // 30 seconds timeout

  try {
    const outputElem = document.querySelector<HTMLInputElement>(
      `#${label}-messages`
    );
    if (!outputElem) {
      throw new Error("Output element not found");
    }

    if (message.includes(":MEMORY:BDATA?")) {
      await serialHandler.write(message);
      outputElem.innerHTML =
        outputElem.innerHTML + "\r\nMessage sent:" + message;
      const result = await serialHandler.readData();
      clearTimeout(timeout);

      outputElem.innerHTML =
        outputElem.innerHTML +
        "\r\nResponse received:" +
        (result as MeasurementData).header;
      outputElem.innerHTML =
        outputElem.innerHTML +
        "\r\n" +
        (result as MeasurementData).measurements;
      resolve(result);
      processQueue();
    } else {
      await serialHandler.write(message);
      outputElem.innerHTML =
        outputElem.innerHTML + "\r\nMessage sent:" + message;
      const result = await serialHandler.read();
      clearTimeout(timeout);

      outputElem.innerHTML =
        outputElem.innerHTML + "\r\nResponse received:" + result;

      let results = result.substring(0, result.indexOf("\r\n")).split(",");

      resolve(results);
      processQueue();
    }
  } catch (e: any) {
    clearTimeout(timeout);
    console.error("Error processing command:", e);
    if (e.message.includes("Stream closed by the device")) {
      console.warn("Stream closed. Resetting port...");
      await serialHandler.resetReadWrite(); // Reset and retry
      processQueue();
    } else {
      reject(e);
    }
  }
}
