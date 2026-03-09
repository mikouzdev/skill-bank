import { Router, type Request, type Response } from "express";
import { LocalStorageService } from "../../storage/localStorage.js";
import {
  ConsultantIdParamsSchema,
  UpdateConsultantSchema,
} from "../../schemas/consultants/consultants.schema.js";
import { prisma } from "../../db/prismaClient.js";
import { fileTypeFromBuffer } from "file-type";
import { uploadFile } from "../../middlewares/file.js";
import {
  getConsultantsByFilter,
  getConsultantsByJsonFilter,
  getConsultantsByName,
} from "../../middlewares/search.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";
import { JsonFilterSchema } from "../../schemas/consultants/search.schema.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

// TODO: Check all env variables in a single place
const PROFILE_PICTURE_PREFIX =
  process.env.PROFILE_PICTURE_PREFIX ??
  (() => {
    throw new Error("Env missing: PROFILE_PICTURE_PREFIX");
  })();

export const consultantsRouter = Router();

/**
 * Get consultants
 * @route GET /consultants
 * @returns [consultants]
 */
consultantsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const consultants = await prisma.consultant.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.send(consultants);
    return;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P1000") {
        return res
          .status(503)
          .json({ error: "Database authentication failed" });
      }
      if (err.code === "P1001") {
        return res.status(503).json({ error: "Database server unreachable" });
      }

      return res
        .status(503)
        .json({ error: "Database initialization/connection failed" });
    }
    res.status(500).json(err);
    return;
  }
});

/**
 * Get one or more consultants filtered by name search query
 * @route GET /consultants/search
 * @returns [consultants]
 */
consultantsRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const { consultantName } = req.query;
    const foundConsultants = await getConsultantsByName(
      consultantName as string
    );
    res.send(foundConsultants.map((el) => el));
    return;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P1000") {
        return res
          .status(503)
          .json({ error: "Database authentication failed" });
      }
      if (err.code === "P1001") {
        return res.status(503).json({ error: "Database server unreachable" });
      }

      return res
        .status(503)
        .json({ error: "Database initialization/connection failed" });
    }
    res.status(500).json(err);
    return;
  }
});

/**
 * Get one or more consultants filtered by text search query
 * @route GET /consultants/filter
 * @returns [consultants]
 */
consultantsRouter.get("/filter", async (req: Request, res: Response) => {
  try {
    const { freeText } = req.query;
    const foundConsultants = await getConsultantsByFilter(freeText as string);
    res.send(foundConsultants.map((el) => el));

    return;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P1000") {
        return res
          .status(503)
          .json({ error: "Database authentication failed" });
      }
      if (err.code === "P1001") {
        return res.status(503).json({ error: "Database server unreachable" });
      }

      return res
        .status(503)
        .json({ error: "Database initialization/connection failed" });
    }
    res.status(500).json(err);
    return;
  }
});

/**
 * Filter consultants by Json
 * @route POST /consultants/jsonFilter
 * @returns consultant[]
 */
consultantsRouter.post("/jsonFilter", async (req: Request, res: Response) => {
  try {
    const jsonFilter = JsonFilterSchema.safeParse(req.body);

    if (!jsonFilter.success) {
      res.status(500).json(jsonFilter.error);
      return;
    }
    const foundConsultants = await getConsultantsByJsonFilter(jsonFilter.data);
    res.send(foundConsultants.map((el) => el));

    return;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P1000") {
        return res
          .status(503)
          .json({ error: "Database authentication failed" });
      }
      if (err.code === "P1001") {
        return res.status(503).json({ error: "Database server unreachable" });
      }
      if (err.code === "P2003") {
        return res
          .status(400)
          .json({ error: "Invalid reference (related record missing)" });
      }

      return res
        .status(503)
        .json({ error: "Database initialization/connection failed" });
    }
    res.status(500).json(err);
    return;
  }
});

/**
 * Get a specific consultant by ID
 * @route GET /consultants/{consultantId}
 * @returns consultant
 */
consultantsRouter.get("/:consultantId", async (req: Request, res: Response) => {
  const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const consultantId = parsedParams.data.consultantId;

  let consultant = null;
  try {
    consultant = await prisma.consultant.findFirst({
      where: { id: consultantId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (err) {
    res.status(500).json(err);
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P1000") {
        return res
          .status(503)
          .json({ error: "Database authentication failed" });
      }
      if (err.code === "P1001") {
        return res.status(503).json({ error: "Database server unreachable" });
      }
      if (err.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(503)
        .json({ error: "Database initialization/connection failed" });
    }
    return;
  }

  if (consultant === null) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(consultant);
});
/**
 * Update current consultant's profile
 * @route PUT /consultants/me
 * @returns confirmation message
 */
consultantsRouter.put(
  "/me",
  authenticate,
  uploadFile("profilePicture"),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedBody = UpdateConsultantSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { description, roleTitle, user } = parsedBody.data;
    const profilePicture = req.file;
    let profilePictureUrl;
    // Get the URL of the previous image
    let consultant = null;
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (existingUser === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = existingUser?.consultant?.id;

    if (profilePicture !== undefined) {
      let imageType;
      try {
        imageType = await fileTypeFromBuffer(profilePicture.buffer);
      } catch (err) {
        res.status(400).json(err);
        return;
      }

      if (imageType === undefined) {
        return res.status(400).json({ message: "Unknown file type" });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageType.mime)) {
        return res.status(400).json({ message: "Unsupported image type" });
      }
      try {
        if (consultantId !== undefined && consultantId !== null) {
          consultant = await prisma.consultant.findUnique({
            where: { id: consultantId },
          });
          if (consultant === null) {
            res.status(404).json({ message: "Consultant not found" });
            return;
          }
          // Delete the previous image
          const storageService = new LocalStorageService();
          const previousFilename = new URL(
            consultant.profilePictureUrl
          ).pathname
            .split("/")
            .pop();

          if (previousFilename !== undefined) {
            try {
              await storageService.delete(previousFilename);
            } catch (err) {
              res.status(500).json(err);
              return;
            }
          }

          // Add a new picture
          const profilePictureFileName = `${consultantId}_pp${new Date().getTime()}.${
            imageType.ext
          }`;
          profilePictureUrl = `${PROFILE_PICTURE_PREFIX}/${profilePictureFileName}`;
          try {
            await storageService.save(
              profilePictureFileName,
              profilePicture.buffer
            );
            consultant = await prisma.consultant.update({
              where: { id: consultantId },
              data: {
                ...(description !== undefined ? { description } : {}),
                ...(roleTitle !== undefined ? { roleTitle } : {}),
                ...(profilePictureUrl !== undefined
                  ? { profilePictureUrl }
                  : {}),
                user: {
                  update: {
                    ...(user?.name !== undefined ? { name: user.name } : {}),
                  },
                },
              },
            });
          } catch (err) {
            res.status(500).json(err);
            return;
          }
        }
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    } else {
      try {
        if (consultantId !== undefined && consultantId !== null) {
          consultant = await prisma.consultant.findUnique({
            where: { id: consultantId },
          });
          if (consultant === null) {
            res.status(404).json({ message: "Consultant not found" });
            return;
          }
          consultant = await prisma.consultant.update({
            where: { id: consultantId },
            data: {
              ...(description !== undefined ? { description } : {}),
              ...(roleTitle !== undefined ? { roleTitle } : {}),
              user: {
                update: {
                  ...(user?.name !== undefined ? { name: user.name } : {}),
                },
              },
            },
          });
        }
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === "P1000") {
            return res
              .status(503)
              .json({ error: "Database authentication failed" });
          }
          if (err.code === "P1001") {
            return res
              .status(503)
              .json({ error: "Database server unreachable" });
          }
          if (err.code === "P2002") {
            return res
              .status(409)
              .json({ error: `Duplicate entry: already exists` });
          }
          if (err.code === "P2025") {
            return res.status(404).json({ error: "User not found" });
          }

          return res
            .status(503)
            .json({ error: "Database initialization/connection failed" });
        }
        res.status(500).json(err);
        return;
      }
    }
    res.json(consultant);
  }
);
