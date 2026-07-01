import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const questions = [
  {
    title: "Grid Coordinates",
    desc: 'Predict the output. The inner loop runs completely for each outer loop value. Pay attention to the `end=" "` in the first print and the empty `print()` after the inner loop.',
    code: `for i in range(1, 4):
    for j in range(1, 5):
        print(f"({i},{j})", end=" ")
    print()`,
  },
  {
    title: "Right-Angle Triangle",
    desc: "The inner loop's range depends on the outer variable `i`. Trace how many stars print on each line.",
    code: `for i in range(1, 6):
    for j in range(i):
        print("*", end="")
    print()`,
  },
  {
    title: "Break in Nested Loop",
    desc: "The outer loop counts down from 4 to 1. The inner loop breaks when `j` equals `i`. Predict the exact output including all line breaks.",
    code: `for i in range(4, 0, -1):
    for j in range(1, 7):
        print(j, end="")
        if j == i:
            break
    print()`,
  },
  {
    title: "Accumulate Row Sums",
    desc: "Each row sums its own numbers, then adds to the grand total. Trace both `row_sum` and `result` carefully.",
    code: `result = 0
for i in range(1, 5):
    row_sum = 0
    for j in range(1, i + 1):
        row_sum += j
    result += row_sum
print(result)`,
  },
  {
    title: "Reverse Diagonal",
    desc: "The outer loop counts down. Inside, a dot `.` is printed unless `j` equals `i`. Pay close attention to when the number appears.",
    code: `for i in range(4, 0, -1):
    line = ""
    for j in range(1, 5):
        if j == i:
            line += str(j)
        else:
            line += "."
    print(line)`,
  },
];

async function main() {
  const { data: lec, error: e1 } = await supabase
    .from("lectures")
    .insert({ title: "Nested For Loop Dry Run", description: "Practice dry running nested for loops — understand how inner and outer loops interact", order_index: 11 })
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

  console.log("\nDone! All 5 questions are live.");
}

main().catch(console.error);
