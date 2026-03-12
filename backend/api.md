# API Endpoints

## Authorization / Session

#### POST /auth/login

**Input:** credentials (email / username + password) **Output:** access token (JWT or session)

#### POST /auth/logout

**Input:** token / session\
**Output:** logout confirmation

#### GET /auth/me

**Input:** auth token\
**Output:** current user identity and role(s)

---

## Admin

#### GET /admin/users

**Input:** auth token\
**Output:** user list

#### POST /admin/users

**Input:** user data and role(s)\
**Output:** created user

#### PUT /admin/users/{userId}

**Input:** updated user data\
**Output:** updated user

#### DELETE /admin/users/{userId}

**Input:** userId\
**Output:** confirmation

#### PUT /admin/consultants/{consultantId}

**Input:** consultantId, updated data **Output:** updated consultant data

---

## Consultants

### Personal endpoints for the logged-in user

#### GET /consultants/me

**Input:** auth token\
**Output:** full consultant profile

#### PUT /consultants/me

**Input:** profile fields to be updated\
**Output:** updated profile

### Endpoints for all

#### GET /consultants

**Input:** optional filters (skills, expireince, proficiency), q (free text), sort **Output:** list of consultants (visibility)

#### GET /consultants/{consultantId}

**Input:** consultantId\
**Output:** consultant profile (visibility)

---

## Page Sections

#### GET /consultants/{consultantId}/sections

**Input:** consultantId\
**Output:** page sections available

#### GET /consultants/{consultantId}/sections/{sectionName}

**Input:** consultantId + sectionName\
**Output:** page section data

#### PUT /consultants/me/sections/{sectionName}

**Input:** section content + visibility\
**Output:** updated section

---

## Consultant Skills

#### GET /consultants/skills/{consultantId}

**Input:** consultantId\
**Output:** consultant skills

#### POST /consultants/skills/me

**Input:** skillName + proficiency\
**Output:** added skill

#### PUT /consultants/skills/me/{skillId}

**Input:** skillId, updated skill level\
**Output:** updated skill

#### DELETE /consultants/skills/me/{skillId}

**Input:** skillId\
**Output:** confirmation

---

## Skills (Sales & Admin)

#### GET /skills

**Input:** optional filters\
**Output:** list of skills

#### POST /skills

**Input:** skill name + category\
**Output:** list of skills

#### PUT /skills/{skillName}

**Input:** updated data\
**Output:** updated skill

#### DELETE /skills/{skillName}

**Input:** skillName\
**Output:** confirmation

---

## Skill Categories

#### GET /skills/categories

**Output:** list of categories

#### POST /skills/categories

**Input:** category name\
**Output:** created category

#### PUT /skills/categories/{categoryId}

**Input:** categoryId\
**Output:** updated category

#### DELETE /skills/categories/{categoryId}

**Input:** categoryId\
**Output:** confirmation

---

## Employment

#### GET /consultants/{consultantId}/employments

**Input:** consultantId\
**Output:** work experience list

#### POST /consultants/me/employments

**Input:** employment data\
**Output:** created employment

#### PUT /consultants/me/employments/{employmentId}

**Input:** updated employment data\
**Output:** updated employment

#### DELETE /consultants/me/employments/{employmentId}

**Input:** employmentId\
**Output:** confirmation

---

## Employment skills

#### POST /consultants/me/employments/{employmentId}/skills

**Input:** employmentId + skillTagName\
**Output:** created employment skill

#### DELETE /consultants/me/employments/{employmentId}/skills/{employmentSkillId}

**Input:** employmentSkillId\
**Output:** confirmation

---

## Projects

#### GET /consultants/{consultantId}/projects

**Input:** consultantId\
**Output:** project list

#### POST /consultants/me/projects

**Input:** project data\
**Output:** created project

#### PUT /consultants/me/projects/{projectId}

**Input:** updated project data\
**Output:** updated project

#### DELETE /consultants/me/projects/{projectId}

**Input:** projectId\
**Output:** deletion confirmation

---

## Project Links

#### POST /consultants/me/projects/{projectId}/links

**Input:** url + label\
**Output:** created project link

#### DELETE /consultants/me/projects/{projectId}/links/{linkId}

**Input:** linkId\
**Output:** confirmation

---

## Comments

#### GET /consultants/{consultantId}/sections/{sectionName}/comments

**Input:** consultantId, sectionName **Output:** comments for section, order by time here or in frontend?

#### POST /consultants/{consultantId}/sections/{sectionName}/comments

**Input:** consultantId, sectionName, comment text **Output:** comment

#### PUT /comments/{commentId}

**Input:** commentId, updated text **Output:** updated comment

#### DELETE /comments/{commentId}

**Input:** commentId **Output:** confirmation

## User attributes (social media, etc..)

#### GET /consultants/{consultantId}/attributes

**Input:** consultantId **Output:** visible user attributes

#### POST /consultants/me/attributes

**Input:** consultantid, attribute data **Output:** created user attribute

#### PUT /consultants/me/attributes/{attributeId}

**Input:** attributeId, data, opt.(value, type, visibility) **Output:** updated attribute

#### DELETE /consultants/me/attributes/{attributeId}

**Input:** attributeId **Output:** confirmation

---

## Sales lists

#### GET /sales/lists

**Input:** token **Output:** salespersons lists (id, customer info, description, review status, number of consultants, last update..)

#### POST /sales/lists

**Input:** customerId, description **Output:** created sales list

#### PUT /sales/lists/{listId}

**Input:** updated description / review status **Output:** updated list

#### DELETE /sales/lists/{listId}

**Input:** listId **Output:** confirmation

## Sales list items

#### GET /sales/lists/{listId}/items

**Input:** listId **Output:** consultants in list

#### POST /sales/list/{listId}/items

**Input:** listid, consultantId **Output:** created list item

#### PUT /sales/lists/{listId}/items/{itemId}

**Input:** isAccepted, isHidden flags **Ouput:** updated list item

#### DELETE /sales/lists/{listId}/items/{itemId}

**Input:** itemId **Ouput:** confirmation

---

## Offers (customer and sales facing)

#### GET /sales/offers

**Input:** token **Output:** salesperson's offer pages 

#### GET /sales/offers/{offerPageId}

**Input:** offer page ID **Output:** salesperson's offer page

#### POST /sales/offers

**Input:** offer page data **Output:** created offer page

#### PUT /sales/offers/{offerPageId}

**Input:** offer page data **Output:** updated offer page

#### DELETE /sales/offers/{offerPageId}

**Input:** offer page ID **Output:** confirmation