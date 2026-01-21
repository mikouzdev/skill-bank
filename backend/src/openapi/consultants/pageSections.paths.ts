import {
    GetPageSectionsResponseSchema,
    ConsultantIdSectionNameParamsSchema
} from "../../schemas/consultants/pageSections.schema.js";


export const pageSectionsPaths = {
    "/consultants/{consultantId}/sections": {
        get: {
            summary: "Get all page sections of a consultant",
            tags: ["Consultants", "Page Sections"],
            parameters: [
                {
                    name: "consultantId",
                    in: "path" as const,
                    required: true,
                    schema: { type: "integer" as const },
                },
            ],
            responses: {
                200: {
                    description: "Retrieval successful",
                    content: {
                        "application/json": { schema: GetPageSectionsResponseSchema },
                    },
                },
                400: { description: "Invalid consultant id" },
                500: { description: "Server error" },
            },
        },
    },
    "/consultants/{consultantId}/sections/{sectionName}": {
        get: {
            summary: "Get a page section of a consultant",
            tags: ["Consultants", "Page Sections"],
            parameters: [
                {
                    name: "consultantId",
                    in: "path" as const,
                    required: true,
                    schema: { type: "integer" as const },
                },
                {
                    name: "sectionName",
                    in: "path" as const,
                    required: true,
                    schema: { 
                        type: "string" as const,
                        enum: ["GENERAL", "NETWORKING_LINKS", "DESCRIPTION", "SKILLS", "EMPLOYMENTS", "PROJECTS"]
                    },
                },
            ],
            responses: {
                200: {
                    description: "Retrieval successful",
                    content: {
                        "application/json": { schema: GetPageSectionsResponseSchema },
                    },
                },
                400: { description: "Invalid consultant id" },
                500: { description: "Server error" },
            },
        },
    },
}