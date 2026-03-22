import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTextKeys, type TextKeyListItem } from "../../../../api";
import "./AllTextKeysPage.css";
import "../../../components/CreateTypeSelector/CreateTypeSelector";
import CreateTypeSelector from "../../../components/CreateTypeSelector/CreateTypeSelector";
import { Button, Search } from "@digdir/designsystemet-react";
import { BiPlus, BiSearch } from "react-icons/bi";
import TextKeyList from "../../../components/TextKeyList/TextKeyList";

const AllTextKeysPage = () => {
  const navigate = useNavigate();
  const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTextKeys = async () => {
      const data = await getAllTextKeys();
      setTextKeys(data);
    };

    fetchTextKeys();
  }, []);

  return (
    <div className="all-text-key-page_content">
      {/* Velge mellom applikasjon og tekstnøkkel */}
      <CreateTypeSelector/>

      <h1>Tekstnøkler</h1>
      <p>Her finner du alle tekstnøkler. Du kan filtrere og søke etter ønsket tekstnøkkel, eller legge til en ny. </p>

      {/* Legg til ny tekstnøkkel knapp */}
      <Button onClick={() => navigate("/create-textkey")} className="add-button">
          <BiPlus aria-hidden />
          Legg til ny tekstnøkkel
      </Button>

      {/* Søkefelt fra designsystemet */}
      <Search className="search-bar">
        <Search.Input 
          aria-aria-label="Søk etter tekstnøkkel"
          placeholder="Søk etter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <Search.Clear 
            onClick={() => setSearchTerm("")}
            className="search-clear"
          />
        )}
        <Search.Button className="search-button">
          <BiSearch />
        </Search.Button>
      </Search>

      {/* Liste over alle tekstnøkler */}
      <div className="text-key-list-wrapper">
        {textKeys.length === 0 ? (
          <p>Ingen tekstnøkler funnet.</p>
        ) : (
          textKeys
            .filter((textKeys) =>
              textKeys.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((textKey) => (
            <TextKeyList
              key={textKey.id}
              textKey={textKey}
              onClick={() => navigate(`/textkeyDetails/${textKey.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllTextKeysPage;
