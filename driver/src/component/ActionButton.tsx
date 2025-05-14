"use client";

import { useState } from "react";

interface ActionButtonProps {
  label: string;
  onClick: () => Promise<any>;
  disabled?: boolean;
}

export default function ActionButton({
  label,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  const [messages, setMessages] = useState<string[]>([]);

  const handleClick = async () => {
    if (label === "Connect") {
      try {
        const sentMessage = `Opening port`;
        setMessages((prev) => [...prev, sentMessage]);

        const response = await onClick();
        setMessages((prev) => [...prev, `Port successfully opened`]);
      } catch (error) {
        setMessages((prev) => [...prev, `Error: ${error}`]);
      }
    } else {
      try {
        const sentMessage = `Sent: ${label} action`;
        setMessages((prev) => [...prev, sentMessage]);

        const response = await onClick();
        setMessages((prev) => [...prev, `Response: ${response}`]);
      } catch (error) {
        setMessages((prev) => [...prev, `Error: ${error}`]);
      }
    }
  };

  return (
    <div className="border p-4 rounded">
      <button
        className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
        onClick={handleClick}
        disabled={disabled}
      >
        {label}
      </button>
      <div className="mt-2">
        <textarea
          className="w-full h-[500px] p-2 border rounded resize-none font-mono text-sm"
          id={`${label}-messages`}
          readOnly
          placeholder="Messages and responses will appear here"
        />
      </div>
    </div>
  );
}
