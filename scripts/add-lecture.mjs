import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import readline from "readline";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("\n=== Add New Lecture ===\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const orderStr = await ask("Lecture number: ");
  const orderIndex = parseInt(orderStr);
  const title = await ask("Lecture title: ");
  const description = await ask("Description (optional): ");
  const pdfPath = await ask("Path to PDF file (or leave blank): ");

  let pdfUrl = null;
  if (pdfPath.trim()) {
    console.log("Uploading PDF to Supabase Storage...");
    const fileBuffer = readFileSync(pdfPath.trim());
    const fileName = `lecture-${orderIndex}-${Date.now()}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("lecture-pdfs")
      .upload(fileName, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
    } else {
      const { data: urlData } = supabase.storage
        .from("lecture-pdfs")
        .getPublicUrl(fileName);

      pdfUrl = urlData.publicUrl;
      console.log("PDF uploaded:", pdfUrl);
    }
  }

  const { data: lecture, error: lectureError } = await supabase
    .from("lectures")
    .insert({
      title,
      description: description || null,
      pdf_url: pdfUrl,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (lectureError) {
    console.error("Failed to create lecture:", lectureError.message);
    process.exit(1);
  }

  console.log(`\nLecture "${title}" created! ID: ${lecture.id}\n`);

  const addQuestions = await ask("Add questions now? (y/n): ");
  if (addQuestions.toLowerCase() === "y") {
    let qIndex = 1;
    while (true) {
      console.log(`\n--- Question ${qIndex} ---`);
      const qTitle = await ask("Question title: ");
      const qDesc = await ask("Question description/instructions: ");
      const starterCode = await ask("Starter code (optional): ");

      const { error: qError } = await supabase.from("questions").insert({
        lecture_id: lecture.id,
        title: qTitle,
        description: qDesc,
        starter_code: starterCode || "",
        order_index: qIndex,
      });

      if (qError) {
        console.error("Failed to add question:", qError.message);
      } else {
        console.log(`Question ${qIndex} added!`);
      }

      const more = await ask("Add another question? (y/n): ");
      if (more.toLowerCase() !== "y") break;
      qIndex++;
    }
  }

  console.log("\nDone! Lecture and questions have been added.\n");
  rl.close();
}

main().catch(console.error);
