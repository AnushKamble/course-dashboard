import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const questions = [
  {
    title: "Sum of range",
    desc: "Predict the output of this for loop that adds numbers from 1 to 5.",
    code: "total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)",
  },
  {
    title: "Skip by step",
    desc: "Predict the output. Notice the step value of 2.",
    code: "result = 1\nfor i in range(1, 6, 2):\n    result = result * i\nprint(result)",
  },
  {
    title: "Count numbers in a range",
    desc: "Predict how many times the loop runs.",
    code: "count = 0\nfor i in range(3, 8):\n    count = count + 1\nprint(count)",
  },
  {
    title: "For loop with step 3",
    desc: "Add numbers from 0 to 9 with a step of 3.",
    code: "total = 0\nfor i in range(0, 10, 3):\n    total = total + i\nprint(total)",
  },
  {
    title: "Product of first 4 numbers",
    desc: "Multiply numbers from 1 to 4.",
    code: "p = 1\nfor i in range(1, 5):\n    p = p * i\nprint(p)",
  },
  {
    title: "Sum multiples of 3",
    desc: "Add numbers divisible by 3 between 1 and 10.",
    code: "total = 0\nfor i in range(1, 11):\n    if i % 3 == 0:\n        total = total + i\nprint(total)",
  },
  {
    title: "Build number digit by digit",
    desc: "Predict what number gets built.",
    code: "n = 0\nfor i in range(4):\n    n = n * 10 + (i + 1)\nprint(n)",
  },
];

async function main() {
  const { data: lec, error: e1 } = await supabase
    .from("lectures")
    .insert({ title: "For Loop Dry Run", description: "Practice dry running for loops step by step", order_index: 9 })
    .select()
    .single();

  if (e1) { console.error("Lecture error:", e1.message); process.exit(1); }
  console.log(`Lecture created: "${lec.title}" (ID: ${lec.id})`);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const { error: e2 } = await supabase.from("questions").insert({
      lecture_id: lec.id,
      title: q.title,
      description: q.desc,
      starter_code: "",
      code_sample: q.code,
      question_type: "dry_run",
      order_index: i + 1,
    });
    if (e2) console.error(`Q${i + 1} failed: ${e2.message}`);
    else console.log(`Q${i + 1}: "${q.title}" added`);
  }

  console.log("\nDone! All 7 questions are live.");
}

main().catch(console.error);
