// Her kommer detaljer over valgt tekstnøkkel 

import { useParams } from "react-router-dom";

const TextKeyDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="page">

      <h1>Rediger tekstnøkkel</h1>

      <h2>{id}</h2>

      <div className="environment">
        <button>UTV</button>
        <button>TEST</button>
        <button>PROD</button>
      </div>

      <h3>Overskrift</h3>

      <div className="form">

        <div className="row">
          <label>Bokmål</label>
          <input type="text" />
        </div>

        <div className="row">
          <label>Nynorsk</label>
          <input type="text" />
        </div>

        <div className="row">
          <label>Engelsk</label>
          <input type="text" />
        </div>

      </div>

      <div className="buttons">
        <button>Lagre</button>
        <button>Avbryt</button>
      </div>

    </div>
  );
};

export default TextKeyDetailPage;