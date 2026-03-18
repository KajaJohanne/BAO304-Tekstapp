import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplication, type ApplicationListItem } from "../../../../api";

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState<ApplicationListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchApplication();
  }, [id]);

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

  if (isLoading) return <p>Laster...</p>;
  if (!application) return <p>Fant ikke applikasjonen.</p>;

  const sections = application.sections ?? [];

  return (
    <div style={{ padding: "24px" }}>
      <button onClick={() => navigate(-1)}>‹ Tilbake</button>
      <h1>{application.name}</h1>

      {sections.length === 0 ? (
        <p>Ingen kategorier funnet.</p>
      ) : (
        sections.map((section) => (
          <button
            key={section.name}
            onClick={() => handleSectionClick(section.name)}
          >
            {section.name}
          </button>
        ))
      )}
    </div>
  );
};

export default ApplicationDetailPage;