"use client";

import { LatLng, Icon } from "leaflet";
import { ReactElement, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
// import L from "leaflet";

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

type MapMarker = {
  lat: number;
  lng: number;
  name?: string;
  description?: string;
  icon?: string;
  iconSize?: [number, number];
};

type MapMarkerWithAlumni = MapMarker & { isAlumni: boolean };

const defaultIcon = new Icon({
  iconUrl: "/leaflet/marker-icon-2x.png",
  iconSize: [20, 32],
});

const greyIcon = new Icon({
  iconUrl: "/leaflet/marker-icon-grey-2x.png",
  iconSize: [20, 32],
});

const mvnuIcon = new Icon({
  iconUrl: "/leaflet/mvnu-icon.png",
  iconSize: [32, 32],
})

const QUERY_DELAY = 10000;

function LocationMarkers() {
  const [markers, setMarkers] = useState<MapMarkerWithAlumni[]>([]);

  const GetMapMarkersFromApi = async () => {
    const response = await fetch("/api/mapdata", { next: { revalidate: 10 } });
    const data = await response.json();
    console.log("🚀 ~ file: map.tsx:21 ~ GetMapMarkersFromApi ~ data:", data);

    if (!data || data.length < 1) return;

    // convert data to object array
    const newMarkers: MapMarkerWithAlumni[] = data.map((marker: MapMarkerWithAlumni) => {
      return {
        ...marker,
        lat: marker.lat,
        lng: marker.lng,
        isAlumni: marker.isAlumni,
      };
    });
    
    /* const newMarkers: [boolean, LatLng][] = data.map((marker: MapMarker & { isAlumni: boolean }) => {
      return [marker.isAlumni, new LatLng(marker.lat, marker.lng)];
    }); */

    setMarkers(newMarkers);
  };

  useEffect(() => {
    GetMapMarkersFromApi();

    const queryInterval = setInterval(GetMapMarkersFromApi, QUERY_DELAY);

    return () => {
      clearInterval(queryInterval);
    };
  }, []);

  return (
    <>
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} icon={marker.isAlumni ? defaultIcon : greyIcon}></Marker>
      ))}
    </>
  );
}

export default function Map() {
  return (
    <MapContainer
      center={[25, 0]}
      zoom={2.5}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[40.37403, -82.46982]} icon={mvnuIcon} />
      <LocationMarkers />
    </MapContainer>
  );
}
