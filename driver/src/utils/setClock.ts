import sendMessage from "./sendMessage";

/**
 * Sets the device clock to the current system time.
 * @returns A promise resolving to a boolean indicating success or failure.
 */
export default async function setClock(): Promise<boolean> {
  try {
    console.log("Starting clock synchronization...");

    // HELO handshake
    const heloResponse = await sendMessage(":HELO? [''] 1\r\n", "setClock");
    if (heloResponse[0] !== "ACK") {
      throw new Error("Device did not acknowledge the HELO command.");
    }

    // Prepare the SYSTEM:DATETIME command with the current system time
    const now = new Date();
    const dateTimeCommand = `:SYSTEM:DATETIME ${now.getFullYear()},${
      now.getMonth() + 1
    },${now.getDate()},${now.getHours()},${now.getMinutes()},${now.getSeconds()}\r\n`;

    // Send the date/time command
    const dateTimeResponse = await sendMessage(dateTimeCommand, "setClock");
    console.log("dateTimeResponse", dateTimeResponse);
    if (dateTimeResponse[0] !== "ACK") {
      throw new Error("Device did not acknowledge the date/time command.");
    }
    console.log("Clock synchronized successfully.");
    return true;
  } catch (error) {
    console.error("Error in setClock:", error);
    return false;
  }
}
