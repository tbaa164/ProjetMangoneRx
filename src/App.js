import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import * as turf from '@turf/turf';
import { MDBInput, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

// Configurer les icônes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
});

const App = () => {
  const [inputs, setInputs] = useState({
    surfaceCampus: '',
    nombreUtilisateurs: '',
    besoinsBandePassante: '',
    capaciteAp: '',
    couvertureAp: ''
  });

  const [polygon, setPolygon] = useState([]);
  const [results, setResults] = useState({
    nombreAp: null
  });
  const [area, setArea] = useState(0); // Nouvel état pour la superficie
  const [apPositions, setApPositions] = useState([]); // Nouvel état pour les positions des APs
  const mapRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handlePolygonCreate = (e) => {
    const layer = e.layer;
    let polygonCoords = layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);

    // Add the first point to the end to form a closed polygon
    polygonCoords.push(polygonCoords[0]);

    setPolygon(polygonCoords);

    const turfPolygon = turf.polygon([polygonCoords]);
    const area = turf.area(turfPolygon);
    setArea(area); // Update area state in m²

    console.log('Polygon:', polygonCoords); // Ajouter un log pour le polygone
    console.log('Area:', area); // Ajouter un log pour la surface
  };

  const generateApPositions = (polygon, numAp) => {
    // Générer une grille de points dans le rectangle englobant du polygone
    const turfPolygon = turf.polygon([polygon]);
    const area = turf.area(turfPolygon);
    const boundingBox = turf.bbox(turfPolygon);
    const grid = turf.pointGrid(boundingBox, Math.sqrt(area / numAp), { units: 'meters' });

    // Filtrer les points qui sont à l'intérieur du polygone
    const apPositions = grid.features.filter((feature) => {
      const point = turf.point(feature.geometry.coordinates);
      return turf.booleanPointInPolygon(point, turfPolygon);
    });

    return apPositions.map((feature) => [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extrait les valeurs des champs de saisie
    const surface_campus = area;
    const utilisateurs_simultanes = parseInt(inputs.nombreUtilisateurs);
    const besoins_bande_passante = parseInt(inputs.besoinsBandePassante);
    const capacite_ap = parseInt(inputs.capaciteAp);
    const couverture_ap = parseInt(inputs.couvertureAp);

    // Calcul de la densité d'utilisateurs
    const densite_utilisateurs = utilisateurs_simultanes / surface_campus;

    // Calcul du nombre d'AP nécessaires en fonction de la couverture
    const nombre_ap_couverture = surface_campus / couverture_ap;

    // Calcul de la bande passante totale requise
    const bande_passante_totale = utilisateurs_simultanes * besoins_bande_passante;

    // Calcul du nombre d'AP nécessaires en fonction de la capacité
    const nombre_ap_capacite = bande_passante_totale / capacite_ap;

    // Prendre le maximum des deux pour s'assurer que les besoins sont couverts
    const nombre_ap = Math.max(nombre_ap_couverture, nombre_ap_capacite);

    // Mettre à jour l'état avec le nombre d'AP calculé
    setResults({ nombreAp: nombre_ap });

    // Générer les positions des APs
    const apPositions = generateApPositions(polygon, nombre_ap);
    console.log('AP Positions:', apPositions); // Ajouter un log pour les positions des APs
    setApPositions(apPositions);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='row' style={{ border: '1px solid grey', padding: '10px', marginRight: '10px' }}>
          <div className='col-md-9'>
            <MDBRow className='mb-4'>
              <MDBRow className='mb-4'>
                <MDBCol>
                  <MDBInput label='Surface du Campus (m²)' id='surfaceCampus' name='surfaceCampus' value={area ? area.toFixed(2) : ''} onChange={handleInputChange} />
                </MDBCol>
              </MDBRow>

              <MDBCol>
                <MDBInput label='Nombre dUtilisateurs Simultanés' id='nombreUtilisateurs' name='nombreUtilisateurs' value={inputs.nombreUtilisateurs} onChange={handleInputChange} />
              </MDBCol>
              <MDBCol>
                <MDBInput label='Besoins de Bande Passante (Mbps)' id='besoinsBandePassante' name='besoinsBandePassante' value={inputs.besoinsBandePassante} onChange={handleInputChange} />
              </MDBCol>
            </MDBRow>
            <MDBRow className='mb-4'>
              <MDBCol>
                <MDBInput label='Capacité de l’AP (Mbps)' id='capaciteAp' name='capaciteAp' value={inputs.capaciteAp} onChange={handleInputChange} />
              </MDBCol>
              <MDBCol>
                <MDBInput label='Couverture de l’AP (m²)' id='couvertureAp' name='couvertureAp' value={inputs.couvertureAp} onChange={handleInputChange} />
              </MDBCol>
            </MDBRow>
            <MDBBtn type='submit'>Calculer</MDBBtn>
          </div>
          <div className='col-md-3'>
            <h5>Résultats</h5>
            <p>Nombre de Points d'Accès: {results.nombreAp !== null ? results.nombreAp.toFixed(2) : 'N/A'}</p>
          </div>
        </div>
      </form>

      <MapContainer
        center={[14.679718147581854, -17.465773759118886]}
        zoom={21}
        style={{ height: '500px', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position='topright'
            onCreated={handlePolygonCreate}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              polyline: false,
              marker: false,
            }}
          />
        </FeatureGroup>

        {polygon.length > 0 && (
          <Polygon positions={polygon} />
        )}

        {apPositions.map((position, index) => (
          <Marker
            key={index}
            position={[position[1], position[0]]}
            icon={new L.Icon({
              iconUrl: 'https://static.vecteezy.com/system/resources/previews/023/456/369/non_2x/wifi-wireless-signal-3d-icon-isolated-on-transparent-background-gold-texture-3d-rendering-free-png.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              AP #{index + 1}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
