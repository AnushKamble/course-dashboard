import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const questions = [
  {
    title: "Number Sign & Parity",
    desc: "Take an integer input. Using nested if-else, print:\n- 'Positive Even' if > 0 and divisible by 2\n- 'Positive Odd' if > 0 and not divisible by 2\n- 'Negative Even' if < 0 and divisible by 2\n- 'Negative Odd' if < 0 and not divisible by 2\n- 'Zero' if equal to 0",
    starter: "num = int(input(\"Enter a number: \"))\n\n# Write your nested if-else here",
  },
  {
    title: "Temperature & Weather Advice",
    desc: "Given temperature (in Celsius) and whether it's raining ('yes' or 'no'), give advice:\n- temp > 35: 'Stay indoors, it is too hot' (regardless of rain)\n- temp 25-35: if raining → 'Carry an umbrella, warm day' else 'Nice warm day'\n- temp 15-24: if raining → 'Carry an umbrella, cool day' else 'Pleasant cool day'\n- temp < 15: if raining → 'Cold and rainy, wear a jacket' else 'Cold day, wear a jacket'",
    starter: "temp = int(input(\"Enter temperature: \"))\nrain = input(\"Is it raining? (yes/no): \")\n\n# Write your nested if-else here",
  },
  {
    title: "Scholarship Eligibility",
    desc: "Given marks (0-100) and annual family income, determine scholarship:\n- marks >= 90: if income < 200000 → 'Full Scholarship' else 'Merit Certificate'\n- marks 75-89: if income < 200000 → 'Half Scholarship' else 'No Scholarship'\n- marks 60-74: if income < 100000 → 'Need-based Aid' else 'No Scholarship'\n- marks < 60: 'Not eligible'",
    starter: "marks = int(input(\"Enter marks: \"))\nincome = int(input(\"Enter annual family income: \"))\n\n# Write your nested if-else here",
  },
  {
    title: "Character Classifier",
    desc: "Input a single character. Use nested if-else to classify:\n- 'Uppercase' if between 'A' and 'Z'\n- 'Lowercase' if between 'a' and 'z'\n- 'Digit' if between '0' and '9'\n- 'Special Character' otherwise",
    starter: "ch = input(\"Enter a character: \")\n\n# Write your nested if-else here",
  },
];

async function main() {
  const { data: lec, error: e1 } = await supabase
    .from("lectures")
    .insert({ title: "Nested If-Else Coding", description: "Practice writing nested if-else statements with real-world problems", order_index: 10 })
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
      starter_code: q.starter,
      code_sample: null,
      question_type: "coding",
      order_index: i + 1,
    });
    if (e2) console.error(`Q${i + 1} failed: ${e2.message}`);
    else console.log(`Q${i + 1}: "${q.title}" added`);
  }

  console.log("\nDone! All 4 questions are live.");
}

main().catch(console.error);
