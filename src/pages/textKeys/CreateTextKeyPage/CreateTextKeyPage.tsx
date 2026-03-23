import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  saveDefaultText,
  getAllApplications,
  textKeyExists,
  type TextValues,
  type ApplicationListItem,
  type TextType,
} from "../../../../api";
import TextTypeSelector from "../../../components/TextTypeSelector/TextTypeSelector";
import TextKeyNameModal from "../../../components/TextKeyNameModal/TextKeyNameModal";
import TextKeyPlacementSelector from "../../../components/TextKeyPlacementSelector/TextKeyPlacementSelector";
import CreateTextKeyLanguagePage from "../../../components/CreateTextKeyLanguage/CreateTextKeyLanguage";
import "./CreateTextKeyPage.css";
import type { CreateTextKeyPageState } from "../../../types/createTextKeyPage";

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import type { FormErrors } from "../../../types/formErrors";

const CreateTextKeyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [formData, setFormData] = useState<TextValues>({
    bokmål: "",
    nynorsk: "",
    engelsk: "",
  });
  const [selectedTextType, setSelectedTextType] = useState<TextType | null>(null);    


  const [errors, setErrors] = useState<FormErrors>({});
  const pageState = useMemo(() => {
    if (!location.state) return null;
    return location.state as CreateTextKeyPageState;
  }, [location.state]);
  
  // Validering
  const isFormValid =
  !!name.trim() &&
  !name.trim().includes(" ") &&
  /^[A-Za-zÆØÅæøå]+$/.test(name.trim()) &&
  !!selectedApplicationId &&
  !!selectedPlacement.trim() &&
  !!selectedTextType &&
  !!formData.bokmål.trim() &&
  !!formData.nynorsk.trim() &&
  !!formData.engelsk.trim();

  // Henter alle applikasjoner når siden lastes
  useEffect(() => {
    const fetchApplications = async () => {
      const data = await getAllApplications();
      setApplications(data);

      if (pageState) {
        const application = data.find(
          (app) => app.id === pageState.applicationId
        );
      if (application) {
        setSelectedApplicationId(pageState.applicationId);

        //Henter plasseringen fra subSection siden
        const placement = pageState.subSectionName
          ? `${application.name}.${pageState.sectionName}.${pageState.subSectionName}`
          : `${application.name}.${pageState.sectionName}`;

        setSelectedPlacement(placement);
      }
      // Setter første applikasjon som valgt hvis det finnes noen
    } else if (data.length > 0) {
      setSelectedApplicationId(data[0].id);
    }      
  };

    fetchApplications();
  }, [pageState]);

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

  // Lagrer tekstnøkkelnavn
  const handleNameSave = (value: string) => {
    setName(value);
    setErrors((prev) => ({
      ...prev,
      name: "",
      duplicate: "",
    }));
  };

  // Lagrer tekstnøkkelen i Firebase
  const validateForm = () => {
    const newErrors: FormErrors = {};
    const trimmedValue = name.trim();

    //Validering av navn på tekstnøkkel input felt
    if (!trimmedValue) {
      newErrors.name ="Du må fylle inn navn på tekstnøkkelen.";
    } else if (trimmedValue.includes(" ")) {
      newErrors.name = "Nøkkelen kan ikke inneholde mellomrom.";
    } else if (!/^[A-Za-zÆØÅæøå]+$/.test(trimmedValue)) {
      newErrors.name = "Nøkkelen kan kun inneholde bokstaver.";
    }

    //Valg av applikasjon validering
    if (!selectedApplicationId) {
      newErrors.application = "Du må velge en applikasjon.";
    }

    //Valg av plassering validering
    if (!selectedPlacement.trim()) {
      newErrors.placement = "Du må velge hvor tekstnøkkelen skal ligge.";
    }

    //Valg av teksttype
    if (!selectedTextType) {
      newErrors.textType = "Du må velge en teksttype.";
    }
    //Validering av bokmål input felt
    if (!formData.bokmål.trim()) {
      newErrors.bokmål = "Du må fylle inn bokmål feltet.";
    }

    //Validering av nynorsk input felt
    if (!formData.nynorsk.trim()) {
      newErrors.nynorsk = "Du må fylle inn nynorsk feltet.";
    }

    //Validering av engelsk input felt
    if (!formData.engelsk.trim()) {
      newErrors.engelsk = "Du må fylle inn engelsk feltet.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Lagring, lagrer kun hvis det er gyldig input
  const handleSave = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const selectedApplication = applications.find(
      (application) => application.id === selectedApplicationId,
    );

    if (!selectedApplication) {
      toast.error("Fant ikke valgt applikasjon.");
      return;
    }

    if (!selectedTextType) {
      toast.error("Du må velge en teksttype.");
      return;
    }

    const placementPath = selectedPlacement
      .split(".")
      .map((part) => part.trim())
      .filter(Boolean);
    const fullKeyName = [...placementPath, name.trim()].join(".");

    //Sjekker om tekstnøkkel finnes allerede
    const alreadyExists = await textKeyExists(fullKeyName);

    if (alreadyExists) {
      setErrors((prev) => ({
        ...prev,
        duplicate: "Denne tekstnøkkelen finnes allerede.",
      }));
      return;
    }

    console.log("selectedPlacement:", selectedPlacement);
    console.log("placementPath:", placementPath);
    console.log("fullKeyName:", fullKeyName);

    const response = await saveDefaultText(
      fullKeyName,
      selectedApplication.id,
      selectedApplication.name,
      formData,
      placementPath,
      selectedTextType
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
            <TextTypeSelector
              value={selectedTextType}
              onChange={(type) => {
                setSelectedTextType(type);
                setErrors((prev) => ({
                  ...prev,
                  textType: "",
                }));
              }}
            />
            {errors.textType && (
              <p className="field-error">{errors.textType}</p>
            )}

            {/* komponent */}
            <TextKeyNameModal
              value={name}
              onSave={handleNameSave}
              error={errors.name}
            />
            {errors.name && (
              <p className="field-error">{errors.name}</p>
            )}

            {/* komponent */}
            <TextKeyPlacementSelector 
              applications={applications}
              selectedPlacement={selectedPlacement}
              selectedApplicationId={selectedApplicationId}
              onSavePlacement={(placement) => {
                setSelectedPlacement(placement);
                setErrors((prev) => ({
                  ...prev,
                  placement: "",
                  duplicate: "",
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

            {/* Forhåndsvisning av nøkkel navnet */}
            {(selectedPlacement || name) && (
              <div className="text-key-preview">
                <p className="text-key-preview_label">Forhåndsvisning av nøkkelnavn</p>
                <p className="text-key-preview_value">
                  {selectedPlacement && name
                      ? `${selectedPlacement}.${name}`
                      : selectedPlacement || name || "Ingen nøkkel valgt"}
                </p>
              </div>
            )}

            {errors.duplicate && (
              <p className="field-error">{errors.duplicate}</p>
            )}

            {/* Input felt for bokmål, nynorsk og engelsk */}
            <CreateTextKeyLanguagePage
              values={formData}
              onChange={handleChange}
              errors={errors}
            />

            {/* Lagreknapp */}
            <button  
              type="button" 
              onClick={handleSave}
              className="save-main-button" 
              disabled={!isFormValid}
            >
              Lagre tekstnøkkel
            </button>  

            {/* Toast melding */}
            <ToastContainer position="top-center" autoClose={8000} />
      </div>
  );
};

export default CreateTextKeyPage;
