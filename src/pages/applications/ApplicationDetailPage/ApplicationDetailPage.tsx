import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getApplication,
  type ApplicationListItem,
  addSubSectionToApplication,
  deleteApplication,
  addSectionToApplication,
  deleteSubSections,
} from "../../../../api";
import "./ApplicationDetailPage.css";
import { Button } from "@digdir/designsystemet-react";
import { toast } from "react-toastify";

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState<ApplicationListItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [newSubSectionName, setNewSubSectionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Inputfelt for ny kategori (section)
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // valgte subsections per section
  const [checkedSubSections, setCheckedSubSections] = useState<
    Record<string, string[]>
  >({}); // Record = objekt hvor nøklene er string og verdiene er lister av strings

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
      trimmedName,
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

  const handleSectionClick = (sectionName: string) => {
    if (!application) return;

    navigate("/section", {
      state: {
        applicationId: application.id,
        applicationName: application.name,
        sectionName,
      },
    });
  };

  const handleSubSectionClick = (
    sectionName: string,
    subSectionName: string,
  ) => {
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

  // Anstall valgte subsections
  const totalChecked = Object.values(checkedSubSections).flat().length;

  const handleDelete = async () => {
    if (!application) return;

    const error = await deleteApplication(application.id);

    if (error) {
      toast.error(`Noe gikk galt: ${error}`);
    } else {
      toast.success(`Applikasjonen "${application.name}" ble slettet`);
      navigate("/home");
    }
  };

  const handleAddSection = async () => {
    const trimmedName = newSectionName.trim();

    if (!trimmedName) {
      alert("Du må skrive inn navn på kategorien.");
    }

    const error = await addSectionToApplication(application.id, trimmedName);

    if (error) {
      toast.error(error);
    } else {
      toast.success(`Kategorien "${trimmedName}" ble lagt til`);
      setNewSectionName("");
      setIsAddingSection(false);
      await fetchApplication();
    }
  };

  // Kalles når brukeren ccheckboxer en subsections
  const handleCheckboxToggle = (
    sectionName: string,
    subSectionName: string,
  ) => {
    setCheckedSubSections((prev) => {
      // Hent listen over avhukede subsections for denne sectionen, evt tom liste
      const currentlyChecked = prev[sectionName] ?? [];

      // Sjekk om denne er huken av allerede
      const isAlreadySchecked = currentlyChecked.includes(subSectionName);

      return {
        // Behold alle andre sections
        ...prev,
        //oppdater bare denne sectionen sin liste
        [sectionName]: isAlreadySchecked
          ? // Hvis den er huket av så fjernes den
            currentlyChecked.filter((name) => name !== subSectionName)
          : // Hvis den ikke er huket av så legges den i lista
            [...currentlyChecked, subSectionName],
      };
    });
  };

  // Kalles når brukeren sletter markerte underkategorier
  const handleDeleteCheckedSubSections = async () => {
    if (!application) return;

    // Hent alle sections som har markerte subsections
    // Object.entries gjør om objektet til en liste
    const sectionsWithChecked = Object.entries(checkedSubSections).filter(
      ([, subSections]) => subSections.length > 0,
    );

    // Om ingenting er huket av, gjør ingen
    if (sectionsWithChecked.length === 0) return;

    // bekreftelse
    const confirmed = window.confirm(
      `Er du sikker på at du vil slette de markerte underkategoriene? Dette kan ikke angres.`,
    );

    if (!confirmed) return;

    // Kall deleteSubSections for hver som er valgt
    // Promise.all = alle kallene skjer samtidig
    const results = await Promise.all(
      sectionsWithChecked.map(([sectionName, subSectionNames]) =>
        deleteSubSections(application.id, sectionName, subSectionNames),
      ),
    );

    // Sjekk om noen av kallene returnerte en feil
    const firstError = results.find((result) => result !== null);
    if (firstError) {
      toast.error(`Noe gikk galt: ${firstError}`);
      return;
    }

    // Nullstill og hent applikasjonen på nytt
    toast.success(`Underkategoriene ble slettet`);
    setCheckedSubSections({});
    await fetchApplication();
  };

  return (
    <div className="application-detail">
      <p className="back-btn" onClick={() => navigate("/home")}>
        ‹ Applikasjoner
      </p>

      <h1>{application.name}</h1>
      <p>
        Her er oversikt over kategorier innenfor applikasjonen{" "}
        {application.name}
      </p>

      {/* Legg til ny kategori */}
      <div className="add-section-container">
        <Button
          variant="secondary"
          className="add-section-btn"
          onClick={() => setIsAddingSection(!isAddingSection)}
        >
          + Legg til kategori
        </Button>

        {isAddingSection && (
          <div className="add-section-form">
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Navn på kategori"
            />
            <button type="button" className="section-btn" onClick={handleAddSection}>
              Lagre
            </button>
            <button
                  type="button"
                  className="section-btn"
                  onClick={() => {
                    setIsAddingSection(false); 
                    setNewSectionName(""); 
                  }}
                >
                  Avbryt
                </button>
          </div>
        )}
      </div>

      {sections.length === 0 ? (
        <p>Ingen kategorier lagt til ennå</p>
      ) : (
        sections.map((section) => (
          <div key={section.name} style={{ marginBottom: "32px" }}>
            {/* Section overskrift med knapp */}
            <div className="section-header">
              <h3
                className="section-title"
                onClick={() => handleSectionClick(section.name)}
              >
                {section.name}
              </h3>

              <div className="section-header-right">
                <button
                  className="add-subSection-btn"
                  type="button"
                  title="Legg til underkategori"
                  onClick={() =>
                    setOpenSection(
                      openSection === section.name ? null : section.name,
                    )
                  }
                >
                  +
                </button>
                <div className="subsection-marker-title">Marker</div>
              </div>
            </div>

            {/* Inputfelt for ny subsection */}
            {openSection === section.name && (
              <div className="add-subsection-form">
                <input
                  type="text"
                  value={newSubSectionName}
                  onChange={(e) => setNewSubSectionName(e.target.value)}
                  placeholder="Navn på underkategori"
                />
                <button
                  type="button"
                  className="subsection-btn"
                  onClick={() => handleAddSubSection(section.name)}
                  disabled={isSaving}
                >
                  Lagre
                </button>
                <button
                  type="button"
                  className="subsection-btn"
                  onClick={() => {
                    setOpenSection(null); 
                    setNewSubSectionName(""); 
                  }}
                >
                  Avbryt
                </button>
              </div>
            )}

            {/* Liste over subsections */}
            {(section.subSections ?? []).length === 0 ? (
              <p>Ingen underkategorier ennå.</p>
            ) : (
              <>
                <ul className="subsection-list">
                  {section.subSections.map((subSection) => (
                    <div key={subSection.name} className="subsection-row">
                      <li className="subsection-item">
                        {/* Klikk på teksten navigerer til subsection siden */}
                        <span
                          style={{ flex: 1, cursor: "pointer" }}
                          onClick={() =>
                            handleSubSectionClick(section.name, subSection.name)
                          }
                        >
                          {subSection.name}
                        </span>
                        <span>›</span>
                      </li>

                      {/* Checkbox for avhuking */}
                      <input
                        type="checkbox"
                        className="subsection-checkbox"
                        checked={(
                          checkedSubSections[section.name] ?? []
                        ).includes(subSection.name)}
                        onChange={() =>
                          handleCheckboxToggle(section.name, subSection.name)
                        }
                      />
                    </div>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))
      )}

      {/* Knapper */}
      <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
        {/* Slett markerte underkategorier */}
        <Button
          variant="secondary"
          className="delete-btn"
          disabled={totalChecked === 0}
          onClick={handleDeleteCheckedSubSections}
        >
          Slett underkategorier
        </Button>

        {/* Slett hele applikasjonen */}
        {/* Knappen er designsystemet komponent, skal det endres? vanskelig med styling */}
        <Button
          className="delete-btn"
          variant="secondary"
          data-color="danger"
          onClick={() => {
            if (
              window.confirm(
                `Er du sikker på at du ønsker å slette ${application.name}? Alle tilknyttede tekstnøkler blir også slettet. Dette kan ikke angres.`,
              )
            )
              handleDelete();
          }}
        >
          Slett applikasjon
        </Button>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
