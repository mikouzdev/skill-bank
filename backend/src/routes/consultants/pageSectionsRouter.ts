import { Router, type Request, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import { ConsultantIdSectionNameParamsSchema, SectionNameParamsSchema, PageSectionBodySchema } from "../../schemas/consultants/pageSections.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import { authenticate } from "../../middlewares/authentication.js";

export const pageSectionsRouter = Router();

/**
 * Get a consultant's page sections
 * @route GET /consultants/{consultantId}/sections
 * @returns [sections]
 */
pageSectionsRouter.get(
  "/:consultantId/sections",
  async (req: Request, res: Response) => {
    const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId } = parsedParams.data;
    // Visibility for now, auth based later
    //Sales/admin can see everyone, consult gets only public
    //Visibility.LIMITED
    const allowedVisibilities = [Visibility.PUBLIC];
    let sections = null;
    try {
      sections = await prisma.pageSection.findMany({
        where: {
          consultantId,
          visibility: {
            in: allowedVisibilities,
          },
        },
        include: {
          comments: true
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(sections);
});
/**
 * Get a consultant's page section by name
 * @route GET /consultants/{consultantId}/sections/{sectionName}
 * @returns page section
 */
//TODO: make this only available for sales and admin roles
pageSectionsRouter.get(
  "/:consultantId/sections/:sectionName", authenticate,
  async (req: Request, res: Response) => {
    const parsedParams = ConsultantIdSectionNameParamsSchema.safeParse(
      req.params
    );
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId, sectionName } = parsedParams.data;
    
    let pageSection = null;
    try {
      pageSection = await prisma.pageSection.findFirst({
        where: { 
          name: sectionName,
          consultantId: consultantId
        },
        include: {
          comments: {

          },
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    if (pageSection === null) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(pageSection);
  });
/**
 * Update a page section
 * @route PUT /consultants/me/sections/{sectionName}
 * @returns updated page section
 */
pageSectionsRouter.put(
  "/me/sections/:sectionName", authenticate,
  async (req: Request, res: Response) => {
    const parsedParams = SectionNameParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { sectionName } = parsedParams.data;

    const parsedBody = PageSectionBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { name, visibility } = parsedBody.data;

    // TODO: use consultantId from a JWT token instead of getting the first
    //       entry from the database
    let consultantId;
    try {
      const consultant = await prisma.consultant.findFirst();
      if (consultant === null) {
        res.status(404).json({ message: "No mock data found" });
        return;
      }
      consultantId = consultant.id;
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    let pageSection = null;
    try {
      pageSection = await prisma.pageSection.update({
        where: {
          consultantId_name: {
            consultantId,
            name: sectionName,
          }
        },
        data: {
          name,
          visibility,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(pageSection);

});