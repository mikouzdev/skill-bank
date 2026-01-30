import { z } from "zod";

export const ProjectSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    description: z
      .string()
      .meta({ example: "A small project done over a weekend." }),
    consultantId: z.number().meta({ example: "1" }),
    name: z.string().meta({ example: "Smol Project" }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    updatedAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    start: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    end: z.date().nullable().meta({ example: "2025-12-19T14:01:24.308Z" }),
    visibility: z.enum(["LIMITED", "PUBLIC"]).meta({ example: "PUBLIC" }),
  })
  .meta({ id: "Project" });

export const ProjectLinkSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    projectId: z.number().meta({ example: "1" }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    url: z.string().meta({ example: "https:\/\/example.com" }),
    label: z.string().meta({ example: "Github" }),
  })
  .meta({ id: "ProjectLink" });

export const ProjectSkillSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    projectId: z.number().meta({ example: "2" }),
    skillTagName: z.string().meta({ example: "Python" }),
  })
  .meta({ id: "ProjectSkill" });

export const PostProjectLinkBodySchema = ProjectLinkSchema.pick({
  url: true,
  label: true,
});

export const DeleteProjectLinkParamsSchema = z.object({
  projectId: z.coerce.number().meta({ example: "1" }),
  linkId: z.coerce.number().meta({ example: "2" }),
});

export const ProjectIdParamsSchema = z.object({
  projectId: z.coerce.number().meta({ example: "1" }),
});

export const GetProjectsResponseSchema = z
  .array(
    ProjectSchema.extend({
      projectLinks: z.array(ProjectLinkSchema),
      projectSkills: z.array(ProjectSkillSchema),
    })
  )
  .meta({ id: "GetProjectsResponse" });

export const ProjectBodySchema = ProjectSchema.omit({
  id: true,
  consultantId: true,
  createdAt: true,
})
  .extend({
    start: z.coerce.date(),
    end: z.coerce.date().nullable().optional(),
    projectSkills: z.array(ProjectSkillSchema),
  })
  .refine((project) => (project.end ? project.start <= project.end : true), {
    message: "End date must be a later or equal date to start date",
    path: ["end"],
  });

export const DeleteProjectSkillParamsSchema = z.object({
  projectId: z.coerce.number().meta({ example: "1" }),
  projectSkillId: z.coerce.number().meta({ example: "2" }),
});

export const PostProjectSkillBodySchema = ProjectSkillSchema.pick({
  skillTagName: true,
});
