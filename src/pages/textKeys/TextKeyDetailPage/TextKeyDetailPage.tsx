import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TextKeyDetailPage.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify"
import {
  getTextKey,
  updateEnviormentText,
  type Environment,
  type TextKeyDocument,
  type TextValues,
  type User,
} from "../../../../api";

import CreateTextKeyLanguagePage from "../../../components/CreateTextKeyLanguage/CreateTextKeyLanguage";

const TextKeyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [textKey, setTextKey] = useState<TextKeyDocument | null>(null);
  const [allowedEnvironments, setAllowedEnvironments] =
    useState<Environment[]>([]);
  const [currentEnvironment, setCurrentEnvironment] =
    useState<Environment | null>(null);

  const [formData, setFormData] = useState<TextValues>({
    bokmål: "",
    nynorsk: "",
    engelsk: "",
  });

  // Hent bruker
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

  // Hent tekstnøkkel
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

  // Sett formData når miljø endres
  useEffect(() => {
    if (!textKey || !currentEnvironment) return;

    const environmentData = textKey.environments[currentEnvironment];

    setFormData({
      bokmål: environmentData.bokmål || textKey.default.bokmål,
      nynorsk: environmentData.nynorsk || textKey.default.nynorsk,
      engelsk: environmentData.engelsk || textKey.default.engelsk,
    });
  }, [textKey, currentEnvironment]);

  // Input change
  const handleChange = (field: keyof TextValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSave = async () => {
    if (!id || !currentEnvironment) return;

    const response = await updateEnviormentText(
      id,
      currentEnvironment,
      formData
    );

    if (response) {
      toast.error(`Feil: ${response}`);
      return;
    }

    toast.success("Endringer lagret");

    //  Oppdater UI direkte 
    setTextKey((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        environments: {
          ...prev.environments,
          [currentEnvironment]: {
            ...prev.environments[currentEnvironment],
            ...formData,
          },
        },
      };
    });
  };

  if (!textKey) {
    return <div className="container">Laster tekstnøkkel...</div>;
  }

  const noText =
    !formData.bokmål && !formData.nynorsk && !formData.engelsk;

  return (
    <div className="container">

      {/* Breadcrumb */}
      <p
        className="backLink"
        onClick={() => navigate("/textkeys")}
      >
        ← Tekstnøkler
      </p>

      {/* Tittel */}
      <h1 className="title">Rediger tekstnøkkel</h1>
      <p className="subtitle">Her kan du redigere tekstnøkkelen</p>

      {/* Navn */}
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
      <ToastContainer position="top-center" autoClose={3000} />
      {currentEnvironment && (
        <>
          <p className="currentEnvironment">
            Du redigerer nå miljø:{" "}
            <strong>{currentEnvironment.toUpperCase()}</strong>
          </p>

          {/* Tom state */}
          {noText && (
            <p className="emptyState">
              Ingen tekst finnes for dette miljøet enda. Legg til tekst under.
            </p>
          )}

          {/* Språk komponent */}
          <CreateTextKeyLanguagePage
            values={formData}
            onChange={handleChange}
            errors={{}}
          />

          {/* Knapper */}
          <div className="buttonRow">
            <button className="saveButton" onClick={handleSave}>
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