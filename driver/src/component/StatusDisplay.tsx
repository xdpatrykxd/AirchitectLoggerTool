interface StatusDisplayProps {
  status: boolean;
  deviceName: string;
}

export default function StatusDisplay({
  status,
  deviceName,
}: StatusDisplayProps) {
  return (
    <div className="text-xl font-bold mb-4">
      Status: {status ? `Connected to device: ${deviceName}` : "Not connected"}
    </div>
  );
}
