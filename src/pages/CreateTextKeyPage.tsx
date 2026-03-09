import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveDefaultText, type TextValues } from "../../api";

const CreateTextKeyPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [formData, setFormData] = useState<TextValues>({
    bokmål: "",
    nynorsk: "",
    engelsk: "",
  });

  const handleChange = (field: keyof TextValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      window.alert("Du må fylle inn navn på tekstnøkkelen.");
      return;
    }

    const response = await saveDefaultText(name, formData);

    if (response) {
      window.alert(`Feil: ${response}`);
    } else {
      window.alert("Tekstnøkkel opprettet!");
      navigate("/textkeys");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <h1>Opprett tekstnøkkel</h1>

      <div style={{ marginBottom: "16px" }}>
        <label>Navn på tekstnøkkel</label>
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="f.eks. Trafikkmeldinger"
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Bokmål</label>
        <br />
        <input
          type="text"
          value={formData.bokmål}
          onChange={(e) => handleChange("bokmål", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Nynorsk</label>
        <br />
        <input
          type="text"
          value={formData.nynorsk}
          onChange={(e) => handleChange("nynorsk", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Engelsk</label>
        <br />
        <input
          type="text"
          value={formData.engelsk}
          onChange={(e) => handleChange("engelsk", e.target.value)}
        />
      </div>

      <button onClick={handleSave}>Lagre tekstnøkkel</button>
    </div>
  );
};

export default CreateTextKeyPage;
