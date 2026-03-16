import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveDefaultText,
  getAllApplications,
  type TextValues,
  type ApplicationListItem,
} from "../../../../api";
import TextTypeSelector from "../../../components/TextTypeSelector/TextTypeSelector";
import TextKeyNameModal from "../../../components/TextKeyNameModal/TextKeyNameModal";
import TextKeyPlacementSelector from "../../../components/TextKeyPlacementSelector/TextKeyPlacementSelector";
import CreateTextKeyLanguagePage from "../../../components/CreateTextKeyLanguage/CreateTextKeyLanguage";
import "./CreateTextKeyPage.css";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import type { FormErrors } from "../../../types/formErrors";

const CreateTextKeyPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [formData, setFormData] = useState<TextValues>({
    bokmål: "",
    nynorsk: "",
    engelsk: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Henter alle applikasjoner når siden lastes
  useEffect(() => {
    const fetchApplications = async () => {
      const data = await getAllApplications();
      setApplications(data);

      // Setter første applikasjon som valgt hvis det finnes noen
      if (data.length > 0) {
        setSelectedApplicationId(data[0].id);
      }
    };

    fetchApplications();
  }, []);

  // Oppdaterer riktig felt når brukeren skriver
  const handleChange = (field: keyof TextValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleNameSave = (value: string) => {
    setName(value);
    setErrors((prev) => ({
      ...prev,
      name: "",
    }));
  };

  // Lagrer tekstnøkkelen i Firebase
  const validateForm = async () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name ="Du må fylle inn navn på tekstnøkkelen.";
    }

    if (!selectedApplicationId) {
      newErrors.application = "Du må velge en applikasjon.";
    }

    if (!selectedPlacement.trim()) {
      newErrors.placement = "Du må velge hvor tekstnøkkelen skal ligge.";
    }

    if (!formData.bokmål.trim()) {
      newErrors.bokmål = "Du må fylle inn bokmål feltet.";
    }

    if (!formData.nynorsk.trim()) {
      newErrors.nynorsk = "Du må fylle inn nynorsk feltet.";
    }

    if (!formData.engelsk.trim()) {
      newErrors.engelsk = "Du må fylle inn engelsk feltet.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const selectedApplication = applications.find(
      (application) => application.id === selectedApplicationId,
    );

    if (!selectedApplication) {
      toast.error("Fant ikke valgt applikasjon.");
      return;
    }

    const fullKeyName = `${selectedPlacement} > ${name}`;

    const response = await saveDefaultText(
      fullKeyName,
      selectedApplication.id,
      selectedApplication.name,
      formData,
    );

    if (response) {
      toast.error(`Feil: ${response}`);
    } else {
      toast.success("Tekstnøkkel ble lagret!");

      setTimeout(() => {
        navigate("/textkeys");
      }, 1500);
    }
  };

  return (
    <div className="create-text-key-page_content">
      {/* Tilbake knapp, tilbake til tekstnøkler */}
      <button
        onClick={() => navigate("/textkeys")}
        className="back-button"
      >
        <span className="back-arrow">‹</span>
        <span className="back-text">Tilbake til tekstnøkler</span>
      </button>

      <h1 className="create-text-key-page_title">Legg til ny tekstnøkkel</h1>
        <p className="create-text-key-page_label">Her kan du lage nye tekstnøkler </p>
            {/* komponent */}
            <TextTypeSelector />
            {/* komponent */}
            <TextKeyNameModal
              value={name}
              onSave={handleNameSave}
              error={errors.name}
            />
            {/* komponent */}
            <TextKeyPlacementSelector 
              applications={applications}
              selectedPlacement={selectedPlacement}
              onSavePlacement={(placement) => {
                setSelectedPlacement(placement);
                setErrors((prev) => ({
                  ...prev,
                  placement: "",
                }));
              }}
              onSelectApplication={(applicationId) => {
                setSelectedApplicationId(applicationId)
                setErrors((prev) => ({
                  ...prev,
                  application: "",
                }));
              }}
              textKeyName={name}
            />
            
            {errors.application && (
              <p className="field-error">{errors.application}</p>
            )}

            {errors.placement && (
              <p className="field-error">{errors.placement}</p>
            )}

            {(selectedPlacement || name) && (
              <div className="text-key-preview">
                <p className="text-key-preview_label">Forhåndsvisning av nøkkelnavn</p>
                <p className="text-key-preview_value">
                  {selectedPlacement && name
                      ? `${selectedPlacement} > ${name}`
                      : selectedPlacement || name || "Ingen nøkkel valgt"}
                </p>
              </div>
            )}

            {/* Input felt for bokmål, nynorsk og engelsk */}
            <CreateTextKeyLanguagePage
              values={formData}
              onChange={handleChange}
              errors={errors}
            />

            {/* Lagreknapp */}
            <button type="button" onClick={handleSave} className="save-main-button">
              Lagre tekstnøkkel
            </button>  

            {/* Toast melding */}
            <ToastContainer position="top-center" autoClose={8000} />
      </div>
  );
};

export default CreateTextKeyPage;
