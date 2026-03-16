import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveApplication } from "../../../../api";

const CreateApplicationPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      window.alert("Du må fylle inn navn på applikasjonen.");
      return;
    }

    const response = await saveApplication({
      name,
      description,
    });

    if (response) {
      window.alert(`Feil: ${response}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <button
        onClick={() => navigate("/applications")}
        style={{ marginBottom: "20px" }}
      >
        ← Tilbake til applikasjoner
      </button>

      <h1>Opprett applikasjon</h1>

      <div style={{ marginBottom: "16px" }}>
        <label>Navn på applikasjon</label>
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="f.eks. Trafikk"
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Beskrivelse</label>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kort beskrivelse av applikasjonen"
          rows={4}
          style={{ width: "100%", maxWidth: "500px" }}
        />
      </div>

      <button onClick={handleSave}>Lagre applikasjon</button>
    </div>
  );
};

export default CreateApplicationPage;
