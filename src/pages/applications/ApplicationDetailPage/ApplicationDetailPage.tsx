import { useNavigate, useParams } from "react-router-dom";

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleGoToSubSection = () => {
    if (!id) return;

    const state = {
      applicationId: id,
      sectionName: "Trafikk",
      subSectionName: "LangsVeien",
    };

    sessionStorage.setItem("subSectionState", JSON.stringify(state));

    navigate("/subSection", { state });
  };

  return (
    <div>
      <h1>Application details</h1>
      <button onClick={handleGoToSubSection}>
        Gå til underkategori
      </button>
    </div>
  );
};

export default ApplicationDetailPage;