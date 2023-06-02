import { SurveyResponse } from "@/app/usersurvey/page";
import db from "@/db";
import { NextRequest, NextResponse } from "next/server";

const ProcessLocationsAndCreateMarkers = async (locations: string[], data: Pick<SurveyResponse, "name" | "isAlumni">) => {
  // use nominatim to search for each location, get the data in JSON format, and create a marker with the lat and long
  // https://nominatim.org/release-docs/develop/api/Search/

  // Note: To comply with the usage policy of the Nominatim service, only one request per second should be made.
  // https://operations.osmfoundation.org/policies/nominatim/

  console.log("DATA: ", locations);

  // const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${data[0]}&format=json&limit=1`);
  // const json = await res.json();

  // homeLocations.push([json[0].lat, json[0].lon]);

  locations.forEach((location, index) => {
    setTimeout(async () => {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`);
      const json = await res.json();
      console.log(`🚀 ~ file: route.ts:42 ~ setTimeout-${(1000 * index) + 1500} ~ json:`, json);

      await db.CreateMapMarker({
        lat: Number(json[0].lat),
        lng: Number(json[0].lon),
        name: data?.name ?? "Anonymous",
        isAlumni: data?.isAlumni ?? false,
      });
    }, (1000 * index) + 1500);
  });
};

const CreateSurveyResponse = async (data: SurveyResponse) => {
  await ProcessLocationsAndCreateMarkers(data.homeLocations, { name: data.name, isAlumni: data.isAlumni });
  data.travelLocationsWithMvnu && await ProcessLocationsAndCreateMarkers(data.travelLocationsWithMvnu, { name: data.name, isAlumni: data.isAlumni });
  await ProcessLocationsAndCreateMarkers(data.travelLocationsWithoutMvnu, { name: data.name, isAlumni: data.isAlumni });

  const res = await db.CreateSurveyResponse({
    name: data.name,
    email: data.email,
    isAlumni: data.isAlumni,
    homeLocations: data.homeLocations?.join("|") ?? "",
    travelLocationsWithMvnu: data.travelLocationsWithMvnu?.join("|") ?? "",
    travelLocationsWithoutMvnu: data.travelLocationsWithoutMvnu?.join("|") ?? "",
  });
  // const res =  await db.CreateSurveyResponse({
  //   name: "Jason",
  //   email: "jason@onyxsimple.com",
  //   isAlumni: true,
  //   homeLocations: "123",
  //   travelLocationsWithMvnu: "123456",
  //   travelLocationsWithoutMvnu: "123456789",
  // });

  return res;
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  console.log("🚀 ~ file: route.ts:17 ~ POST ~ data:", data);
  const res = await CreateSurveyResponse(data);

  return NextResponse.json({ res });
};