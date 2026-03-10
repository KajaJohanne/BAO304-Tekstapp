import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTextKeys, type TextKeyListItem } from "../../api";

const AllTextKeysPage = () => {
  const navigate = useNavigate();
  const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);

  useEffect(() => {
    const fetchTextKeys = async () => {
      const data = await getAllTextKeys();
      setTextKeys(data);
    };

    fetchTextKeys();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <button
        onClick={() => navigate("/home")}
        style={{ marginBottom: "20px" }}
      >
        ← Tilbake til applikasjoner
      </button>
      <h1>Alle tekstnøkler</h1>

      <button onClick={() => navigate("/create-textkey")}>
        Opprett ny tekstnøkkel
      </button>

      <div style={{ marginTop: "24px" }}>
        {textKeys.length === 0 ? (
          <p>Ingen tekstnøkler funnet.</p>
        ) : (
          textKeys.map((textKey) => (
            <div
              key={textKey.id}
              onClick={() => navigate(`/textkeyDetails/${textKey.id}`)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                cursor: "pointer",
              }}
            >
              <h3>{textKey.name}</h3>
              <p>Bokmål: {textKey.default.bokmål}</p>
              <p>Nynorsk: {textKey.default.nynorsk}</p>
              <p>Engelsk: {textKey.default.engelsk}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllTextKeysPage;
