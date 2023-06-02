import { Prisma, PrismaClient } from "@prisma/client";

// only create a new Prisma client if there isn't one already
declare global {
  var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient({
  log: ["query", "info", "warn"],
});


const db = {
  CreateSurveyResponse: async (data: Prisma.SurveyResponseCreateInput) => {
    console.log("Created Survey Response");
    return await prisma.surveyResponse.create({
      data,
    });
  },
  CreateMapMarker: async (data: Prisma.MapMarkerCreateInput) => {
    console.log("Created Map Marker");
    return await prisma.mapMarker.create({
      data,
    });
  },
  GetMapMarkers: async () => {
    // console.log("Getting Map Markers");
    return await prisma.mapMarker.findMany();
  }
};

export default db;