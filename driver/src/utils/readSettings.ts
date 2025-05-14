// import { SerialPort } from "./serialTypes";
import sendMessage from "./sendMessage"; // Assumes a utility for write/read actions
// import { SettingsData } from "./settingsTypes"; // SettingsData type

export default async function readSettings(): Promise<any> {
  try {
    // Step 1: Handshake
    const heloResponse = await sendMessage(":HELO? [''] 1\r\n", "readSettings");
    if (Array.isArray(heloResponse) && heloResponse.length !== 1) {
      if (heloResponse[0] !== "ACK") {
        console.error("Handshake failed.");
        return null;
      }

      console.log("get measurement");
      await getMeasurement();
      for (let i = 1; i <= 2; i++) {
        console.log("get channel scaling", i);
        await getChannelScaling(i);
        console.log("get channel", i);
        await getChannel(i);
        console.log("get channel alarm", i);
        await getChannelAlarm(i);
      }
      console.log("get powersafe");
      await getPowerSafe();
      console.log("get title");
      await getTitle();
      console.log("get environment");
      await getEnvironment();

      // console.log("Settings successfully retrieved:", settings);
      // return settings;

      return null;
    }
  } catch (error) {
    console.error("Error in receiveSettings:", error);
    return null;
  }
}

async function getTitle() {
  await sendMessage(":COMMENT:TITLE?\r\n", "readSettings");
}

async function getEnvironment() {
  await sendMessage(":CONFIG:FREERUN?\r\n", "readSettings");
  await sendMessage(":CONFIG:EXTRA?\r\n", "readSettings");
}

async function getChannelScaling(channelId: number) {
  await sendMessage(`:SCALING:SET? ${channelId}\r\n`, "readSettings");
}

async function getChannel(channelId: number) {
  await sendMessage(`:UNIT:SET? ${channelId}\r\n`, "readSettings");
}

async function getChannelAlarm(channelId: number) {
  await sendMessage(`:ALARM:SET? ${channelId}\r\n`, "readSettings");
}

async function getPowerSafe() {
  await sendMessage(":CONFIG:TIMER?\r\n", "readSettings");
}

async function getMeasurement() {
  await sendMessage(":CONFIG:SET?\r\n", "readSettings");
  await sendMessage(":CONFIG:ALARM?\r\n", "readSettings");
  await sendMessage(":CONFIG:RESERVE? 1\r\n", "readSettings");
  await sendMessage(":CONFIG:RESERVE? 2\r\n", "readSettings");
}
