import { NextResponse } from "next/server";

import{createCourseSchema} from "@/Validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";

export async function POST(req: Request) {
   
    try {
        const body = await req.json();
        const {title,units}=createCourseSchema.parse(body);

        type outputUnits={
            title:string;
            chapters:{
                youtube_search_query:string;
                chapter_title:string;

            }[]
        };

        let output_units: OutputUnits = await strict_output(
            "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter",
            new Array(units.length).fill(`It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educationalvideo for each chapter. Each query should give an educational informative course in youtube.`),
            {
                title:'title of the unit',
                chapters:'an array of chapters and each chapter should have a youtueque_search_query and chapter_title key in the json object',
            }
        );
        console.log(output_units);
        return NextResponse.json(output_units);


        
    } catch (error) {
  if (error instanceof ZodError) {
    return new NextResponse("Invalid body", { status: 400 });
  }

  console.error("Unexpected error:", error);

  // Check for rate limit
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    error.response?.status === 429
  ) {
    return new NextResponse("Rate limit exceeded. Please try again later.", {
      status: 429,
    });
  }

  return new NextResponse("Internal server error", { status: 500 });
}

}

