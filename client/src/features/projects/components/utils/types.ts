export default interface HiokiJson {
  success: boolean;
  receivedData: {
    deviceModel: string;
    memoryTime: string;
    systemTime: string;
    interval: number;
    flag: boolean;
    channelData: Array<{
      memoryUnit: string[];
      scalingSet: string[];
    }>;
    sampleData: number[][];
  };
}
export interface Measurement {
  RecordingInterval?: number;
  ContinuousRecording?: number;
  DigitalFilter?: number;
  TitleComment?: string;
  ScheduledRecordStart?: boolean;
  StartTime?: Date | null;
  ScheduledRecordStop?: boolean;
  StopTime?: Date | null;
  AlarmSetting?: number;
  AlarmHold?: number;
  AlarmCondition?: number;
}

export interface Scaling {
  ScalingChoice: number;
  Units: string;
  PlacesDevices: number;
  AuxiliaryUnit: number;
  Method: number;
  Voltage: string;
  PowerFactor: string;
  Ratio: string;
  Offset: string;
  Input1: string;
  Output1: string;
  Input2: string;
  Output2: string;
}

export interface Channel {
  Comment: string;
  Measurement: boolean;
  ZeroSuppres: number;
  InputType: number;
  RecMode: number;
  CurrentSensor: number;
  BurnoutDetection: number;
  Range: number;
  Filter: number;
  Thermocouple: number;
  RJC: number;
}

export interface Alarm {
  AlarmMethod: number;
  AlarmLevel: number;
  AlarmLevelStatus: number;
  UpperLimit: number;
  LowerLimit: number;
}

export interface ChannelDevice {
  Id?: number;
  ChannelName?: string;
  ChannelCh?: Channel;
  ScalingCh?: Scaling | null;
  DeviceAlarm?: Alarm | null;
}

export interface PowerSave {
  Schedule: number;
  StartCommunication: Date;
  ReceptionTime: number;
  DayOfTheWeek: number[];
  DayOfTheMonth: number[];
}

export interface EnvironmentSetting {
  WrongKey: boolean;
  StartBackup: boolean;
  FreeRunning: boolean;
}

export interface SettingsData {
  DeviceName?: string;
  IsAuthenticated?: boolean; // Web Serial devices don't have explicit auth; keep for compatibility
  IsConnected?: boolean;
  LastSeen?: Date; // Could be tracked in app logic
  LastUsed?: Date; // Could be tracked in app logic
  SerialPort?: string; // Web Serial API port reference
  Model?: string;
  Serial?: string;
  Status?: string;
  DeviceMeasurement?: Measurement | null;
  ChannelList?: ChannelDevice[] | any | null;
  DevicePowerSave?: PowerSave | null;
  DeviceEnvironment?: EnvironmentSetting | null;
}

export interface MeasurementData {
  header: {
    deviceId: number;
    logStartTime: number;
    logInterval: number;
  };
  measurements: number[][];
}

export interface Command {
  message: string;
  label: string;
  resolve: (value: string[] | object) => void;
  reject: (reason?: any) => void;
}
