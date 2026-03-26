import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TextKeyDetailPage.css";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@digdir/designsystemet-react";
import { PencilIcon } from "@navikt/aksel-icons";
import { toast, ToastContainer } from "react-toastify";

import {
  getTextKey,
  updateEnviormentText,
  updateTextKeyName,
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

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [nameError, setNameError] = useState("");

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
      if (data) setTextKey(data);
    };

    fetchTextKey();
  }, [id]);

  // Sett formData
  useEffect(() => {
    if (!textKey || !currentEnvironment) return;

    const environmentData = textKey.environments[currentEnvironment];

    setFormData({
      bokmål: environmentData.bokmål || textKey.default.bokmål,
      nynorsk: environmentData.nynorsk || textKey.default.nynorsk,
      engelsk: environmentData.engelsk || textKey.default.engelsk,
    });
  }, [textKey, currentEnvironment]);

  const handleChange = (field: keyof TextValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validering
  const validateName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "Du må fylle inn navn på tekstnøkkelen.";
    if (trimmed.includes(" ")) return "Nøkkelen kan ikke inneholde mellomrom.";
    if (!/^[A-Za-zÆØÅæøå]+$/.test(trimmed))
      return "Nøkkelen kan kun inneholde bokstaver.";

    return "";
  };

  const [fieldErrors, setFieldErrors] = useState<Partial<TextValues>>({});

  const validateFields = () => {
    const errors: Partial<TextValues> = {};

    if (!formData.bokmål.trim()) {
      errors.bokmål = "Bokmål feltet kan ikke være tomt.";
    }

    if (!formData.nynorsk.trim()) {
      errors.nynorsk = "Nynorsk feltet kan ikke være tomt.";
    }

    if (!formData.engelsk.trim()) {
      errors.engelsk = "Engelsk feltet kan ikke være tomt.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Lagre tekst
  const handleSave = async () => {
    if (!id || !currentEnvironment) return;

    const isValid = validateFields();
    if (!isValid) {
      toast.error("Fyll inn alle feltene før du lagrer.");
      return;
    }

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
      <button
    className="back-button"
    onClick={() => navigate(-1)}
      >
    <span className="back-arrow">‹</span>
    <span className="back-text">Tekstnøkler</span>
  </button>

      <h1 className="title">Rediger tekstnøkkel</h1>
      <p className="subtitle">Her kan du redigere tekstnøkkelen</p>

      {/* Navn og redigering */}
     <div className="headerRow">
    <div className="nameSection">
    {isEditingName ? (
      <>
        <input
          className="editInput"
          value={editedName}
          onChange={(e) => {
            setEditedName(e.target.value);
            setNameError("");
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              const error = validateName(editedName);

              if (error) {
                setNameError(error);
                return;
              }

              const response = await updateTextKeyName(id!, editedName);

              if (response) {
                toast.error(`Feil: ${response}`);
                return;
              }

              setTextKey((prev) => {
                if (!prev) return prev;
                return { ...prev, name: editedName };
              });

              setIsEditingName(false);
              toast.success("Navn lagret");
            }

            if (e.key === "Escape") {
              setIsEditingName(false);
              setNameError("");
            }
          }}
          autoFocus
        />

        <p className="field-error">{nameError || ""}</p>
      </>
    ) : (
      <h2 className="textKeyName">{textKey.name}</h2>
    )}
  </div>

  <Button
  className="iconButton"
  aria-label={isEditingName ? "Lagre" : "Rediger"}
  onClick={async () => {
    if (isEditingName) {
      const error = validateName(editedName);

      if (error) {
        setNameError(error);
        return;
      }

      const response = await updateTextKeyName(id!, editedName);

      if (response) {
        toast.error(`Feil: ${response}`);
        return;
      }

      setTextKey((prev) => {
        if (!prev) return prev;
        return { ...prev, name: editedName };
      });

      setIsEditingName(false);
      toast.success("Navn lagret");
    } else {
      setIsEditingName(true);
      setEditedName(textKey.name);
    }
  }}
>
  {isEditingName ? "Lagre" : <PencilIcon aria-hidden />}
</Button>
</div>

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
            Du redigerer nå i:{" "}
            <strong>{currentEnvironment.toUpperCase()}</strong>
          </p>

          {noText && (
            <p className="emptyState">
              Ingen tekst finnes for denne tekstnøkkelen enda.
            </p>
          )}

          <CreateTextKeyLanguagePage
            values={formData}
            onChange={handleChange}
            errors={fieldErrors}
          />

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