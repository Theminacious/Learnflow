import {z} from "zod";

export const createCourseSchema = z.object({
   title: z.string().min(1).max(100),
   units: z.array(z.string()).min(1).max(10),
})