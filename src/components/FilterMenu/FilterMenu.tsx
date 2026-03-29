import { useState } from "react";
import "./FilterMenu.css";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

export type SortOption = "lastChanged" | "createdAt" | "alphabetical";
export type TextTypeOption =
  | "Tittel"
  | "Brødtekst"
  | "Feilmelding"
  | "Knappetekst"
  | "Hjelpetekst";
export type UsageStatusOption = "inUse" | "notInUse";

export type FilterValues = {
  sort: SortOption[];
  textTypes: TextTypeOption[];
  usageStatus: UsageStatusOption[];
};

type FilterMenuProps = {
  value: FilterValues;
  onApply: (filters: FilterValues) => void;
};

const defaultExpandedState = {
  sorting: false,
  textType: false,
  usageStatus: false,
};

const FilterMenu = ({ value, onApply }: FilterMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpandedState);
  const [localFilters, setLocalFilters] = useState<FilterValues>(value);

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

  // legger til eller fjerner filtervalg
  const toggleValue = <T extends string>(
    category: keyof FilterValues,
    option: T,
  ) => {
    setLocalFilters((prev) => {
      const currentValues = prev[category] as T[];
      const exists = currentValues.includes(option);

      return {
        ...prev,
        [category]: exists
          ? currentValues.filter((item) => item !== option)
          : [...currentValues, option],
      };
    });
  };

  // nulstill alle filtre
  const resetFilters = () => {
    const resetValue: FilterValues = {
      sort: [],
      textTypes: [],
      usageStatus: [],
    };
    setLocalFilters(resetValue);
    onApply(resetValue);
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
        <aside className="filter-panel">
          <div className="filter-menu">
            <Section
              title="Sortering"
              isOpen={expanded.sorting}
              onToggle={() => toggleSection("sorting")}
            >
              <Checkbox
                label="Sist endret"
                checked={localFilters.sort.includes("lastChanged")}
                onChange={() => toggleValue("sort", "lastChanged")}
              />
              <Checkbox
                label="Opprettet dato"
                checked={localFilters.sort.includes("createdAt")}
                onChange={() => toggleValue("sort", "createdAt")}
              />
              <Checkbox
                label="Alfabetisk"
                checked={localFilters.sort.includes("alphabetical")}
                onChange={() => toggleValue("sort", "alphabetical")}
              />
            </Section>

            <Section
              title="Type tekst"
              isOpen={expanded.textType}
              onToggle={() => toggleSection("textType")}
            >
              <Checkbox
                label="Tittel"
                checked={localFilters.textTypes.includes("Tittel")}
                onChange={() => toggleValue("textTypes", "Tittel")}
              />
              <Checkbox
                label="Brødtekst"
                checked={localFilters.textTypes.includes("Brødtekst")}
                onChange={() => toggleValue("textTypes", "Brødtekst")}
              />
              <Checkbox
                label="Feilmelding"
                checked={localFilters.textTypes.includes("Feilmelding")}
                onChange={() => toggleValue("textTypes", "Feilmelding")}
              />
              <Checkbox
                label="Knappetekst"
                checked={localFilters.textTypes.includes("Knappetekst")}
                onChange={() => toggleValue("textTypes", "Knappetekst")}
              />
              <Checkbox
                label="Hjelpetekst"
                checked={localFilters.textTypes.includes("Hjelpetekst")}
                onChange={() => toggleValue("textTypes", "Hjelpetekst")}
              />
            </Section>

            <Section
              title="Bruksstatus"
              isOpen={expanded.usageStatus}
              onToggle={() => toggleSection("usageStatus")}
            >
              <Checkbox
                label="I bruk"
                checked={localFilters.usageStatus.includes("inUse")}
                onChange={() => toggleValue("usageStatus", "inUse")}
              />
              <Checkbox
                label="Ikke i bruk"
                checked={localFilters.usageStatus.includes("notInUse")}
                onChange={() => toggleValue("usageStatus", "notInUse")}
              />
            </Section>

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
                onClick={() => onApply(localFilters)}
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
        <span className={`filter-menu__chevron ${isOpen ? "open" : ""}`}>
          ^
        </span>
      </button>

      {isOpen && <div className="filter-menu__section-content">{children}</div>}
    </div>
  );
};

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className="filter-menu__checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
};

export default FilterMenu;
