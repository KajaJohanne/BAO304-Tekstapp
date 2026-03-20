import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser, type Environment } from "../../api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [allowedEnvironments, setAllowedEnvironments] = useState<Environment[]>(
    [],
  );

  const toggleEnvironment = (environment: Environment) => {
    setAllowedEnvironments((prev) =>
      prev.includes(environment)
        ? prev.filter((env) => env !== environment)
        : [...prev, environment],
    );
  };

  const handleSaveUser = async () => {
    console.log("Heia");
    if (!name.trim() || !email.trim()) {
      window.alert("Du må fylle inn navn og e-post.");
      return;
    }


    const response = await saveUser({
      name,
      email,
      allowedEnvironments,
    });
    console.log(response);
    console.log(import.meta.env.PROJECT_ID)

    if (response) {
      window.alert(`Feil: ${response}`);
    } else {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name,
          email,
          allowedEnvironments,
        }),
      );

      window.alert("Bruker lagret i Firebase");
      navigate("/home");
    }
    
  };

  console.log(name, allowedEnvironments, email); 

  return (
    <div style={{ padding: "24px", maxWidth: "500px" }}>
      <h1>Opprett bruker</h1>

      <div style={{ marginBottom: "16px" }}>
        <label>Navn</label>
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>E-post</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <p>Velg hvilke miljøer brukeren skal ha tilgang til:</p>

        <label>
          <input
            type="checkbox"
            checked={allowedEnvironments.includes("utv")}
            onChange={() => toggleEnvironment("utv")}
          />
          Utv
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={allowedEnvironments.includes("test")}
            onChange={() => toggleEnvironment("test")}
          />
          Test
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={allowedEnvironments.includes("prod")}
            onChange={() => toggleEnvironment("prod")}
          />
          Prod
        </label>
      </div>

      <button onClick={() => handleSaveUser()}>Lagre bruker</button>
    </div>
  );
};

export default LoginPage;
