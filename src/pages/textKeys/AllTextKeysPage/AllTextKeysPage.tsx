import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";
import ListItemCard from "../../../components/ListItemCard/ListItemCard";
import {
  getAllTextKeys,
  updateTextKeyUsageStatus,
  type TextKeyListItem,
} from "../../../../api";
import "./AllTextKeysPage.css";
import "../../../components/CreateTypeSelector/CreateTypeSelector";
import CreateTypeSelector from "../../../components/CreateTypeSelector/CreateTypeSelector";
import SearchBar from "../../../components/Search/SearchBar";
import FilterMenu, {
  type FilterValues,
} from "../../../components/FilterMenu/FilterMenu";

const AllTextKeysPage = () => {
  const navigate = useNavigate();
  const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState<FilterValues>({
    sort: null,
    textTypes: null,
    usageStatus: null,
  });

  /*
  //Søkefelt
  const filteredTextKeys = textKeys.filter((textKey) =>
    textKey.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  
  // holder på valgte filtre
  const [filter, setFilters] = useState<FilterValues>({
    sort: [],
    textTypes: [],
    usageStatus: [],
  });
  */

  //Henter tekstnøkler fra Firebase
  useEffect(() => {
    const fetchTextKeys = async () => {
      const data = await getAllTextKeys();
      setTextKeys(data);
    };

    fetchTextKeys();
  }, []);

  // viser om en tekstnøkkel er i bruk eller ikke, og lagrer det
  const handleToggleUsage = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;
    const error = await updateTextKeyUsageStatus(id, newValue);

    if (error) {
      console.error("Feil ved oppdatering av bruksstatus:", error);
      return;
    }

    setTextKeys((prev) =>
      prev.map((textKey) =>
        textKey.id === id ? { ...textKey, isInUse: newValue } : textKey,
      ),
    );
  };

  // filtrer, søk og sorter tekstnøkeler
  const filteredTextKeys = useMemo(() => {
    let result = [...textKeys];

    if (filters.textTypes) {
      result = result.filter(
        (textKeys) => textKeys.textType === filters.textTypes,
      );
    }

    // filtrer på bruksstatus
    if (filters.usageStatus) {
      result = result.filter((textKey) => {
        const inUse = Boolean(textKey.isInUse);

        if (filters.usageStatus === "inUse") return inUse;
        if (filters.usageStatus === "notInUse") return !inUse;
        return false;
      });
    }

    // søker innenfor resultatene fra tilteret som er i bruk
    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.toLowerCase();

      result = result.filter((textKey) => {
        const searchableText = [
          textKey.name ?? "",
          textKey.applicationName ?? "",
          textKey.textType ?? "",
          textKey.default.bokmål ?? "",
          textKey.default.nynorsk ?? "",
          textKey.default.engelsk ?? "",
          Array.isArray(textKey.placementPath)
            ? textKey.placementPath.join(" ")
            : "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    // sorterer resultatet
    if (filters.sort === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "lastChanged") {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.lastChanged).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.lastChanged).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [textKeys, searchTerm, filters]);

  return (
    <div className="all-text-key-page_content">
      {/* Velge mellom applikasjon og tekstnøkkel */}
      <CreateTypeSelector />

      <h1>Tekstnøkler</h1>
      <p>
        Her finner du alle tekstnøkler. Du kan filtrere og søke etter ønsket
        tekstnøkkel, eller legge til en ny.{" "}
      </p>

      {/* Legg til ny tekstnøkkel knapp */}
      <Button
        onClick={() => navigate("/create-textkey")}
        className="add-button"
      >
        <BiPlus aria-hidden />
        Legg til ny tekstnøkkel
      </Button>

      {/* Søkefelt of filtermeny fra komponent */}
      <div className="search-filter-row">
        <div className="search-bar-wrapper">
          <SearchBar
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Søk etter tekstnøkkel"
            ariaLabel="Søk etter tekstnøkkel"
          />
        </div>
        <div className="filter-button-wrapper">
          <FilterMenu value={filters} onApply={setFilters} />
        </div>
      </div>

      {/* Liste over alle tekstnøkler, tom state ved ingen treff */}
      <div className="text-key-list-wrapper">
        {textKeys.length === 0 ? (
          <p>Ingen tekstnøkler finnes enda</p>
        ) : filteredTextKeys.length === 0 ? (
          <div className="empty-state">
            <p>Ingen treff</p>
          </div>
        ) : (
          filteredTextKeys.map((textKey) => (
            <ListItemCard
              key={textKey.id}
              title={textKey.name}
              isInUse={Boolean(textKey.isInUse)}
              onClick={() => navigate(`/textkeyDetails/${textKey.id}`)}
              onToggleUsage={() =>
                handleToggleUsage(textKey.id, Boolean(textKey.isInUse))
              }
              usageLabelActive="Marker applikasjon som ikke i bruk"
              usageLabelInactive="Marker applikasjon som i bruk"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllTextKeysPage;
