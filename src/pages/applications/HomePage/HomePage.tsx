import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllApplications, type ApplicationListItem } from "../../../../api";
import "./HomePage.css";
import ApplicationCard from "../../../components/ApplicationCard/ApplicationCard";
import { Button } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";
import CreateTypeSelector from "../../../components/CreateTypeSelector/CreateTypeSelector";
import { ToastContainer } from "react-toastify";

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
    <div className="home-page">
      {/* Velge mellom applikasjon og tekstnøkkel */}
      <CreateTypeSelector />

      <h1>Applikasjoner</h1>
      
      <div className="info-and-btn-container">

        <p>
      Her finner du alle applikasjoner. Klikk på en applikasjon for å se detaljer,
      eller bruk redigeringsikonet for å endre navn.
    </p>
        
        {/* TODO stilsett knappen bedre */}
        <Button onClick={() => navigate("/create-application")} className="add-button">
          <BiPlus aria-hidden />
          Legg til ny applikasjon
        </Button>
      </div>

      {applications.length === 0 ? (
        <p>Ingen applikasjoner funnet.</p>
      ) : (
        applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default HomePage;
