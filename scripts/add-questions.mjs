import { createClient } from "@supabase/supabase-js";
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
  console.log("\n=== Add Questions to Existing Lecture ===\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: lectures } = await supabase
    .from("lectures")
    .select("id, title, order_index")
    .order("order_index", { ascending: true });

  if (!lectures || lectures.length === 0) {
    console.log("No lectures found. Run 'npm run add-lecture' first.");
    process.exit(0);
  }

  console.log("Available lectures:");
  for (const l of lectures) {
    const { count } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("lecture_id", l.id);
    console.log(`  ${l.order_index}. ${l.title} (${count || 0} questions)`);
  }

  const choice = await ask("\nEnter lecture number to add questions to: ");
  const lecture = lectures.find((l) => l.order_index === parseInt(choice));
  if (!lecture) {
    console.log("Invalid lecture number.");
    process.exit(0);
  }

  const { data: existing } = await supabase
    .from("questions")
    .select("order_index")
    .eq("lecture_id", lecture.id)
    .order("order_index", { ascending: false })
    .limit(1);

  let nextOrder = (existing && existing[0]?.order_index) ? existing[0].order_index + 1 : 1;

  const countStr = await ask(`How many questions to add? (next order_index: ${nextOrder}): `);
  const count = parseInt(countStr);

  for (let i = 0; i < count; i++) {
    console.log(`\n--- Question ${nextOrder + i} ---`);
    const title = await ask("Question title: ");
    const description = await ask("Description: ");
    const qType = await ask("Question type? (coding/dry_run) [coding]: ");
    const questionType = qType.trim() === "dry_run" ? "dry_run" : "coding";

    let starterCode = "";
    let codeSample = null;

    if (questionType === "coding") {
      starterCode = await ask("Starter code (optional): ");
    } else {
      console.log("Enter the code sample (type 'END' on a new line when done):");
      const lines = [];
      let line;
      while ((line = (await ask(""))) !== "END") {
        lines.push(line);
      }
      codeSample = lines.join("\n");
    }

    const { error } = await supabase.from("questions").insert({
      lecture_id: lecture.id,
      title,
      description,
      starter_code: starterCode,
      code_sample: codeSample,
      question_type: questionType,
      order_index: nextOrder + i,
    });

    if (error) {
      console.error(`Failed to add question: ${error.message}`);
    } else {
      console.log(`Question "${title}" (${questionType}) added!`);
    }
  }

  console.log("\nDone! Questions are live on the site.");
  rl.close();
}

main();
