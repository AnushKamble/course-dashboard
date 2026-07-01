import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const questions = [
  {
    title: "Rectangle of Stars",
    desc: 'The inner loop runs fully for each outer loop value. How many stars print on each line, and how many lines are there?',
    code: `for i in range(1, 4):
    for j in range(1, 5):
        print("*", end="")
    print()`,
  },
  {
    title: "Number Triangle",
    desc: "The inner loop's range depends on the outer variable `i`. Predict the output line by line.",
    code: `for i in range(1, 6):
    for j in range(1, i + 1):
        print(j, end="")
    print()`,
  },
  {
    title: "Multiplication Grid",
    desc: "Each inner loop calculates `i * j`. Trace what prints for each combination of i and j.",
    code: `for i in range(1, 4):
    for j in range(1, 4):
        print(i * j, end=" ")
    print()`,
  },
  {
    title: "Reverse Number Triangle",
    desc: "The outer loop counts down. How does the inner loop range change each time?",
    code: `for i in range(5, 0, -1):
    for j in range(1, i + 1):
        print(j, end="")
    print()`,
  },
  {
    title: "Sum in Nested Loop",
    desc: "Keep a running total of all numbers from the inner loops. What is the final value of `total`?",
    code: `total = 0
for i in range(1, 5):
    for j in range(1, i + 1):
        total = total + j
print(total)`,
  },
];

async function main() {
  // Find lecture with order_index 11
  const { data: lec, error: e1 } = await supabase
    .from("lectures")
    .select("id")
    .eq("order_index", 11)
    .single();

  if (e1) { console.error("Lecture not found:", e1.message); process.exit(1); }
  console.log(`Found lecture: ${lec.id}`);

  // Delete existing questions
  const { error: delErr } = await supabase
    .from("questions")
    .delete()
    .eq("lecture_id", lec.id);

  if (delErr) { console.error("Delete failed:", delErr.message); process.exit(1); }
  console.log("Old questions deleted");

  // Insert new questions
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

  console.log("\nDone! Questions updated.");
}

main().catch(console.error);
