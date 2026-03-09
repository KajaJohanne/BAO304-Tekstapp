//Her kommer opprett tekstnøkkel side
import TextTypeSelector from "../components/TextTypeSelector";
import CreateTypeSelector from "../components/CreateTypeSelector";
import TextKeyNameModal from "../components/TextKeyNameModal";
import "./CreateNewTextKeyPage.css";

export default function CreateNewTextKeyPage() {
    return (
        <div className="create-text-key-page">
            <div className="create-text-key-page_content">
                <h1 className="create-text-key-page_title">Legg til ny tekstnøkkel</h1>
                <p className="create-text-key-page_label">Her kan du lage nye tekstnøkler</p>

                 {/* komponent */}
                 <CreateTypeSelector />
                {/* komponent */}
                <TextTypeSelector />
                 {/* komponent */}
                 <TextKeyNameModal />
            </div>
        </div>
    );
}

/*const styles: { [key: string]: CSSProperties } = {
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
};*/