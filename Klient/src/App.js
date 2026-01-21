import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaHerbat from "./pages/ListaHerbat";
import EdytujHerbate from "./pages/EdytujHerbate";
import { useState } from "react";
import Toast from "./components/Toast";
import Loader from "./components/Loader";

function App() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const setLoadingOn = (active) => {
    setLoading(active);
  };

  return (
    <BrowserRouter>
      <Loader active={loading} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ListaHerbat
              showToast={showToast}
              setLoading={setLoadingOn}
            />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <EdytujHerbate
              showToast={showToast}
              setLoading={setLoadingOn}
              tryb="edit"
            />
          }
        />
        <Route
          path="/add"
          element={
            <EdytujHerbate
              showToast={showToast}
              setLoading={setLoadingOn}
              tryb="add"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
