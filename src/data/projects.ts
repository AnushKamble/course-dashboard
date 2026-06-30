export interface ProjectStep {
  title: string;
  instruction: string;
  hint?: string;
  starterCode: string;
  solution: string;
}

export interface Project {
  id: string;
  title: string;
  emoji: string;
  hook: string;
  description: string;
  difficulty: "Easy" | "Medium";
  steps: ProjectStep[];
}

export const projects: Project[] = [
  {
    id: "magic-8ball",
    title: "Magic 8-Ball",
    emoji: "🔮",
    hook: "Ask the universe anything...",
    description: "Build a fortune-telling program that answers your questions like the classic Magic 8-Ball toy! Ask it anything and get a mysterious response.",
    difficulty: "Easy",
    steps: [
      {
        title: "Ask a Question",
        instruction: "Let's start by asking the user for their question. Use `input()` to get their question and store it in a variable called `question`. Then print it back using `print()`.",
        hint: 'Use `question = input("Ask the Magic 8-Ball something: ")` then `print(question)`',
        starterCode: "",
        solution: 'question = input("Ask the Magic 8-Ball something: ")\nprint("You asked:", question)',
      },
      {
        title: "Add Random Numbers",
        instruction: "Now import the `random` module and generate a random number between 1 and 6. Store it in a variable called `answer`. Print `answer` to see what number you got.",
        hint: "Add `import random` at the top. Then use `answer = random.randint(1, 6)`",
        starterCode: 'question = input("Ask the Magic 8-Ball something: ")\nprint("You asked:", question)\n',
        solution: 'import random\nquestion = input("Ask the Magic 8-Ball something: ")\nprint("You asked:", question)\nanswer = random.randint(1, 6)\nprint("Answer number:", answer)',
      },
      {
        title: "Add Fortunes",
        instruction: "Replace the `print(answer)` with an if-elif-else block. Use the random number to pick a fortune:\n1 → 'Yes, definitely!'\n2 → 'Ask again later.'\n3 → 'Better not tell you now.'\n4 → 'Don't count on it.'\n5 → 'Signs point to yes.'\n6 → 'Very doubtful.'\nPrint the fortune instead of the number.",
        hint: 'Use `if answer == 1:` then `print("Yes, definitely!")` and so on for all 6 numbers with elif.',
        starterCode: "import random\n\nquestion = input(\"Ask the Magic 8-Ball something: \")\nprint(\"You asked:\", question)\n\nanswer = random.randint(1, 6)\n",
        solution: 'import random\n\nquestion = input("Ask the Magic 8-Ball something: ")\nprint("You asked:", question)\n\nanswer = random.randint(1, 6)\n\nif answer == 1:\n    print("Yes, definitely!")\nelif answer == 2:\n    print("Ask again later.")\nelif answer == 3:\n    print("Better not tell you now.")\nelif answer == 4:\n    print("Don\'t count on it.")\nelif answer == 5:\n    print("Signs point to yes.")\nelse:\n    print("Very doubtful.")',
      },
      {
        title: "🎉 The Final Magic 8-Ball!",
        instruction: "Let's make it more fun! Add an empty `input()` at the end so the program waits for the user to press Enter before closing. Also wrap the question ask in a check — if the user types nothing, print 'You need to ask a question!'",
        hint: "After your if-else block, add `input(\"\\nPress Enter to exit...\")` to keep the window open.",
        starterCode: 'import random\n\nquestion = input("Ask the Magic 8-Ball something: ")\nprint("You asked:", question)\n\nanswer = random.randint(1, 6)\n\nif answer == 1:\n    print("Yes, definitely!")\nelif answer == 2:\n    print("Ask again later.")\nelif answer == 3:\n    print("Better not tell you now.")\nelif answer == 4:\n    print("Don\'t count on it.")\nelif answer == 5:\n    print("Signs point to yes.")\nelse:\n    print("Very doubtful.")\n',
        solution: 'import random\n\nquestion = input("Ask the Magic 8-Ball something: ")\n\nif question == "":\n    print("You need to ask a question!")\nelse:\n    print("You asked:", question)\n\n    answer = random.randint(1, 6)\n\n    if answer == 1:\n        print("\\n🪄 Yes, definitely!")\n    elif answer == 2:\n        print("\\n🔮 Ask again later.")\n    elif answer == 3:\n        print("\\n🌙 Better not tell you now.")\n    elif answer == 4:\n        print("\\n🌑 Don\'t count on it.")\n    elif answer == 5:\n        print("\\n✨ Signs point to yes.")\n    else:\n        print("\\n💫 Very doubtful.")\n\ninput("\\nPress Enter to exit...")',
      },
    ],
  },
  {
    id: "mini-chatbot",
    title: "Mini Chatbot",
    emoji: "🤖",
    hook: "Teach your computer to talk back!",
    description: "Build your very own chatbot that can greet you, ask how you are, tell jokes, and say goodbye. It's like creating your own little AI friend!",
    difficulty: "Medium",
    steps: [
      {
        title: "Say Hello!",
        instruction: "Start by giving your chatbot a name. Create a variable called `bot_name` and set it to something fun like 'Robo'. Then print a welcome message using the name!",
        hint: 'Use `bot_name = "Robo"` and then `print("Hello! I am", bot_name)`',
        starterCode: "",
        solution: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\nprint("Nice to meet you!")',
      },
      {
        title: "Ask For Their Name",
        instruction: "Now ask the user for their name using `input()`. Store it in a variable called `user_name`. Then greet them personally using their name!",
        hint: 'Use `user_name = input("What is your name? ")` then `print("Hi,", user_name + "!")`',
        starterCode: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\nprint("Nice to meet you!")\n',
        solution: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\n\nuser_name = input("What is your name? ")\nprint("Hi,", user_name + "!")',
      },
      {
        title: "Ask How They Are",
        instruction: "Ask the user how they are feeling. If they say 'good' or 'great', respond with 'That is awesome!' If they say 'bad' or 'sad', respond with 'Oh no, hope you feel better!' Otherwise, respond with 'Thanks for sharing!'",
        hint: "Use `feeling = input(\"How are you feeling? \")` then check with `if feeling == \"good\" or feeling == \"great\":`",
        starterCode: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\n\nuser_name = input("What is your name? ")\nprint("Hi,", user_name + "!")\n',
        solution: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\n\nuser_name = input("What is your name? ")\nprint("Hi,", user_name + "!")\n\nfeeling = input("How are you feeling? ")\nif feeling == "good" or feeling == "great":\n    print("That is awesome,", user_name + "!")\nelif feeling == "bad" or feeling == "sad":\n    print("Oh no, hope you feel better! 🤗")\nelse:\n    print("Thanks for sharing,", user_name + "!")',
      },
      {
        title: "Tell a Joke!",
        instruction: "Now add a funny feature — ask if they want to hear a joke. If they say 'yes', print a joke. If they say 'no', print 'Maybe next time!' Otherwise, print 'I do not understand.'",
        hint: 'Use `joke = input("Do you want to hear a joke? ")` and check for "yes" or "no".',
        starterCode: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\n\nuser_name = input("What is your name? ")\nprint("Hi,", user_name + "!")\n\nfeeling = input("How are you feeling? ")\nif feeling == "good" or feeling == "great":\n    print("That is awesome,", user_name + "!")\nelif feeling == "bad" or feeling == "sad":\n    print("Oh no, hope you feel better! 🤗")\nelse:\n    print("Thanks for sharing,", user_name + "!")\n',
        solution: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\n\nuser_name = input("What is your name? ")\nprint("Hi,", user_name + "!")\n\nfeeling = input("How are you feeling? ")\nif feeling == "good" or feeling == "great":\n    print("That is awesome,", user_name + "!")\nelif feeling == "bad" or feeling == "sad":\n    print("Oh no, hope you feel better! 🤗")\nelse:\n    print("Thanks for sharing,", user_name + "!")\n\njoke = input("Do you want to hear a joke? ")\nif joke == "yes":\n    print("Why did the computer go to the doctor?\\nBecause it had a VIRUS! 😂")\nelif joke == "no":\n    print("Okay, maybe next time!")\nelse:\n    print("I do not understand.")',
      },
      {
        title: "🎉 Full Chatbot!",
        instruction: "Let's add a goodbye! At the end, ask if they want to leave. If they say 'yes', print a goodbye message. Otherwise, print 'Okay, let us keep talking!'",
        hint: 'Use `bye = input("Do you want to leave? ")` at the end.',
        starterCode: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\n\nuser_name = input("What is your name? ")\nprint("Hi,", user_name + "!")\n\nfeeling = input("How are you feeling? ")\nif feeling == "good" or feeling == "great":\n    print("That is awesome,", user_name + "!")\nelif feeling == "bad" or feeling == "sad":\n    print("Oh no, hope you feel better! 🤗")\nelse:\n    print("Thanks for sharing,", user_name + "!")\n\njoke = input("Do you want to hear a joke? ")\nif joke == "yes":\n    print("Why did the computer go to the doctor?\\nBecause it had a VIRUS! 😂")\nelif joke == "no":\n    print("Okay, maybe next time!")\nelse:\n    print("I do not understand.")\n',
        solution: 'bot_name = "Robo"\nprint("Hello! I am", bot_name)\n\nuser_name = input("What is your name? ")\nprint("Hi,", user_name + "!")\n\nfeeling = input("How are you feeling? ")\nif feeling == "good" or feeling == "great":\n    print("That is awesome,", user_name + "!")\nelif feeling == "bad" or feeling == "sad":\n    print("Oh no, hope you feel better! 🤗")\nelse:\n    print("Thanks for sharing,", user_name + "!")\n\njoke = input("Do you want to hear a joke? ")\nif joke == "yes":\n    print("Why did the computer go to the doctor?\\nBecause it had a VIRUS! 😂")\nelif joke == "no":\n    print("Okay, maybe next time!")\nelse:\n    print("I do not understand.")\n\nbye = input("\\nDo you want to leave? ")\nif bye == "yes":\n    print("Goodbye,", user_name + "! Come back anytime! 👋")\nelse:\n    print("Okay, let us keep talking! 🎉")\n\ninput("\\nPress Enter to exit...")',
      },
    ],
  },
  {
    id: "madlibs",
    title: "Mad Libs Generator",
    emoji: "📜",
    hook: "Create hilarious stories with your own words!",
    description: "Remember Mad Libs? You provide nouns, verbs, and adjectives, and the program weaves them into a ridiculous story. Every time you play, it's different!",
    difficulty: "Easy",
    steps: [
      {
        title: "Collect Words",
        instruction: "Start by asking for three words: a noun (person/place/thing), a verb (action word), and an adjective (describing word). Store each in a variable.",
        hint: 'Use three input prompts like `noun = input("Enter a noun: ")`',
        starterCode: "",
        solution: 'noun = input("Enter a noun: ")\nverb = input("Enter a verb: ")\nadjective = input("Enter an adjective: ")',
      },
      {
        title: "Tell a Short Story",
        instruction: "Now print a story using those words! Use f-strings or string concatenation to plug them in. Example: 'The {adjective} {noun} decided to {verb}!'",
        hint: 'Use `print(f"The {adjective} {noun} decided to {verb}!")`',
        starterCode: 'noun = input("Enter a noun: ")\nverb = input("Enter a verb: ")\nadjective = input("Enter an adjective: ")\n',
        solution: 'noun = input("Enter a noun: ")\nverb = input("Enter a verb: ")\nadjective = input("Enter an adjective: ")\n\nprint()\nprint("Here is your story:")\nprint(f"The {adjective} {noun} decided to {verb}!")',
      },
      {
        title: "Add More Words",
        instruction: "Ask for 3 more words: a plural noun, a place, and a number. Store them in new variables. Then add another sentence to the story using these words!",
        hint: 'Use `plural_noun = input("Enter a plural noun: ")` and so on.',
        starterCode: 'noun = input("Enter a noun: ")\nverb = input("Enter a verb: ")\nadjective = input("Enter an adjective: ")\n\nprint()\nprint("Here is your story:")\nprint(f"The {adjective} {noun} decided to {verb}!")',
        solution: 'noun = input("Enter a noun: ")\nverb = input("Enter a verb: ")\nadjective = input("Enter an adjective: ")\nplural_noun = input("Enter a plural noun: ")\nplace = input("Enter a place: ")\nnumber = input("Enter a number: ")\n\nprint()\nprint("Here is your story:")\nprint(f"The {adjective} {noun} decided to {verb}!")',
      },
      {
        title: "🎉 Full Story!",
        instruction: "Now build the complete story! Use all 6 words to create a fun multi-sentence story. Print it with proper formatting — blank lines between sentences using `print()`. Make it silly!",
        hint: 'Print empty lines with `print()` between sentences. Use f-strings: `print(f"Sentence one...")`',
        starterCode: 'noun = input("Enter a noun: ")\nverb = input("Enter a verb: ")\nadjective = input("Enter an adjective: ")\nplural_noun = input("Enter a plural noun: ")\nplace = input("Enter a place: ")\nnumber = input("Enter a number: ")\n\nprint()\nprint("Here is your story:")\nprint(f"The {adjective} {noun} decided to {verb}!")',
        solution: 'noun = input("Enter a noun: ")\nverb = input("Enter a verb: ")\nadjective = input("Enter an adjective: ")\nplural_noun = input("Enter a plural noun: ")\nplace = input("Enter a place: ")\nnumber = input("Enter a number: ")\n\nprint()\nprint("🌟 Here is your story:")\nprint()\nprint(f"Once upon a time, a {adjective} {noun} went to {place}.")\nprint(f"They wanted to {verb} with their friends, the {plural_noun}.")\nprint(f"They did this {number} times in a row!")', 
      },
    ],
  },
];
