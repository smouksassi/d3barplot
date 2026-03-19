

import Barplot from "./Barplot";
import { data } from "./countryData";



function App() {
  return (
    <div style={{ padding: 32 }}>
      <h2>Students by Country</h2>
      <Barplot data={data} />
    </div>
  );
}

export default App;