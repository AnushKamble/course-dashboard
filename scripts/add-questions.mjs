import { createClient } from "@supabase/supabase-js";
import readline from "readline";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        args[key] = argv[i + 1];
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  const cliArgs = parseArgs(process.argv);
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

  let lecture;
  if (cliArgs.lecture) {
    lecture = lectures.find((l) => l.order_index === parseInt(cliArgs.lecture));
    if (!lecture) { console.log("Invalid lecture number."); process.exit(0); }
    console.log(`Selected: ${lecture.title}`);
  } else {
    const choice = await ask("\nEnter lecture number: ");
    lecture = lectures.find((l) => l.order_index === parseInt(choice));
    if (!lecture) { console.log("Invalid lecture number."); process.exit(0); }
  }

  const { data: existing } = await supabase
    .from("questions")
    .select("order_index")
    .eq("lecture_id", lecture.id)
    .order("order_index", { ascending: false })
    .limit(1);

  let nextOrder = (existing && existing[0]?.order_index) ? existing[0].order_index + 1 : 1;

  const countStr = cliArgs.count || await ask(`How many questions to add? (next order_index: ${nextOrder}): `);
  const count = parseInt(countStr);

  for (let i = 0; i < count; i++) {
    console.log(`\n--- Question ${nextOrder + i} ---`);

    const title = cliArgs.title || await ask("Question title: ");
    const description = cliArgs.description || await ask("Description: ");

    let questionType = "coding";
    if (cliArgs.type) {
      questionType = cliArgs.type === "dry_run" ? "dry_run" : "coding";
      console.log(`Type: ${questionType}`);
    } else {
      const qType = await ask("Question type? (coding/dry_run) [coding]: ");
      questionType = qType.trim() === "dry_run" ? "dry_run" : "coding";
    }

    let starterCode = "";
    let codeSample = null;

    if (questionType === "coding") {
      if (cliArgs.starter) {
        starterCode = cliArgs.starter;
        console.log("Starter code provided via --starter");
      } else if (cliArgs.file) {
        try {
          starterCode = readFileSync(cliArgs.file, "utf8");
          console.log(`Starter code read from ${cliArgs.file}`);
        } catch {
          console.log("Could not read file, leaving starter code empty.");
        }
      } else {
        starterCode = await ask("Starter code (optional): ");
      }
    } else {
      // dry_run
      if (cliArgs.file) {
        try {
          codeSample = readFileSync(cliArgs.file, "utf8");
          console.log(`Code sample read from ${cliArgs.file} (${codeSample.split("\n").length} lines)`);
        } catch {
          console.error(`Could not read file: ${cliArgs.file}`);
          process.exit(1);
        }
      } else {
        console.log("Enter code sample below. Type --- on a new line when done:");
        const lines = [];
        let line;
        while ((line = (await ask(""))) !== "---") {
          lines.push(line);
        }
        codeSample = lines.join("\n");
      }
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
      console.error(`Failed: ${error.message}`);
    } else {
      console.log(`Added: "${title}" (${questionType})`);
    }
  }

  console.log("\nDone! Questions are live.");
  rl.close();
}

main();