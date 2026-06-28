import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const questions = [
  {
    title: "Nested Variable Swap",
    desc: "Predict the output. Track how x and y change through the nested conditions.",
    code: "x = 5\ny = 3\nif x > y:\n    x = x + y\n    if x > 10:\n        print(x)\n    else:\n        print(y)\nelse:\n    y = y + x\n    print(y)",
  },
  {
    title: "Largest of Three",
    desc: "This code finds the largest of three numbers using nested if-else. Predict the output.",
    code: "a = 8\nb = 12\nc = 5\nif a > b:\n    if a > c:\n        print(a)\n    else:\n        print(c)\nelse:\n    if b > c:\n        print(b)\n    else:\n        print(c)",
  },
  {
    title: "Divisibility Chain",
    desc: "Trace the nested conditions to determine what gets printed for n = 27.",
    code: 'n = 27\nif n % 2 == 0:\n    if n % 4 == 0:\n        print("Divisible by 4")\n    else:\n        print("Even but not by 4")\nelse:\n    if n % 3 == 0:\n        if n % 9 == 0:\n            print("Divisible by 9")\n        else:\n            print("Divisible by 3 but not 9")\n    else:\n        print("Odd and not multiple of 3")',
  },
  {
    title: "Date Validator",
    desc: "Check if Feb 15, 2024 is a valid date using leap year logic. Predict the output.",
    code: 'day = 15\nmonth = 2\nyear = 2024\nif month == 2:\n    if year % 4 == 0:\n        if day <= 29:\n            print("Valid date")\n        else:\n            print("Invalid date")\n    else:\n        if day <= 28:\n            print("Valid date")\n        else:\n            print("Invalid date")\nelse:\n    print("Not February")',
  },
];

async function main() {
  const { data: lec } = await supabase.from("lectures").select("id").eq("order_index", 4).single();
  if (!lec) { console.error("Lecture 4 not found"); process.exit(1); }

  const { data: existing } = await supabase
    .from("questions")
    .select("order_index")
    .eq("lecture_id", lec.id)
    .order("order_index", { ascending: false })
    .limit(1);

  let next = (existing && existing[0]) ? existing[0].order_index + 1 : 1;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const { error: e } = await supabase.from("questions").insert({
      lecture_id: lec.id,
      title: q.title,
      description: q.desc,
      starter_code: "",
      code_sample: q.code,
      question_type: "dry_run",
      order_index: next + i,
    });
    if (e) console.error(`Q${next + i} failed:`, e.message);
    else console.log(`Q${next + i}: "${q.title}" added`);
  }

  console.log("Done!");
}

main().catch(console.error);
