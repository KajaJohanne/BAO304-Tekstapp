import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";

import { getAllTextKeys, type TextKeyListItem } from "../../../../api";
import "./AllTextKeysPage.css";
import "../../../components/CreateTypeSelector/CreateTypeSelector";
import CreateTypeSelector from "../../../components/CreateTypeSelector/CreateTypeSelector";
import TextKeyList from "../../../components/TextKeyList/TextKeyList";
import SearchBar from "../../../components/Search/SearchBar";

const AllTextKeysPage = () => {
  const navigate = useNavigate();
  const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  //Søkefelt
  const filteredTextKeys = textKeys.filter((textKey) => 
    textKey.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Henter tekstnøkler
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

      {/* Søkefelt fra komponent */}
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Søk etter tekstnøkkel"
        ariaLabel="Søk etter tekstnøkkel"
      />

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
