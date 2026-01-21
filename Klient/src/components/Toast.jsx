import { useEffect } from "react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        padding: "10px 20px",
        color: "white",
        backgroundColor: type === "success" ? "green" : "red",
        borderRadius: 5,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
      }}
    >
      {message}
    </div>
  );
}
