import { useState, useRef, useEffect } from "react";
import "./FilterMenu.css";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { HiChevronDown, HiChevronUp, HiXMark } from "react-icons/hi2";

export type SortOption = "lastChanged" | "createdAt" | "alphabetical";
export type TextTypeOption =
  | "Tittel"
  | "Brødtekst"
  | "Feilmelding"
  | "Knappetekst"
  | "Hjelpetekst";
export type UsageStatusOption = "inUse" | "notInUse";

export type FilterValues = {
  sort: SortOption | null;
  textTypes: TextTypeOption | null;
  usageStatus: UsageStatusOption | null;
};

type FilterMenuProps = {
  value: FilterValues;
  onApply: (filters: FilterValues) => void;
  showTextType?: boolean;
};

const defaultExpandedState = {
  sorting: false,
  textType: false,
  usageStatus: false,
};

const FilterMenu = ({
  value,
  onApply,
  showTextType = true,
}: FilterMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpandedState);
  const [localFilters, setLocalFilters] = useState<FilterValues>(value);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // åpner/lukker en seksjon
  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    setLocalFilters(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const setSingleValue = <K extends keyof FilterValues>(
    category: K,
    option: FilterValues[K],
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: prev[category] === option ? null : option,
    }));
  };

  // nulstill alle filtre
  const resetFilters = () => {
    const resetValue: FilterValues = {
      sort: null,
      textTypes: null,
      usageStatus: null,
    };
    setLocalFilters(resetValue);
    onApply(resetValue);
  };

  const handleApply = () => {
    onApply(localFilters);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="filter-menu-wrapper">
      <button
        type="button"
        className="filter-toggle-button"
        onClick={toggleMenu}
        aria-label={isOpen ? "Lukk filtreringsmeny" : "Åpne filtreringsmeny"}
        aria-expanded={isOpen}
      >
        <HiOutlineAdjustmentsHorizontal aria-hidden />
      </button>

      {isOpen && (
        <aside
          className={`filter-panel ${isOpen ? "open" : ""}`}
          ref={menuRef}
          aria-hidden={!isOpen}
        >
          <div className="filter-menu">
            <button
              type="button"
              className="filter-menu__close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Lukk filtermeny"
            >
              <HiXMark aria-hidden />
            </button>

            <div className="filter-menu__content">
              <Section
                title="Sortering"
                isOpen={expanded.sorting}
                onToggle={() => toggleSection("sorting")}
              >
                <Checkbox
                  name="sort"
                  label="Sist endret"
                  checked={localFilters.sort === "lastChanged"}
                  onChange={() => setSingleValue("sort", "lastChanged")}
                />
                <Checkbox
                  name="sort"
                  label="Opprettet dato"
                  checked={localFilters.sort === "createdAt"}
                  onChange={() => setSingleValue("sort", "createdAt")}
                />
                <Checkbox
                  name="sort"
                  label="Alfabetisk"
                  checked={localFilters.sort === "alphabetical"}
                  onChange={() => setSingleValue("sort", "alphabetical")}
                />
              </Section>

              {showTextType && (
                <Section
                  title="Type tekst"
                  isOpen={expanded.textType}
                  onToggle={() => toggleSection("textType")}
                >
                  <Checkbox
                    name="textType"
                    label="Tittel"
                    checked={localFilters.textTypes === "Tittel"}
                    onChange={() => setSingleValue("textTypes", "Tittel")}
                  />
                  <Checkbox
                    name="textType"
                    label="Brødtekst"
                    checked={localFilters.textTypes === "Brødtekst"}
                    onChange={() => setSingleValue("textTypes", "Brødtekst")}
                  />
                  <Checkbox
                    name="textType"
                    label="Feilmelding"
                    checked={localFilters.textTypes === "Feilmelding"}
                    onChange={() => setSingleValue("textTypes", "Feilmelding")}
                  />
                  <Checkbox
                    name="textType"
                    label="Knappetekst"
                    checked={localFilters.textTypes === "Knappetekst"}
                    onChange={() => setSingleValue("textTypes", "Knappetekst")}
                  />
                  <Checkbox
                    name="textType"
                    label="Hjelpetekst"
                    checked={localFilters.textTypes === "Hjelpetekst"}
                    onChange={() => setSingleValue("textTypes", "Hjelpetekst")}
                  />
                </Section>
              )}

              <Section
                title="Bruksstatus"
                isOpen={expanded.usageStatus}
                onToggle={() => toggleSection("usageStatus")}
              >
                <Checkbox
                  name="usageStatus"
                  label="I bruk"
                  checked={localFilters.usageStatus === "inUse"}
                  onChange={() => setSingleValue("usageStatus", "inUse")}
                />
                <Checkbox
                  name="usageStatus"
                  label="Ikke i bruk"
                  checked={localFilters.usageStatus === "notInUse"}
                  onChange={() => setSingleValue("usageStatus", "notInUse")}
                />
              </Section>
            </div>

            <div className="filter-menu__actions">
              <button
                type="button"
                className="filter-menu__button filter-menu__button--secondary"
                onClick={resetFilters}
              >
                Nullstill
              </button>

              <button
                type="button"
                className="filter-menu__button filter-menu__button--primary"
                onClick={handleApply}
              >
                Filtrer
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

type SectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const Section = ({ title, isOpen, onToggle, children }: SectionProps) => {
  return (
    <div className="filter-menu__section">
      <button
        className="filter-menu__section-header"
        type="button"
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="filter-menu__chevron">
          {isOpen ? <HiChevronUp /> : <HiChevronDown />}
        </span>
      </button>

      {isOpen && <div className="filter-menu__section-content">{children}</div>}
    </div>
  );
};

type CheckboxProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

const Checkbox = ({ name, label, checked, onChange }: CheckboxProps) => {
  return (
    <label className="filter-menu__checkbox">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
};

export default FilterMenu;
