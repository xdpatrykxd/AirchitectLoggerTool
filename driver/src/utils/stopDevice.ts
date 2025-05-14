import serialHandler from "./serialHandler";
import sendMessage from "./sendMessage";
/**
 * Sends a command to stop the device.
 * @returns A promise resolving to a boolean indicating success or failure.
 */
export default async function stopDevice(): Promise<boolean> {
  try {
    console.log("Sending stop command to the device...");

    // HELO handshake
    const heloResponse = await sendMessage(":HELO? [''] 1\r\n", "stopDevice");
    if (heloResponse[0] !== "ACK") {
      throw new Error("Device did not acknowledge the HELO command.");
    }

    // Send the stop command
    const stopResponse = await sendMessage(":STOP\r\n", "stopDevice");
    console.log("stopResponse", stopResponse);
    if (stopResponse[0] === "ACK") {
      console.log("Device stopped successfully.");
      return true;
    } else {
      console.error("Failed to stop the device:", stopResponse);
      return false;
    }
  } catch (error) {
    console.error("Error in stopDevice:", error);
    return false;
  }
}
