import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllApplications, type ApplicationListItem } from "../../api";

const HomePage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const data = await getAllApplications();
      setApplications(data);
    };

    fetchApplications();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <button
        onClick={() => navigate("/create-textkey")}
        style={{ marginBottom: "20px" }}
      >
        ← Tilbake til tekstnøkler
      </button>
      <h1>Applikasjoner</h1>

      <button
        onClick={() => navigate("/create-application")}
        style={{ marginBottom: "20px" }}
      >
        Opprett ny applikasjon
      </button>

      {applications.length === 0 ? (
        <p>Ingen applikasjoner funnet.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            onClick={() => navigate(`/applicationDetails/${application.id}`)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
              cursor: "pointer",
            }}
          >
            <h3>{application.name}</h3>
            <p>{application.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
