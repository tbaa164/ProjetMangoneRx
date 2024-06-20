import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



// import React, { useState, useRef } from 'react';
// import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
// import { FeatureGroup } from 'react-leaflet';
// import { EditControl } from 'react-leaflet-draw';
// import * as turf from '@turf/turf';
// import { MDBInput, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';

// const App = () => {
//   const [inputs, setInputs] = useState({
//     surfaceCampus: '',
//     nombreUtilisateurs: '',
//     typesAppareils: '',
//     applicationsCritiques: '',
//     puissanceEntree: '',
//     attenuationFibre: '',
//     longueurFibre: '',
//     pertesConnecteurs: '',
//     nbConnecteurs: '',
//     pertesPanneaux: '',
//     nbPanneaux: '',
//     pertesEpissuresFusion: '',
//     nbEpissuresFusion: '',
//     pertesEpissuresMecanique: '',
//     nbEpissuresMecanique: '',
//     sensibiliteRecepteur: ''
//   });

//   const [polygon, setPolygon] = useState([]);
//   const [results, setResults] = useState({
//     puissanceRecue: null,
//     margePuissance: null,
//     nombreAp: null
//   });
//   const [area, setArea] = useState(0); // Nouvel état pour la superficie
//   const mapRef = useRef();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
//   };

//   const handlePolygonCreate = (e) => {
//     const layer = e.layer;
//     let polygonCoords = layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);

//     // Add the first point to the end to form a closed polygon
//     polygonCoords.push(polygonCoords[0]);

//     setPolygon(polygonCoords);

//     const turfPolygon = turf.polygon([polygonCoords]);
//     const area = turf.area(turfPolygon);
//     setArea(area); // Update area state in m²
//   };
//   const calculateSurface = (polygon) => {
//     const turfPolygon = turf.polygon([polygon]);
//     const area = turf.area(turfPolygon);
//     return area; // Surface en m²
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const surface = calculateSurface(polygon);

//     // Calcul de dimensionnement basé sur la surface et les entrées du formulaire
//     const densiteUtilisateurs = parseInt(inputs.nombreUtilisateurs) / surface;
//     const nombreAp = densiteUtilisateurs / 50;

//     // Calculs fictifs de puissance pour l'exemple
//     const puissanceRecue = parseFloat(inputs.puissanceEntree) -
//       (parseFloat(inputs.attenuationFibre) * parseFloat(inputs.longueurFibre)) -
//       (parseFloat(inputs.pertesConnecteurs) * parseFloat(inputs.nbConnecteurs)) -
//       (parseFloat(inputs.pertesPanneaux) * parseFloat(inputs.nbPanneaux)) -
//       (parseFloat(inputs.pertesEpissuresFusion) * parseFloat(inputs.nbEpissuresFusion)) -
//       (parseFloat(inputs.pertesEpissuresMecanique) * parseFloat(inputs.nbEpissuresMecanique));

//     const margePuissance = puissanceRecue - parseFloat(inputs.sensibiliteRecepteur);

//     setResults({ puissanceRecue, margePuissance, nombreAp });
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div className='row' style={{ border: '1px solid grey', padding: '10px', marginRight: '10px' }}>
//           <div className='col-md-9'>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Surface du Campus (m²)' id='surfaceCampus' name='surfaceCampus' value={area ? area.toFixed(2) : ''} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Nombre dUtilisateurs Simultanés' id='nombreUtilisateurs' name='nombreUtilisateurs' value={inputs.nombreUtilisateurs} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Types dAppareils' id='typesAppareils' name='typesAppareils' value={inputs.typesAppareils} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Applications Critiques' id='applicationsCritiques' name='applicationsCritiques' value={inputs.applicationsCritiques} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Puissance d’Entrée (dBm)' id='puissanceEntree' name='puissanceEntree' value={inputs.puissanceEntree} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Atténuation de la Fibre (dB/Km)' id='attenuationFibre' name='attenuationFibre' value={inputs.attenuationFibre} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Longueur de la Fibre (Km)' id='longueurFibre' name='longueurFibre' value={inputs.longueurFibre} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Pertes des Connecteurs (dB)' id='pertesConnecteurs' name='pertesConnecteurs' value={inputs.pertesConnecteurs} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Nombre de Connecteurs' id='nbConnecteurs' name='nbConnecteurs' value={inputs.nbConnecteurs} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Pertes des Panneaux (dB)' id='pertesPanneaux' name='pertesPanneaux' value={inputs.pertesPanneaux} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Nombre de Panneaux' id='nbPanneaux' name='nbPanneaux' value={inputs.nbPanneaux} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Pertes des Épissures par Fusion (dB)' id='pertesEpissuresFusion' name='pertesEpissuresFusion' value={inputs.pertesEpissuresFusion} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Nombre dÉpissures par Fusion' id='nbEpissuresFusion' name='nbEpissuresFusion' value={inputs.nbEpissuresFusion} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Pertes des Épissures Mécaniques (dB)' id='pertesEpissuresMecanique' name='pertesEpissuresMecanique' value={inputs.pertesEpissuresMecanique} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBRow className='mb-4'>
//               <MDBCol>
//                 <MDBInput label='Nombre dÉpissures Mécaniques' id='nbEpissuresMecanique' name='nbEpissuresMecanique' value={inputs.nbEpissuresMecanique} onChange={handleInputChange} />
//               </MDBCol>
//               <MDBCol>
//                 <MDBInput label='Sensibilité du Récepteur (dBm)' id='sensibiliteRecepteur' name='sensibiliteRecepteur' value={inputs.sensibiliteRecepteur} onChange={handleInputChange} />
//               </MDBCol>
//             </MDBRow>
//             <MDBBtn type='submit'>Calculer</MDBBtn>
//           </div>
//         </div>
//       </form>
//       <div className='col-md-9' style={{ height: '500px', margin: '20px 0' }}>
//         <MapContainer center={[14.679718147581854, -17.465773759118886]} zoom={21} style={{ height: '100%' }} ref={mapRef}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <FeatureGroup>
//             <EditControl
//               position='topright'
//               onCreated={handlePolygonCreate}
//               draw={{
//                 rectangle: false,
//                 circle: false,
//                 circlemarker: false,
//                 marker: false,
//                 polyline: false
//               }}
//             />
//             {polygon.length > 0 && <Polygon positions={polygon} />}
//           </FeatureGroup>
//         </MapContainer>
//       </div>

//       {results.puissanceRecue !== null && (
//         <div className='results'>
//           <h4>Résultats des calculs</h4>
//           <p>Puissance reçue: {results.puissanceRecue.toFixed(2)} dBm</p>
//           <p>Marge de puissance: {results.margePuissance.toFixed(2)} dB</p>
//           <p>Nombre estimé de points d'accès: {results.nombreAp.toFixed(2)}</p>
//         </div>
//       )}
//     </div>
//   );
// };
// export default App;