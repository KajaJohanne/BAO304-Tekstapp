// Homepage == Applications?
/*
const HomePage = () => {
  return <div>Home Page == oversikt over alle applikasjoner</div>;
};

export default HomePage;
*/

// test data for å prøve å laste opp til firebase:
import { uploadData } from "../../api";

const HomePage = () => {
  const handleUpload = async () => {
    const response = await uploadData({
      name: "Kari Nordmann",
      age: 40,
    });

    if (response) {
      window.alert(`Error: ${response}`);
    } else {
      window.alert("Data uploaded!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Home Page</h1>
      <p>Test for å legge til i firebase:</p>
      <div style={{ padding: "20px", color: "blue" }}>
        <p>Navn: Kari Nordmann</p>
        <p>Alder: 40år</p>
      </div>

      <button
        onClick={handleUpload}
        style={{ backgroundColor: "darkblue", color: "white" }}
      >
        Upload til Firebase
      </button>
    </div>
  );
};

export default HomePage;
