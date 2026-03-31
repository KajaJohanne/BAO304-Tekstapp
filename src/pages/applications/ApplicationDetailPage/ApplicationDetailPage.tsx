import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getApplication,
  type ApplicationListItem,
  addSubSectionToApplication,
  deleteApplication,
} from "../../../../api";
import "./ApplicationDetailPage.css";
import { Dialog } from "@digdir/designsystemet-react";
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  return (
    <div className="application-detail">
      <button onClick={() => navigate(-1)}>‹ Tilbake</button>

      <h1>Oversikt applikasjon</h1>
      <p>
        Her er oversikt over kategorier innenfor applikasjonen{" "}
        {application.name}
      </p>

      <h2>{application.name}</h2>

      {sections.length === 0 ? (
        <p>Ingen kategorier lagt til ennå</p>
      ) : (
        sections.map((section) => (
          <div key={section.name} style={{ marginBottom: "32px" }}>
            {/* Section overskrift med knapp */}
            <div className="section-header">
              <h3>{section.name}</h3>
              <button
                type="button"
                onClick={() =>
                  setOpenSection(
                    openSection === section.name ? null : section.name,
                  )
                }
              >
                + Legg til underkategori
              </button>
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
                  onClick={() => handleAddSubSection(section.name)}
                  disabled={isSaving}
                >
                  Lagre
                </button>
              </div>
            )}

            {/* Liste over subsections */}
            {(section.subSections ?? []).length === 0 ? (
              <p>Ingen underkategorier ennå.</p>
            ) : (
              <ul className="subsection-list">
                {section.subSections.map((subSection) => (
                  <li
                    key={subSection.name}
                    className="subsection-item"
                    onClick={() =>
                      handleSubSectionClick(section.name, subSection.name)
                    }
                  >
                    <span>{subSection.name}</span>
                    <span>›</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}

      {/* Slett-knapp */}
      <div style={{ marginTop: "48px" }}>
        <button type="button" onClick={() => setIsDeleteDialogOpen(true)}>
          Slett applikasjonen
        </button>
      </div>

      {/* Bekreftelsesdialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <Dialog.Block>
          <h2>Slett applikasjonen</h2>
        </Dialog.Block>

        <Dialog.Block>
          <p>
            Er du sikker på at du vil slette <strong>{application.name}</strong>
            ? Dette kan ikke angres.
          </p>
        </Dialog.Block>

        <Dialog.Block>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <button type="button" onClick={() => setIsDeleteDialogOpen(false)}>
              Avbryt
            </button>
            <button type="button" onClick={handleDelete}>
              Ja, slett
            </button>
          </div>
        </Dialog.Block>
      </Dialog>
    </div>
  );
};

export default ApplicationDetailPage;
