import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EdytujHerbate({ tryb = "edit" , showToast}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nazwa: "",
    cena: 0,
    dostepne: false
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (tryb === "edit") {
      fetch(`http://127.0.0.1:8000/herbaty/${id}`)
        .then(res => res.json())
        .then(setForm);
    }
  }, [id, tryb]);

    const zapisz = () => {
    const url =
      tryb === "edit"
        ? `http://127.0.0.1:8000/herbaty/${id}`
        : `http://127.0.0.1:8000/herbaty/`;
    const method = tryb === "edit" ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => { throw e; });
        showToast("Poprawnie zapisano zmiany", "success"); 
        navigate("/");
      })
      .catch(err => {
        setError(err.detail || "Wystąpił błąd");
        showToast("Wystąpił błąd", "error");
      });
  };
  return (
    <div>
      <h2>{tryb === "edit" ? "Edytuj" : "Dodaj"} herbatę</h2>

      <input
        placeholder="Nazwa"
        value={form.nazwa}
        onChange={e => setForm({ ...form, nazwa: e.target.value })}
      />

      <input
        type="number"
        value={form.cena}
        onChange={e => setForm({ ...form, cena: Number(e.target.value) })}
      />

      <label>
        <input
          type="checkbox"
          checked={form.dostepne}
          onChange={e => setForm({ ...form, dostepne: e.target.checked })}
        />
        Dostępna
      </label>

      <button onClick={zapisz}>Zapisz</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
