import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplication, type ApplicationListItem, addSubSectionToApplication } from "../../../../api";

const ApplicationDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
  
    const [application, setApplication] = useState<ApplicationListItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [newSubSectionName, setNewSubSectionName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
  
    const fetchApplication = async () => {
      try {
        if (!id) return;
  
        const app = await getApplication(id);
        setApplication(app);
      } catch (error) {
        console.error("Feil ved henting av applikasjon:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchApplication();
    }, [id]);
  
    const handleAddSubSection = async (sectionName: string) => {
      if (!application) return;
  
      const trimmedName = newSubSectionName.trim();
  
      if (!trimmedName) {
        alert("Du må skrive inn navn på underkategorien.");
        return;
      }
  
      setIsSaving(true);
  
      const error = await addSubSectionToApplication(
        application.id,
        sectionName,
        trimmedName
      );
  
      setIsSaving(false);
  
      if (error) {
        alert(error);
        return;
      }
  
      setNewSubSectionName("");
      setOpenSection(null);
      await fetchApplication();
    };
  
    const handleSubSectionClick = (sectionName: string, subSectionName: string) => {
      if (!application) return;
  
      navigate("/subSection", {
        state: {
          applicationId: application.id,
          applicationName: application.name,
          sectionName,
          subSectionName,
        },
      });
    };
  
    if (isLoading) return <p>Laster...</p>;
    if (!application) return <p>Fant ikke applikasjonen.</p>;
  
    const sections = application.sections ?? [];

  return (
    <div style={{ padding: "24px" }}>
      <button onClick={() => navigate(-1)}>‹ Tilbake</button>
      
      <h1>Oversikt applikasjon</h1>
      <p>Her er oversikt over kategorier innenfor applikasjonen {application.name}</p>

      <h2>{application.name}</h2>

      {sections.length === 0 ? (
        <p>Ingen kategorier funnet.</p>
      ) : (
        sections.map((section) => (
            <div key={section.name} style={{ marginBottom: "32px" }}>
                <div className="section-name">
                    <h3 style={{ margin: 0 }}>{section.name}</h3>

                    <button
                        type="button"
                        onClick={() =>
                            setOpenSection(
                                openSection === section.name ? null : section.name
                            )
                        }
                    >
                        + Legg til underkategori
                    </button>
                </div>
                
            {openSection === section.name && (
              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  value={newSubSectionName}
                  onChange={(e) => setNewSubSectionName(e.target.value)}
                  placeholder="Skriv navn på underkategori"
                  style={{ marginRight: "8px" }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSubSection(section.name)}
                  disabled={isSaving}
                >
                  Lagre
                </button>
              </div>
            )}

            {(section.subSections ?? []).length === 0 ? (
              <p>Ingen underkategorier ennå.</p>
            ) : (
              section.subSections.map((subSection) => (
                <div key={subSection.name} style={{ marginBottom: "8px" }}>
                  <button
                    type="button"
                    onClick={() =>
                      handleSubSectionClick(section.name, subSection.name)
                    }
                  >
                    {subSection.name}
                  </button>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationDetailPage;