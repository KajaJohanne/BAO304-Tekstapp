//Her kommer opprett tekstnøkkel side
import TextTypeSelector from "../components/TextTypeSelector";
import CreateTypeSelector from "../components/CreateTypeSelector";
import type { CSSProperties } from "react";

export default function CreateNewTextKeyPage() {
    return (
        <div style={styles.page}>
            <div style={styles.content}>
                <h1 style={styles.title}>Legg til ny tekstnøkkel</h1>
                <p style={styles.label}>Her kan du lage nye tekstnøkler</p>

                 {/* komponent */}
                 <CreateTypeSelector />

                {/* komponent */}
                <TextTypeSelector />
            </div>
        </div>
    );
}

const styles: { [key: string]: CSSProperties } = {
    page: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
    },
    content: {
        width: "900px",
        marginLeft: "150px",
        paddingTop: "80px",
        textAlign: "left",
    },
    title: {
        margin: 0,
        marginBottom: "12px",
        color: "black",
        fontSize: "40px",
        fontWeight: 400,
        textAlign: "left",
    },
    label: {
        margin: 0,
        marginBottom: "12px",
        fontWeight: 400,
        fontSize: "16px",
        color: "black",
        textAlign: "left",
    },
};