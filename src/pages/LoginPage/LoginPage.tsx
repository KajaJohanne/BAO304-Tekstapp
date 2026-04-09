import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, type Environment } from "../../../api";
import { ValidationMessage } from "@digdir/designsystemet-react";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [allowedEnvironments, setAllowedEnvironments] = useState<Environment[]>(
    [],
  );

  const [errorMessage, setErrorMessage] = useState("");

  const toggleEnvironment = (environment: Environment) => {
    setAllowedEnvironments((prev) =>
      prev.includes(environment)
        ? prev.filter((env) => env !== environment)
        : [...prev, environment],
    );
  };
  const isValideEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const resetMessage = () => {
    setErrorMessage("");
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setAllowedEnvironments([]);
  };

  const handleRegister = async () => {
    resetMessage();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !password.trim() ||
      !repeatPassword.trim()
    ) {
      setErrorMessage("Du må fylle inn alle feltene for å fortsette.");
      return;
    }

    if (!isValideEmail(trimmedEmail)) {
      setErrorMessage("Du må skrive inn en gyldig e-post");
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage("Passord samsvarer ikke, prøv igjen.");
      return;
    }

    const response = await registerUser(
      trimmedName,
      trimmedEmail,
      password,
      allowedEnvironments,
    );

    if (response) {
      setErrorMessage(response);
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        allowedEnvironments,
      }),
    );

    setTimeout(() => {
      navigate("/home");
    }, 400);
  };

  const handleLogin = async () => {
    resetMessage();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      setErrorMessage("Du må fylle inn e-post og passord.");
      return;
    }

    if (!isValideEmail(trimmedEmail)) {
      setErrorMessage("Du må skrive inn en gyldig e-postadresse.");
      return;
    }

    const response = await loginUser(trimmedEmail, password);

    if ("error" in response) {
      setErrorMessage(response.error);
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(response.user));

    setTimeout(() => {
      navigate("/home");
    }, 400);
  };

  useEffect(() => {
    resetMessage();
  }, [isRegisterMode]);

  return (
    <div className="login-page">
      <img
        src="/images/statens-vegvesen-logo-header.svg"
        alt="Statens vegvesen"
        className="logoVegvesen"
      />

      <div className="login-card">
        <div className="login-header">
          <h1>{isRegisterMode ? "Opprett bruker" : "Logg inn på Tekstapp"}</h1>
          <p>
            {isRegisterMode
              ? "For ansatte hos Statens vegvesen"
              : "For ansatte hos Statens vegvesen"}
          </p>
        </div>

        {isRegisterMode && (
          <div className="form-group">
            <label htmlFor="name">Navn</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Passord</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isRegisterMode && (
          <>
            <div className="form-group">
              <label htmlFor="repeatPassword">Gjenta passord</label>
              <input
                id="repeatPassword"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <p className="environment-title">
                Hvilke miljø skal denne brukeren ha tilgang til?
              </p>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={allowedEnvironments.includes("utv")}
                  onChange={() => toggleEnvironment("utv")}
                />
                Utv
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={allowedEnvironments.includes("test")}
                  onChange={() => toggleEnvironment("test")}
                />
                Test
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={allowedEnvironments.includes("prod")}
                  onChange={() => toggleEnvironment("prod")}
                />
                Prod
              </label>
            </div>
          </>
        )}
        {errorMessage && (
          <div>
            <ValidationMessage data-color="warning" className="error-message">
              {errorMessage}
            </ValidationMessage>
          </div>
        )}

        <button
          className="login-button"
          onClick={isRegisterMode ? handleRegister : handleLogin}
        >
          {isRegisterMode ? "Opprett bruker" : "Logg inn"}
        </button>

        <button
          type="button"
          className="toggle-button"
          onClick={() => {
            setIsRegisterMode((prev) => !prev);
            resetForm();
          }}
        >
          {isRegisterMode
            ? "Har du allerede en bruker? Logg inn"
            : "Har du ikke bruker? Opprett ny"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
