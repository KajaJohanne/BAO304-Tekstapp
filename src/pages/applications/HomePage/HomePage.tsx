import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllApplications,
  updateApplicationUsageStatus,
  type ApplicationListItem,
} from "../../../../api";
import "./HomePage.css";
import ListItemCard from "../../../components/ListItemCard/ListItemCard";
import { Button } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";
import CreateTypeSelector from "../../../components/CreateTypeSelector/CreateTypeSelector";
import FilterMenu, {
  type FilterValues,
} from "../../../components/FilterMenu/FilterMenu";
import SearchBar from "../../../components/Search/SearchBar";

const HomePage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState<FilterValues>({
    sort: null,
    textTypes: null,
    usageStatus: null,
  });

  useEffect(() => {
    const fetchApplications = async () => {
      const data = await getAllApplications();
      setApplications(data);
    };

    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.toLowerCase();

      result = result.filter((application) => {
        const searchableText = [
          application.name ?? "",
          Array.isArray(application.sections)
            ? application.sections.map((section) => section.name).join(" ")
            : "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    if (filters.usageStatus) {
      result = result.filter((application) => {
        const inUse = Boolean(application.isInUse);

        if (filters.usageStatus === "inUse") return inUse;
        if (filters.usageStatus === "notInUse") return !inUse;
        return false;
      });
    }

    if (filters.sort === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "lastChanged") {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.lastChanged).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.lastChanged).getTime() : 0;
        return dateB - dateA;
      });
    } else if (filters.sort === "createdAt") {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [applications, searchTerm, filters]);

  const handleToggleUsage = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;
    const error = await updateApplicationUsageStatus(id, newValue);

    if (error) {
      console.error(
        "Feil ved oppdatering av bruksstatus for applikasjon:",
        error,
      );
      return;
    }

    setApplications((prev) =>
      prev.map((application) =>
        application.id === id
          ? { ...application, isInUse: newValue }
          : application,
      ),
    );
  };

  return (
    <div className="home-page">
      {/* Velge mellom applikasjon og tekstnøkkel */}
      <CreateTypeSelector />

      <h1>Applikasjoner</h1>

      <div className="info-and-btn-container">
        <p>
          Her finner du alle applikasjoner. Du kan filtrere og søke etter ønsket
          applikasjon, eller legge til en ny.{" "}
        </p>

        <Button
          onClick={() => navigate("/create-application")}
          className="add-button"
        >
          <BiPlus aria-hidden />
          Legg til ny applikasjon
        </Button>
      </div>

      {/* Søkefelt of filtermeny fra komponent */}
      <div className="search-filter-row">
        <div className="search-bar-wrapper">
          <SearchBar
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Søk etter applikasjon"
            ariaLabel="Søk etter applikasjon"
          />
        </div>
        <div className="filter-button-wrapper">
          <FilterMenu
            value={filters}
            onApply={setFilters}
            showTextType={false}
          />
        </div>
      </div>

      {applications.length === 0 ? (
        <p>Ingen applikasjoner funnet</p>
      ) : filteredApplications.length === 0 ? (
        <p>Ingen treff</p>
      ) : (
        filteredApplications.map((application) => (
          <ListItemCard
            key={application.id}
            title={application.name}
            isInUse={Boolean(application.isInUse)}
            onClick={() => navigate(`/applicationDetails/${application.id}`)}
            onToggleUsage={() =>
              handleToggleUsage(application.id, Boolean(application.isInUse))
            }
            usageLabelActive="Marker applikasjon som ikke i bruk"
            usageLabelInactive="Marker applikasjon som i bruk"
          />
        ))
      )}
    </div>
  );
};

export default HomePage;
