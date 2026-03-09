import { useState } from "react";
import type { CSSProperties } from "react";

type CreateType = "Applikasjon" | "Tekstnøkkel";

export default function CreateTypeSelector() {
    const [selected, setSelected] = useState<CreateType>("Tekstnøkkel");

    return (
        <div style={styles.container}>
            <button
                onClick={() => setSelected("Applikasjon")}
                style={{
                    ...styles.button,
                    ...(selected === "Applikasjon" ? styles.selected : {}),
                }}
            >
                Applikasjon
            </button>
            <button
                onClick={() => setSelected("Tekstnøkkel")}
                style={{
                    ...styles.button,
                    ...(selected === "Tekstnøkkel" ? styles.selected : {}),
                }}
            >
                Tekstnøkkel
            </button>
        </div>
    );
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: "flex",
        gap: "24px",
        marginTop: "24px",
        marginBottom: "32px",
    },
    button: {
        width: "200px",
        height: "60px",
        fontSize: "18px",
        backgroundColor: "#F5F5F5",
        border: "2px solid #6b6f73",
        cursor: "pointer",
        color: "black",
    },
    selected: {
        border: "3px solid #ff9100",
    },
};