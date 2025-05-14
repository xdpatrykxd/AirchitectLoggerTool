import sendMessage from "./sendMessage";

let port: any | null = null;
let reader: ReadableStreamDefaultReader | null = null;
let writer: WritableStreamDefaultWriter | null = null;
const decoder = new TextDecoder();

/**
 * Opens the port selected by the user in the UI using a defined `baudRate`; this example uses a hard-coded value of 9600.
 * After opening the port, a `writer` and a `reader` are set; they will be used by the `write` and `read` methods respectively.
 */

async function init() {
  await serialHandler(); // Establish connection
}

async function serialHandler() {
  const outputElem =
    document.querySelector<HTMLInputElement>(`#Connect-messages`);
  if (!outputElem) {
    throw new Error("Output element not found");
  }
  if ("serial" in navigator) {
    try {
      port = await (navigator as any).serial.requestPort();

      outputElem.innerHTML = outputElem.innerHTML + "\r\n Opening port";
      console.log("Opening port");
      let wasAlreadyOpen = await retry(openPort, [port], 5);

      if (!wasAlreadyOpen) {
        if (writer) writer.releaseLock(); // Release existing writer lock if necessary
        if (reader) reader.releaseLock(); // Release existing reader lock if necessary

        //only assign writable & readable streams when port wasn't previously opened
        writer = port.writable.getWriter();
        reader = port.readable.getReader();
      }

      outputElem.innerHTML =
        outputElem.innerHTML + "\r\n Port successfully opened";
    } catch (err) {
      alert("There was an error opening the serial port: " + err);
    }
  } else {
    console.error(
      "Web serial doesn't seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info."
    );
  }
}

async function getSupportedCommands() {
  const helpCommand = ":HELP?\r\n"; // Adjust this based on your device's protocol
  const response = await sendMessage(helpCommand, "Connect");
  console.log("Supported Commands:", response);
}

/**
 * Takes a string of data, encodes it and then writes it using the `writer` attached to the serial port.
 * @param data - A string of data that will be sent to the Serial port.
 * @returns An empty promise after the message has been written.
 */
async function write(data: string): Promise<void> {
  if (!writer) {
    throw new Error("Serial port not open");
  }
  await writer.ready;

  try {
    console.log("sending data: ", data);
    const dataArrayBuffer = await toAscii(data);
    await writer.write(dataArrayBuffer);
    await writer.ready;
  } catch (err) {
    console.error("Error writing to serial port:", err);
  }
}

/**
 * Reads data from the serial port using the `reader` attached to the serial port.
 * @returns A promise that resolves to the decoded string of data read from the serial port.
 */
// async function read(): Promise<string> {
//   if (!reader) {
//     throw new Error("Serial port not open");
//   }
//   try {
//     const readerData = await reader.read();
//     console.log(readerData);
//     var msg = decoder.decode(readerData.value);
//     console.log("response received: ", msg);
//     return msg;
//   } catch (err) {
//     const errorMessage = `error reading data: ${err}`;
//     console.error(errorMessage);
//     return errorMessage;
//   }
// }

async function read(): Promise<string> {
  if (!reader) {
    throw new Error("Serial port not open");
  }

  let fullResponse = ""; // Buffer to store the full response
  let fullResponseArray = new Uint8Array(); // Buffer to store the full response as an array of Uint8Arrays

  try {
    while (true) {
      const { done, value } = await reader.read(); // Read a chunk of data
      if (value) {
        const chunk = decoder.decode(value); // Decode the chunk
        console.log("Chunk received:", chunk);
        fullResponse += chunk; // Append the chunk to the full response
        fullResponseArray = new Uint8Array([...fullResponse, ...value]); // Append chunk

        if (chunk.includes("\r\n") || chunk.includes("END")) {
          console.log("Termination signal detected.");
          break;
        }
      }

      if (done) {
        console.warn("Stream was closed. Reinitializing connection...");
        await resetReadWrite(); // Reset the port
        break; // Exit the loop if the stream is done
      }
    }
    console.log("Full response received:", fullResponse);
    return fullResponse; // Return the full concatenated response
  } catch (err) {
    const errorMessage = `error reading data: ${err}`;
    console.error(errorMessage);
    return errorMessage;
  }
}

async function readData(): Promise<object> {
  if (!reader) {
    throw new Error("Serial port not open");
  }

  let fullResponse = ""; // Buffer to store the full response
  let fullResponseArray = new Uint8Array(); // Buffer to store the full response as an array of Uint8Arrays

  try {
    while (true) {
      const { done, value } = await reader.read(); // Read a chunk of data
      if (value) {
        const chunk = decoder.decode(value); // Decode the chunk
        console.log("Chunk received:", chunk);
        fullResponse += chunk; // Append the chunk to the full response
        fullResponseArray = new Uint8Array([...fullResponse, ...value]); // Append chunk

        if (chunk.includes("\r\n") || chunk.includes("END")) {
          console.log("Termination signal detected.");
          break;
        }
      }

      if (done) {
        console.warn("Stream was closed. Reinitializing connection...");
        await resetReadWrite(); // Reset the port
        break; // Exit the loop if the stream is done
      }
    }

    const parsedData = await parseBDATA(fullResponseArray); // Parse the full response

    console.log("parsed data:", parsedData);
    return parsedData; // Return the full concatenated response
  } catch (err) {
    const errorMessage = { message: `error reading data: ${err}` };
    console.error(errorMessage.message);
    return errorMessage;
  }
}

function parseHeader(data: Uint8Array): object {
  return {
    deviceId: (data[0] << 8) | data[1], // Combine first two bytes for device ID
    logStartTime: (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7], // 4 bytes for start time
    logInterval: data[8], // Single byte for log interval
  };
}

function parseMeasurements(data: Uint8Array, startIndex: number): number[][] {
  const measurements = [];
  for (let i = startIndex; i < data.length; i += 4) {
    const value1 = (data[i] << 8) | data[i + 1]; // First 2 bytes for value 1
    const value2 = (data[i + 2] << 8) | data[i + 3]; // Next 2 bytes for value 2
    measurements.push([value1, value2]);
  }
  return measurements;
}

function parseBDATA(data: Uint8Array): object {
  const header = parseHeader(data.slice(0, 12)); // First 12 bytes as header
  const measurements = parseMeasurements(data, 12); // Remaining bytes as measurements
  return { header, measurements };
}

/**
 * Retries a function a specified number of times with a delay between each attempt.
 * @param fn - The function to retry.
 * @param args - The arguments to pass to the function.
 * @param retries - The number of times to retry the function.
 * @returns A promise that resolves to the result of the function, or rejects if all retries fail.
 */
function retry(fn: Function, args: any[], retries: number): Promise<any> {
  return fn(...args).catch((err: any) => {
    if (retries > 1) {
      return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        retry(fn, args, retries - 1)
      );
    } else {
      return Promise.reject(err);
    }
  });
}

/**
 * Opens the serial port.
 * @param port - The serial port to open.
 * @returns A promise that resolves to true if the port was already open, or false if it was successfully opened.
 */
function openPort(port: any): Promise<boolean> {
  return port
    .open({ baudRate: 9600 })
    .then(() => false)
    .catch((err: any) => {
      if (err.message.includes("already open")) {
        return true;
      } else {
        return Promise.reject(err);
      }
    });
}

async function resetReadWrite() {
  try {
    if (reader) {
      await reader.cancel();
      await reader.releaseLock();
      reader = null;
    }
    if (writer) {
      await writer.close();
      await writer.releaseLock();
      writer = null;
    }
    writer = await port.writable.getWriter();
    reader = await port.readable.getReader();
    console.log("Port successfully reset.", reader, writer);
  } catch (e) {
    console.error("Error resetting port:", e);
  }
}
function toAscii(text: String): Uint8Array {
  let convertedChar;
  var array = new Uint8Array(text.length);

  for (let i = 0; i < text.length; i++) {
    convertedChar = text.charCodeAt(i);
    array[i] = convertedChar;
  }

  return array;
}

export default {
  init,
  serialHandler,
  read,
  readData,
  write,
  getSupportedCommands,
  resetReadWrite,
};
