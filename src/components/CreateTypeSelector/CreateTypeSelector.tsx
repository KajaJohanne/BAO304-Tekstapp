import { useNavigate, useLocation } from "react-router-dom";
import "./CreateTypeSelector.css";

export default function CreateTypeSelector() {
    //const [selected, setSelected] = useState<CreateType>("Tekstnøkkel");
    const navigate = useNavigate();
    const location = useLocation();

    const selected = location.pathname === "/home" ? "Applikasjon" : "Tekstnøkkel";

    return (
        /* Velg mellom applikasjon og tekstnøkkel */
        <div className="create-type-selector">

            <button
                onClick={() => navigate("/home")}
                className={`create-type-selector_button ${
                    selected === "Applikasjon" ? "create-type-selector_button-selected" : ""
                }`}
            >
                Applikasjon
            </button>
            <button
                onClick={() => navigate("/textkeys")}
                className={`create-type-selector_button ${
                    selected === "Tekstnøkkel" ? "create-type-selector_button-selected" : ""
                }`}
            >
                Tekstnøkkel
            </button>
        </div>
    );
}