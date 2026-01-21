import { useNavigate } from "react-router-dom";

export default function Kafelek({ herbata, refresh, showToast, setLoading }) {
  const navigate = useNavigate();

    const usun = () => {
  const potwierdz = window.confirm(
    `Czy na pewno chcesz usunąć herbatę "${herbata.nazwa}"?`
  );
  if (!potwierdz) return;

  setLoading(true);
  fetch(`http://127.0.0.1:8000/herbaty/${herbata.id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) return res.json().then(e => { throw e; });
      refresh();
      showToast("Poprawnie zapisano zmiany", "success");
    })
    .catch(err => {
      showToast("Wystąpił błąd", "error");
    })
    .finally(() => setLoading(false)); 
};

  return (
    <div style={{ border: "1px solid black", padding: 15, width: 200 }}>
      <p><b>Nazwa:</b> {herbata.nazwa}</p>
      <p><b>Cena:</b> {herbata.cena} zł</p>
      <p><b>Dostępna:</b> {herbata.dostepne ? "TAK" : "NIE"}</p>

      <button onClick={() => navigate(`/edit/${herbata.id}`)}>Edytuj</button>
      <button onClick={usun}>Usuń</button>
    </div>
  );
}
