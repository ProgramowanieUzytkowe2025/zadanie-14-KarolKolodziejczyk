export default function Loader({ active }) {
  if (!active) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        color: "white",
        fontSize: 24
      }}
    >
      Wczytywanie...
    </div>
  );
}