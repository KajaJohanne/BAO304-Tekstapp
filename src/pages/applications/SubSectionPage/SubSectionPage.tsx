// andre lag med underkategori? Applikasjon/Section/her
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";
import FilterMenu, {
  type FilterValues,
} from "../../../components/FilterMenu/FilterMenu";
import {
  getTextKeysByApplication,
  deleteTextKey,
  updateTextKeyUsageStatus,
  type TextKeyListItem,
} from "../../../../api";
import type { subSectionState } from "../../../types/subSection";
import "./SubSectionPage.css";
import TextKeyCard from "../../../components/TextKeyCard/TextKeyCard";
import SearchBar from "../../../components/Search/SearchBar";

const SubSectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterValues>({
    sort: null,
    textTypes: null,
    usageStatus: null,
  });

  const pageState = useMemo(() => {
    if (location.state) {
      return location.state as subSectionState;
    }

    const savedState = sessionStorage.getItem("subSectionState");
    if (!savedState) return null;

    try {
      return JSON.parse(savedState) as subSectionState;
    } catch {
      return null;
    }
  }, [location.state]);

  //Henter nøkler tilhørende applikasjonen som er valgt
  useEffect(() => {
    const fetchTextKeys = async () => {
      try {
        if (!pageState) return;

        sessionStorage.setItem("subSectionState", JSON.stringify(pageState));

        const { applicationId, sectionName, subSectionName } = pageState;
        const allKeys = await getTextKeysByApplication(applicationId);

        const filtered = allKeys.filter((key) => {
          if (!key.placementPath || key.placementPath.length < 2) return false;

          const keySection = key.placementPath[1];
          const keySubSection = key.placementPath[2];

          const matchesSection = keySection === sectionName;
          const matchesSubSection = subSectionName
            ? keySubSection === subSectionName
            : true;

          return matchesSection && matchesSubSection;
        });

        setTextKeys(filtered);
      } catch (error) {
        console.error("Feil ved henting av tekstnøkler:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTextKeys();
  }, [pageState]);

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
        const dateA = a.lastChanged ? new Date(a.lastChanged).getTime() : 0;
        const dateB = b.lastChanged ? new Date(b.lastChanged).getTime() : 0;
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
  }, [textKeys, searchTerm, filters]);

  //Laste visning
  if (isLoading) {
    return <p className="subsection-loading">Laster...</p>;
  }

  //Tekst som vises hvis noe går galt
  if (!pageState) {
    return (
      <p className="subsection-error">
        Ingen data tilgjengelig. Gå tilbake og velg på nytt.
      </p>
    );
  }

  /*
  const filteredTextKeys = textKeys.filter((textKey) =>
    textKey.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  */

  console.log("side state:", pageState);
  console.log("tekstnøkler:", textKeys);

  //Slette tekstnøkkel
  const handleDeleteSelected = async () => {
    if (checkedKeys.length === 0) return;

    const confirmed = window.confirm(
      `Er du sikker på at du vil slette?\nAntall tekstnøkler valgt: ${checkedKeys.length}`,
    );

    if (!confirmed) return;

    try {
      const results = await Promise.all(
        checkedKeys.map((id) => deleteTextKey(id)),
      );

      const firstError = results.find((result) => result !== null);
      if (firstError) {
        console.error(firstError);
        alert(firstError);
        return;
      }

      setTextKeys((prev) =>
        prev.filter((textKey) => !checkedKeys.includes(textKey.id)),
      );
      setCheckedKeys([]);
    } catch (error) {
      console.error("Feil ved sletting av tekstnøkler:", error);
      alert("Noe gikk galt ved sletting.");
    }
  };

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

  return (
    <div className="subsection-page">
      {/* Tilbake knapp */}
      <button
        className="back-button"
        onClick={() => {
          if (pageState.from?.pathname) {
            navigate(pageState.from.pathname);
          } else {
            navigate(`/applicationDetails/${pageState.applicationId}`);
          }
        }}
      >
        <span className="back-arrow">‹</span>
        <span className="back-text">{pageState.sectionName}</span>
      </button>

      <h1>Tekstnøkler</h1>

      {/* Henter navnet til applikasjonen og kategorien som er valgt */}
      <p>
        Her er alle tekstnøkler tilhørende{" "}
        {pageState.sectionName || pageState.sectionName}
        {pageState.subSectionName ? `, ${pageState.subSectionName}` : ""}
      </p>

      {/* Navn på kategorien som er valgt */}
      <h2>{pageState.subSectionName || pageState.sectionName}</h2>

      {/* Legg til tekstnøkkel knapp */}
      <Button
        onClick={() =>
          navigate("/create-textkey", {
            state: {
              applicationId: pageState.applicationId,
              sectionName: pageState.sectionName,
              subSectionName: pageState.subSectionName,
            },
          })
        }
        className="subsection-add-button"
      >
        <BiPlus aria-hidden />
        Legg til ny tekstnøkkel
      </Button>

      {/* Søkefelt of filtermeny fra komponent */}
      <div className="subsection-top-row">
        <div className="subsection-search-filter-row">
          <div className="subsection-search-bar-wrapper">
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

        {/* Marker tekstnøkler seksjon */}
        <div className="subsection-list-header">
          <div />
          <div className="subsection-marker-title">Marker</div>
        </div>
      </div>

      {/* Dukker opp hvis det ikke finnes noen tekstnøkler tilhørende kategorien */}
      {filteredTextKeys.length === 0 ? (
        <p className="subsection-empty">Ingen tekstnøkler funnet.</p>
      ) : (
        //Listen over tekstnøkler
        <div className="subsection-list">
          {filteredTextKeys.map((textKey) => (
            <TextKeyCard
              key={textKey.id}
              textKey={textKey}
              checked={checkedKeys.includes(textKey.id)}
              isInUse={Boolean(textKey.isInUse)}
              onToggleUsage={() =>
                handleToggleUsage(textKey.id, Boolean(textKey.isInUse))
              }
              onEdit={(selectedTextKey) => {
                navigate(`/textkeyDetails/${selectedTextKey.id}`, {
                  state: {
                    textKeyId: selectedTextKey.id,
                    from: { pathname: "/subSection" },
                  },
                });
              }}
              onCheckChange={(isChecked) => {
                setCheckedKeys((prev) =>
                  isChecked
                    ? [...prev, textKey.id]
                    : prev.filter((id) => id !== textKey.id),
                );
                console.log(textKey.name, isChecked);
              }}
            />
          ))}
        </div>
      )}

      {/* Slett knapp */}
      <Button
        onClick={handleDeleteSelected}
        disabled={checkedKeys.length === 0}
        className="subsection-delete-button"
      >
        Slett tekstnøkkel
      </Button>
    </div>
  );
};

export default SubSectionPage;
