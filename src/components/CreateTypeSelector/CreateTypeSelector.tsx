import { useState } from "react";
import "./CreateTypeSelector.css";
import React from "react";

type CreateType = "Applikasjon" | "Tekstnøkkel";

export default function CreateTypeSelector() {
    const [selected, setSelected] = useState<CreateType>("Tekstnøkkel");

    return (
        <div className="create-type-selector">

            <button
                onClick={() => setSelected("Applikasjon")}
                className={`create-type-selector_button ${
                    selected === "Applikasjon" ? "create-type-selector_button-selected" : ""
                }`}
            >
                Applikasjon
            </button>
            <button
                onClick={() => setSelected("Tekstnøkkel")}
                className={`create-type-selector_button ${
                    selected === "Tekstnøkkel" ? "create-type-selector_button-selected" : ""
                }`}
            >
                Tekstnøkkel
            </button>
        </div>
    );
}