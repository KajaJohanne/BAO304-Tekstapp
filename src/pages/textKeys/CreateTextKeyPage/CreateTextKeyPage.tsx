import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveDefaultText,
  getAllApplications,
  type TextValues,
  type ApplicationListItem,
} from "../../../../api";
import TextTypeSelector from "../../../components/TextTypeSelector";
import CreateTypeSelector from "../../../components/CreateTypeSelector/CreateTypeSelector";
import TextKeyNameModal from "../../../components/TextKeyNameModal";
import TextKeyPlacementSelector from "../../../components/TextKeyPlacementSelector";
import "./CreateTextKeyPage.css";

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
  };

  // Lagrer tekstnøkkelen i Firebase
  const handleSave = async () => {
    if (!name.trim()) {
      window.alert("Du må fylle inn navn på tekstnøkkelen.");
      return;
    }

    if (!selectedApplicationId) {
      window.alert("Du må velge en applikasjon.");
      return;
    }

    const selectedApplication = applications.find(
      (application) => application.id === selectedApplicationId,
    );

    if (!selectedApplication) {
      window.alert("Fant ikke valgt applikasjon.");
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
      window.alert(`Feil: ${response}`);
    } else {
      navigate("/textkeys");
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
        <p className="create-text-key-page_label">Her kan du lage nye tekstnøkler</p>
            {/* komponent */}
            <CreateTypeSelector />
            {/* komponent */}
            <TextTypeSelector />
            {/* komponent */}
            <TextKeyNameModal
              value={name}
              onSave={setName}
            />
            {/* komponent */}
            <TextKeyPlacementSelector 
              selectedPlacement={selectedPlacement}
              onSavePlacement={setSelectedPlacement}
              textKeyName={name}
            />

            {(selectedPlacement || name) && (
              <div className="text-key-preview">
                <p className="text-key-preview_label">Forhåndsvisning av nøkkel</p>
                <p className="text-key-preview_value">
                  {selectedPlacement && name
                      ? `${selectedPlacement} > ${name}`
                      : selectedPlacement || name || "Ingen nøkkel valgt"}
                </p>
              </div>
            )}

            {/* Midlertidig lagreknapp hvis du vil teste */}
            <button type="button" onClick={handleSave} className="save-main-button">
              Lagre tekstnøkkel
            </button>  
      </div>

    /*<div style={{ padding: "24px", maxWidth: "600px" }}>

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
    </div>*/
  );
};

export default CreateTextKeyPage;
