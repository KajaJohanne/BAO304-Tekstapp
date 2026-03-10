import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTextKey,
  updateEnviormentText,
  type Environment,
  type TextKeyDocument,
  type TextValues,
  type User,
} from "../../../../api";

const TextKeyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [textKey, setTextKey] = useState<TextKeyDocument | null>(null);
  const [allowedEnvironments, setAllowedEnvironments] = useState<Environment[]>(
    [],
  );
  const [currentEnvironment, setCurrentEnvironment] =
    useState<Environment | null>(null);

  const [formData, setFormData] = useState<TextValues>({
    bokmål: "",
    nynorsk: "",
    engelsk: "",
  });

  // Henter innlogget bruker fra localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setAllowedEnvironments(parsedUser.allowedEnvironments);

      if (parsedUser.allowedEnvironments.length > 0) {
        setCurrentEnvironment(parsedUser.allowedEnvironments[0]);
      }
    }
  }, []);

  // Henter tekstnøkkelen fra Firebase
  useEffect(() => {
    const fetchTextKey = async () => {
      if (!id) return;

      const data = await getTextKey(id);

      if (data) {
        setTextKey(data);
      }
    };

    fetchTextKey();
  }, [id]);

  // Oppdaterer feltene når tekstnøkkel eller miljø endrer seg
  useEffect(() => {
    if (!textKey || !currentEnvironment) return;

    const environmentData = textKey.environments[currentEnvironment];

    setFormData({
      bokmål: environmentData.bokmål || textKey.default.bokmål,
      nynorsk: environmentData.nynorsk || textKey.default.nynorsk,
      engelsk: environmentData.engelsk || textKey.default.engelsk,
    });
  }, [textKey, currentEnvironment]);

  // Oppdaterer input-feltene når brukeren skriver
  const handleChange = (field: keyof TextValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Lagrer tekst for valgt miljø
  const handleSave = async () => {
    if (!id || !currentEnvironment) return;

    const response = await updateEnviormentText(
      id,
      currentEnvironment,
      formData,
    );

    if (response) {
      window.alert(`Feil: ${response}`);
    } else {
      window.alert("Miljøtekst lagret");

      const updatedTextKey = await getTextKey(id);
      if (updatedTextKey) {
        setTextKey(updatedTextKey);
      }
    }
  };

  if (!textKey) {
    return <div style={{ padding: "24px" }}>Laster tekstnøkkel...</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <button
        onClick={() => navigate("/textkeys")}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          cursor: "pointer",
        }}
      >
        ← Tilbake til tekstnøkler
      </button>
      <h1>{textKey.name}</h1>

      <div style={{ marginBottom: "24px" }}>
        <h3>Velg miljø</h3>

        <div style={{ display: "flex", gap: "12px" }}>
          {allowedEnvironments.map((environment) => (
            <button
              key={environment}
              onClick={() => setCurrentEnvironment(environment)}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor:
                  currentEnvironment === environment ? "#ddd" : "#fff",
                cursor: "pointer",
              }}
            >
              {environment.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {currentEnvironment && (
        <>
          <p>
            Du redigerer nå miljø:{" "}
            <strong>{currentEnvironment.toUpperCase()}</strong>
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label>Bokmål</label>
            <br />
            <input
              type="text"
              value={formData.bokmål}
              onChange={(e) => handleChange("bokmål", e.target.value)}
              style={{ width: "100%", maxWidth: "500px" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Nynorsk</label>
            <br />
            <input
              type="text"
              value={formData.nynorsk}
              onChange={(e) => handleChange("nynorsk", e.target.value)}
              style={{ width: "100%", maxWidth: "500px" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Engelsk</label>
            <br />
            <input
              type="text"
              value={formData.engelsk}
              onChange={(e) => handleChange("engelsk", e.target.value)}
              style={{ width: "100%", maxWidth: "500px" }}
            />
          </div>

          <button onClick={handleSave}>Lagre endringer</button>
        </>
      )}
    </div>
  );
};

export default TextKeyDetailPage;
