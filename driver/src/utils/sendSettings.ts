import sendMessage from "./sendMessage";
import { SettingsData } from "../types"; // Assume types are defined for SettingsData and its related structures

/**
 * Sends settings to the device.
 * @param settings - The settings data to send.
 * @returns A promise resolving to a boolean indicating success or failure.
 */
export default async function sendSettings(deviceName: string): Promise<any> {
  try {
    console.log("Initiating settings transmission...");

    // HELO handshake
    const heloResponse = await sendMessage(":HELO? [''] 1\r\n", "sendSettings");
    if (Array.isArray(heloResponse) && heloResponse.length !== 1) {
      if (heloResponse[0] !== "ACK") {
        throw new Error("Device did not acknowledge the HELO command.");
      }

      await setTitle("The settings is not implemented");
    }

    // Figure out how to get the settings data
  } catch (error) {
    console.error("Error in sendSettings:", error);
    return false;
  }
}

async function setTitle(title: string) {
  await sendMessage(`:COMMENT:TITLE ${title}\r\n`, "sendSettings");
}

async function setMeasurement() {
  let _burnout = 0; // burnout detection flag
  let _supress = 0; // zero suppression flag
  let _recmode = 0; // recording mode
  let _cont_rec = 1; // 1 = on 0 = off
  let _rec_interval = 5; // 5 = 5 seconds
  let _dig_filter = 2; // filter configuration
  await sendMessage(
    `:CONFIG:SET ${_recmode},${_cont_rec},${_rec_interval},${_dig_filter},${_burnout},${_supress}\r\n`,
    "sendSettings"
  );

  // ALARM
  let _alarm_hold = 1; // alarm hold
  let _alarm_condition = 2; // Specifies the condition to trigger alarms.
  await sendMessage(
    `:CONFIG:ALARM ${_alarm_hold},${_alarm_condition},0,0\r\n`,
    "sendSettings"
  );

  // Scheduled start
  let _enabled = 0; // 0 = off 1 = on
  let _year = 0;
  let _month = 0;
  let _day = 0;
  let _hour = 0;
  let _minute = 0;
  await sendMessage(
    `:CONFIG:RESERVE 1,${_enabled},${_year},${_month},${_day},${_hour},${_minute}\r\n`,
    "sendSettings"
  );

  // Scheduled stop
  await sendMessage(
    `:CONFIG:RESERVE 2,${_enabled},${_year},${_month},${_day},${_hour},${_minute}\r\n`,
    "sendSettings"
  );
}

async function setChannelScaling(channelId: number) {
  let scaling_choice = 0; // indicates the type of scaling applied
  let method = 0; // specifies scaling method
  let ratio = ""; // scaling ratio
  let offset = ""; // scaling offset
  let input1 = ""; // input 1
  let input2 = ""; // input 2
  let output1 = ""; // output 1
  let output2 = ""; // output 2
  let places_devices = 0; // Decimal precision of scaled values
  let auxiliary_unit = 0; // Indicates if auxiliary units are used
  let units = ""; // Indicates the unit of measurement

  // Note: The values have to use . instead of , for decimal points

  await sendMessage(
    `:SCALING:SET ${channelId},${scaling_choice},${method},${ratio},${offset},${input1},${input2},${output1},${output2},${places_devices},${auxiliary_unit},${units}\r\n`,
    "sendSettings"
  );
}

async function setChannel(channelId: number, model: string) {
  let num = 0; // 0 = false, 1 = true
  let inputType = 0;
  let range = 0;
  let filter = 0;
  let RJC = 0;
  let currentSensor = 0;
  if (model != "L8515")
    await sendMessage(
      `:UNIT:SET ${channelId},${num},${inputType},${range},${filter},${currentSensor}\r\n`,
      "sendSettings"
    );
  else
    await sendMessage(
      `:UNIT:SET ${channelId},${num},${inputType},${range},${RJC},${currentSensor}\r\n`,
      "sendSettings"
    );
}
async function setChannelAlarm(channelId: number) {
  let alarmSetting = 0;
  let alarmMethod = 0;
  let alarmLevel = 0;
  let alarmLevelStatus = 0;
  let upperLimit = 0;
  let lowerLimit = 0;
  await sendMessage(
    `:ALARM:SET? ${channelId},${alarmSetting},${alarmMethod},${alarmLevel},${alarmLevelStatus},${upperLimit},${lowerLimit}\r\n`,
    "sendSettings"
  );
}

async function setPowerSafe() {
  /* 
    will probably have a DayOfTheWeek with a list of numbers representing the days of the week.
    will have to write a function to return a hexadecimal representation of the selected days of the week
    same for the DayOfTheMonth

    let str1 = ""
    for i in DayOfTheWeek:
     str1 += i.toString()
    let str2 = ""
    for i in DayOfTheMonth:
     str2 += i.toString()

    let num1 = parseInt(str1, 2);
    let str3 = num1.toString(16); // turn to base16 (hexadecimal)
    num1 = parseInt(str2, 2);
    let str4 = num1.toString(16); // turn to base16 (hexadecimal)
   */
  let schedule = 1;
  let hex_day_of_week = 0x7f; // hexadecimal presentation of the selected days of the week
  let hex_day_of_month = 0x1f; // hexadecimal presentation of the selected days of the month
  let start_hour = 0; // start communication time (hour)
  let start_minute = 0; // start communication time (minute)
  let reception_time = 0; // durtation (in minutes) during which the device is in the reception mode

  await sendMessage(
    `:CONFIG:TIMER ${schedule},${hex_day_of_week},${hex_day_of_month},${start_hour},${start_minute},${reception_time}\r\n`,
    "sendSettings"
  );
}

async function setEnvironment() {
  // Depends on environmentDevice. 0 = false, 1 = true;
  await sendMessage(`:CONFIG:FREERUN 0\r\n`, "sendSettings");
  await sendMessage(`:CONFIG:EXTRA 0\r\n`, "sendSettings");
}
