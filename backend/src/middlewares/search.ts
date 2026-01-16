import { prisma } from "../db/prismaClient.js";
import "dotenv/config";

/**
 * Fetches all consulants
 * @param consultantName Consultant's name
 * @returns All consultants that matches search parameter
 */
export async function getConsultantsByName(consultantName: string) {
  const user = await prisma.user.findMany({
    where: {
      name: {
        contains: consultantName,
        mode: "insensitive", // ignores case
      },
    },
  });
  const consultant = await prisma.consultant.findMany({
    where: {
      userId: {
        in: user.map((el) => {
          return el.id;
        }),
      },
    },
  });
  if (user.length === 0) {
    return [];
  }
  return consultant;
}
