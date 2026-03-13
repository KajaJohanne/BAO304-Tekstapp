import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TextKeyDetailPage.css";

import {
  getTextKey,
  updateEnviormentText,
  type Environment,
  type TextKeyDocument,
  type TextValues,
  type User,
} from "../../../../api";

const TextKeyDetailPage = () => {
  // Henter id fra URL
  const { id } = useParams();

  // Navigasjon mellom sider
  const navigate = useNavigate();

  // Valgt tekstnøkkel
  const [textKey, setTextKey] = useState<TextKeyDocument | null>(null);

  // Miljøer brukeren har tilgang til
  const [allowedEnvironments, setAllowedEnvironments] =
    useState<Environment[]>([]);

  // Hvilket miljø som er valgt
  const [currentEnvironment, setCurrentEnvironment] =
    useState<Environment | null>(null);

  // Tekstfeltene som kan redigeres
  const [formData, setFormData] = useState<TextValues>({
    bokmål: "",
    nynorsk: "",
    engelsk: "",
  });

  // Henter bruker fra localStorage
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

  // Henter tekstnøkkel fra databasen
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

  // Oppdaterer tekstfeltene når miljø endres
  useEffect(() => {
    if (!textKey || !currentEnvironment) return;

    const environmentData = textKey.environments[currentEnvironment];

    setFormData({
      bokmål: environmentData.bokmål || textKey.default.bokmål,
      nynorsk: environmentData.nynorsk || textKey.default.nynorsk,
      engelsk: environmentData.engelsk || textKey.default.engelsk,
    });
  }, [textKey, currentEnvironment]);

  // Oppdaterer state når bruker skriver
  const handleChange = (field: keyof TextValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Lagrer endringer
  const handleSave = async () => {
    if (!id || !currentEnvironment) return;

    const response = await updateEnviormentText(
      id,
      currentEnvironment,
      formData
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

  // Laster tekstnøkkel
  if (!textKey) {
    return <div className="container">Laster tekstnøkkel...</div>;
  }

  // Tom-state: sjekker om alle tekstfeltene er tomme
  const noText =
    !formData.bokmål && !formData.nynorsk && !formData.engelsk;

  return (
    <div className="container">

      {/* Tilbakeknapp */}
      <button
        className="backButton"
        onClick={() => navigate("/textkeys")}
      >
        ← Tilbake til tekstnøkler
      </button>

      {/* Tittel */}
      <h1 className="title">Rediger tekstnøkkel</h1>

      <p className="subtitle">
        Her kan du redigere tekstnøkkelen
      </p>

      {/* Navn på tekstnøkkel */}
      <h2 className="textKeyName">{textKey.name}</h2>

      {/* Miljøvalg */}
      <div className="environmentSection">
        <h3>Velg miljø</h3>

        <div className="environmentButtons">
          {allowedEnvironments.map((environment) => (
            <button
              key={environment}
              onClick={() => setCurrentEnvironment(environment)}
              className={`environmentButton ${
                currentEnvironment === environment ? "active" : ""
              }`}
            >
              {environment.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {currentEnvironment && (
        <>
          <p className="currentEnvironment">
            Du redigerer nå miljø:{" "}
            <strong>{currentEnvironment.toUpperCase()}</strong>
          </p>

          {/* Tom state melding */}
          {noText && (
            <p className="emptyState">
              Ingen tekst finnes for dette miljøet enda. Legg til tekst under.
            </p>
          )}

          {/* Bokmål */}
          <div className="inputGroup">
            <label>Bokmål</label>
            <input
              type="text"
              className="textInput"
              value={formData.bokmål}
              onChange={(e) =>
                handleChange("bokmål", e.target.value)
              }
            />
          </div>

          {/* Nynorsk */}
          <div className="inputGroup">
            <label>Nynorsk</label>
            <input
              type="text"
              className="textInput"
              value={formData.nynorsk}
              onChange={(e) =>
                handleChange("nynorsk", e.target.value)
              }
            />
          </div>

          {/* Engelsk */}
          <div className="inputGroup">
            <label>Engelsk</label>
            <input
              type="text"
              className="textInput"
              value={formData.engelsk}
              onChange={(e) =>
                handleChange("engelsk", e.target.value)
              }
            />
          </div>

          {/* Knapper */}
          <div className="buttonRow">
            <button
              className="saveButton"
              onClick={handleSave}
            >
              Lagre
            </button>

            <button
              className="cancelButton"
              onClick={() => navigate("/textkeys")}
            >
              Avbryt
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TextKeyDetailPage;