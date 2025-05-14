import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
import GetMeasurementData from "./utils/getMeasurementData";
import serialHandler from "./utils/serialHandler";
import ActionButton from "./component/ActionButton";
import StatusDisplay from "./component/StatusDisplay";
import readClock from "./utils/readClock";
import readSettings from "./utils/readSettings";
import sendSettings from "./utils/sendSettings";
import setClock from "./utils/setClock";
import startDevice from "./utils/startDevice";
import stopDevice from "./utils/stopDevice";

function App() {
  const [status, setStatus] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [device, setDevice] = useState<string>("");

  const handleConnect = async () => {
    await serialHandler.init();
    await serialHandler.write("*IDN?\r\n");
    let device = await serialHandler.read();
    setDevice(device);
    setStatus(true);
    // serialHandler.getSupportedCommands();
  };

  const handleGetMeasurementData = async () => {
    const [success, receivedData] = await GetMeasurementData();
    if (success) {
      setData(receivedData);
      console.log("Received Data:", data);
    } else {
      console.error("Failed to get measurement data.");
    }
  };
  const actions = [
    { name: "getMeasurementData", handler: () => handleGetMeasurementData() },
    { name: "readClock", handler: () => readClock() },
    { name: "setClock", handler: () => setClock() },
    { name: "readSettings", handler: () => readSettings() },
    { name: "sendSettings", handler: () => sendSettings(device) },
    { name: "startDevice", handler: () => startDevice() },
    { name: "stopDevice", handler: () => stopDevice() },
  ];
  return (
    <div className="container mx-auto p-4">
      <StatusDisplay status={status} deviceName={device} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <ActionButton
          label={"Connect"}
          onClick={handleConnect}
          disabled={status}
        />
        {actions.map((action) => (
          <ActionButton
            key={action.name}
            label={action.name}
            onClick={action.handler}
            disabled={!status}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
