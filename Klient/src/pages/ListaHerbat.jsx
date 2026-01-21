import { useEffect, useState } from "react";
import Kafelek from "../components/Kafelek";
import { useNavigate } from "react-router-dom";

export default function ListaHerbat({ showToast, setLoading }) {
  const [herbaty, setHerbaty] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const load = () => {
    let url = "http://127.0.0.1:8000/herbaty/";
    if (filter === "true") url += "?dostepne=true";
    if (filter === "false") url += "?dostepne=false";

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => setHerbaty(data))
      .catch(() => showToast("Wystąpił błąd przy wczytywaniu", "error"))
      .finally(() => setLoading(false));
  };

  const loadSlow = () => {
    let url = "http://127.0.0.1:8000/herbatySlow/";
    if (filter === "true") url += "?dostepne=true";
    if (filter === "false") url += "?dostepne=false";

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => setHerbaty(data))
      .catch(() => showToast("Wystąpił błąd przy wczytywaniu", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 15 }}>
        <button onClick={() => navigate("/add")} >Dodaj</button>
        <button onClick={loadSlow}> Odśwież (wolno)</button>

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">Wszystkie</option>
          <option value="true">Tylko dostępne</option>
          <option value="false">Tylko niedostępne</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {herbaty.map(h => (
          <Kafelek
            key={h.id}
            herbata={h}
            refresh={load}
            showToast={showToast}
            setLoading={setLoading}
          />
        ))}
      </div>
    </>
  );
}