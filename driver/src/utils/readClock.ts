import sendMessage from "./sendMessage";

/**
 * Reads the current clock from the device.
 * @returns A promise resolving to the device's date and time or null if unsuccessful.
 */
export default async function readClock(): Promise<Date | null> {
  try {
    console.log("Requesting clock data from the device...");

    // HELO handshake
    const heloResponse = await sendMessage(":HELO? [''] 1\r\n", "readClock");
    if (heloResponse[0] !== "ACK") {
      throw new Error("Device did not acknowledge the HELO command.");
    }

    // Request the device's clock
    const clockResponse = await sendMessage(
      ":SYSTEM:DATETIME?\r\n",
      "readClock"
    );
    if (clockResponse.length === 6) {
      const [year, month, day, hour, minute, second] =
        clockResponse.map(Number);
      const deviceDateTime = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second
      );

      console.log("Device clock retrieved successfully:", deviceDateTime);
      return deviceDateTime;
    } else {
      console.error("Unexpected clock response format:", clockResponse);
      return null;
    }
  } catch (error) {
    console.error("Error in readClock:", error);
    return null;
  }
}
