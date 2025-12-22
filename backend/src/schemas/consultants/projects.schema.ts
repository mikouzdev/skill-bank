import { z } from "zod";

const ProjectSchema = z.object({
  id: z.number().meta({ example: "1" }),
  description: z
    .string()
    .meta({ example: "A small project done over a weekend." }),
  consultantId: z.number().meta({ example: "1" }),
  name: z.string().meta({ example: "Smol Project" }),
  createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
  start: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
  end: z.date().nullable().meta({ example: "2025-12-19T14:01:24.308Z" }),
  visibility: z.enum(["LIMITED", "PUBLIC"]).meta({ example: "PUBLIC" }),
});

const ProjectLinkSchema = z.object({
  id: z.number().meta({ example: "1" }),
  projectId: z.number().meta({ example: "1" }),
  createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
  url: z.string().meta({ example: "https://example.com" }),
  label: z.string().meta({ example: "Github" }),
});

export const GetProjectsResponseSchema = z.array(
  ProjectSchema.extend({
    projectLinks: z.array(ProjectLinkSchema),
  })
);
