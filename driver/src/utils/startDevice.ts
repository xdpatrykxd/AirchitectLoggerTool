import sendMessage from "./sendMessage";
/**
 * Sends a command to start the device.
 * @returns A promise resolving to a boolean indicating success or failure.
 */
export default async function startDevice(): Promise<boolean> {
  try {
    console.log("Sending start command to the device...");

    // HELO handshake
    const heloResponse = await sendMessage(":HELO? [''] 1\r\n", "startDevice");
    if (heloResponse[0] !== "ACK") {
      throw new Error("Device did not acknowledge the HELO command.");
    }

    // Send the start command
    const startResponse = await sendMessage(":START\r\n", "startDevice");
    console.log("startResponse", startResponse);
    if (startResponse[0] === "OK") {
      console.log("Device started successfully.");
      return true;
    } else {
      console.error("Failed to start the device:", startResponse);

      return false;
    }
  } catch (error) {
    console.error("Error in startDevice:", error);
    return false;
  }
}
