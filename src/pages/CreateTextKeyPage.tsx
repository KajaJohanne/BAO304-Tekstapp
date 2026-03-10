import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveDefaultText,
  getAllApplications,
  type TextValues,
  type ApplicationListItem,
} from "../../api";

const CreateTextKeyPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
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

    const response = await saveDefaultText(
      name,
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
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <button
        onClick={() => navigate("/textkeys")}
        style={{ marginBottom: "20px" }}
      >
        ← Tilbake til tekstnøkler
      </button>

      <h1>Opprett tekstnøkkel</h1>

      <div style={{ marginBottom: "16px" }}>
        <label>Velg applikasjon</label>
        <br />
        <select
          value={selectedApplicationId}
          onChange={(e) => setSelectedApplicationId(e.target.value)}
        >
          {applications.length === 0 ? (
            <option value="">Ingen applikasjoner tilgjengelig</option>
          ) : (
            applications.map((application) => (
              <option key={application.id} value={application.id}>
                {application.name}
              </option>
            ))
          )}
        </select>
      </div>

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
