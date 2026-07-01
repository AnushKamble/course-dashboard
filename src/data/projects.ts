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
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    emoji: "✊",
    hook: "Challenge the computer!",
    description: "Build the classic Rock Paper Scissors game! Play against the computer, see who wins each round, and track your score across multiple rounds.",
    difficulty: "Easy",
    steps: [
      {
        title: "Get Your Choice",
        instruction: `Start by importing random and asking the user to choose rock, paper, or scissors. Store their answer in a variable called "user" and print it back.`,
        hint: `Use user = input("Choose rock, paper, or scissors: ") then print("You chose:", user)`,
        starterCode: "",
        solution: `import random

user = input("Choose rock, paper, or scissors: ")
print("You chose:", user)`,
      },
      {
        title: "Computer Chooses",
        instruction: `Now make the computer pick a random choice. Use random.choice() with a list of ["rock", "paper", "scissors"]. Store it in a variable called "computer" and print it.`,
        hint: `Use computer = random.choice(["rock", "paper", "scissors"])`,
        starterCode: `import random

user = input("Choose rock, paper, or scissors: ")
print("You chose:", user)
`,
        solution: `import random

user = input("Choose rock, paper, or scissors: ")
print("You chose:", user)

computer = random.choice(["rock", "paper", "scissors"])
print("Computer chose:", computer)`,
      },
      {
        title: "Who Wins?",
        instruction: `Add if-elif-else logic to determine the winner. First check if it's a tie. Then check if the user wins (rock beats scissors, scissors beats paper, paper beats rock). Otherwise, computer wins.`,
        hint: `Tie: user == computer. User win: (user == "rock" and computer == "scissors") or (user == "scissors" and computer == "paper") or (user == "paper" and computer == "rock")`,
        starterCode: `import random

user = input("Choose rock, paper, or scissors: ")
print("You chose:", user)

computer = random.choice(["rock", "paper", "scissors"])
print("Computer chose:", computer)
`,
        solution: `import random

user = input("Choose rock, paper, or scissors: ")
print("You chose:", user)

computer = random.choice(["rock", "paper", "scissors"])
print("Computer chose:", computer)

if user == computer:
    print("It's a tie!")
elif (user == "rock" and computer == "scissors") or (user == "scissors" and computer == "paper") or (user == "paper" and computer == "rock"):
    print("You win!")
else:
    print("Computer wins!")`,
      },
      {
        title: "Best of 3!",
        instruction: `Let's play 3 rounds! Add score variables (user_score and computer_score) at the top. Wrap your game in a for loop that runs 3 times. Add 1 to the winner's score each round. At the end, print the final scores and who won overall!`,
        hint: `Use for round_num in range(1, 4): to play 3 rounds. Add user_score = user_score + 1 when user wins, and computer_score = computer_score + 1 when computer wins.`,
        starterCode: `import random

user = input("Choose rock, paper, or scissors: ")
print("You chose:", user)

computer = random.choice(["rock", "paper", "scissors"])
print("Computer chose:", computer)

if user == computer:
    print("It's a tie!")
elif (user == "rock" and computer == "scissors") or (user == "scissors" and computer == "paper") or (user == "paper" and computer == "rock"):
    print("You win!")
else:
    print("Computer wins!")`,
        solution: `import random

user_score = 0
computer_score = 0

for round_num in range(1, 4):
    print()
    print("Round", round_num)
    user = input("Choose rock, paper, or scissors: ")

    computer = random.choice(["rock", "paper", "scissors"])
    print("Computer chose:", computer)

    if user == computer:
        print("It's a tie!")
    elif (user == "rock" and computer == "scissors") or (user == "scissors" and computer == "paper") or (user == "paper" and computer == "rock"):
        print("You win!")
        user_score = user_score + 1
    else:
        print("Computer wins!")
        computer_score = computer_score + 1

print()
print("=== Final Score ===")
print("You:", user_score, "- Computer:", computer_score)
if user_score > computer_score:
    print("You are the champion!")
elif user_score < computer_score:
    print("Computer wins the game!")
else:
    print("It's a tie game!")`,
      },
    ],
  },
  {
    id: "number-guessing",
    title: "Number Guessing Game",
    emoji: "🔢",
    hook: "Can you guess the secret number?",
    description: "The computer picks a secret number between 1 and 20, and you have 5 tries to guess it. Get hints like 'Too high!' and 'Too low!' to narrow it down!",
    difficulty: "Easy",
    steps: [
      {
        title: "Pick a Secret Number",
        instruction: `Import random and use randint(1, 20) to generate a secret number. Store it in a variable called "secret". Print a welcome message telling the user the range.`,
        hint: `Use secret = random.randint(1, 20) then print("I'm thinking of a number between 1 and 20")`,
        starterCode: "",
        solution: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20")`,
      },
      {
        title: "Take a Guess",
        instruction: `Ask the user to guess the number. Use int(input()) to get their guess as a number. Print their guess back.`,
        hint: `Use guess = int(input("Your guess: ")) then print("You guessed:", guess)`,
        starterCode: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20")
`,
        solution: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20")

guess = int(input("Your guess: "))
print("You guessed:", guess)`,
      },
      {
        title: "Too High or Too Low?",
        instruction: `Compare the guess to the secret number. If the guess is too low, print "Too low!". If too high, print "Too high!". If correct, print "You got it!"`,
        hint: `Use if guess < secret: elif guess > secret: else:`,
        starterCode: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20")

guess = int(input("Your guess: "))
print("You guessed:", guess)
`,
        solution: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20")

guess = int(input("Your guess: "))

if guess < secret:
    print("Too low!")
elif guess > secret:
    print("Too high!")
else:
    print("You got it!")`,
      },
      {
        title: "5 Chances!",
        instruction: `Give the player 5 attempts! Use a for loop that runs 5 times. Add a variable called "guessed" that starts as False and becomes True if they guess correctly. Only ask for a guess if they haven't guessed yet. At the end, if they didn't guess it, reveal the secret number.`,
        hint: `Use for attempt in range(1, 6): and a guessed = False flag. Inside the loop, use if not guessed: to check before asking.`,
        starterCode: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20")

guess = int(input("Your guess: "))

if guess < secret:
    print("Too low!")
elif guess > secret:
    print("Too high!")
else:
    print("You got it!")`,
        solution: `import random

secret = random.randint(1, 20)
print("I'm thinking of a number between 1 and 20")
print("You have 5 attempts!")
guessed = False

for attempt in range(1, 6):
    if not guessed:
        guess = int(input("Guess: "))
        if guess < secret:
            print("Too low!")
        elif guess > secret:
            print("Too high!")
        else:
            print("You got it in", attempt, "tries!")
            guessed = True

if not guessed:
    print("Out of tries! The number was", secret)`,
      },
    ],
  },
  {
    id: "choose-your-adventure",
    title: "Choose Your Own Adventure",
    emoji: "📖",
    hook: "Write your own interactive story!",
    description: "Create a game where the player makes choices that change the story! This demo shows you how — then you write your own adventure with your own characters, places, and endings!",
    difficulty: "Easy",
    steps: [
      {
        title: "Start Your Story",
        instruction: `Print a welcome message and describe where the player is. Then ask them to make their first choice. Store it in a variable called "choice" and print their choice.`,
        hint: `Use print() to show the scene, then choice = input("Which way do you go? ")`,
        starterCode: "",
        solution: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")
print("You chose:", choice)`,
      },
      {
        title: "The Left Path",
        instruction: `Add an if statement for the "left" choice. If they go left, print what happens and give them a second choice. Use nested if-elif-else for the second choice.`,
        hint: `Start with if choice == "left": then print the scene and ask for choice2 using input().`,
        starterCode: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")
print("You chose:", choice)
`,
        solution: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")

if choice == "left":
    print("You follow the narrow path and find a river.")
    print("Do you swim across or follow the river?")
    choice2 = input("swim or follow? ")
    if choice2 == "swim":
        print("You swim across and find a treasure chest! You win!")
    elif choice2 == "follow":
        print("You follow the river to a beautiful waterfall. Amazing!")
    else:
        print("You stand there confused. Nothing happens.")`,
      },
      {
        title: "The Right Path",
        instruction: `Add an elif for the "right" choice. If they go right, give them a completely different scene with its own second choice. You can even add a third level of choices!`,
        hint: `Add elif choice == "right": and write your own story branch with new input() calls.`,
        starterCode: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")

if choice == "left":
    print("You follow the narrow path and find a river.")
    print("Do you swim across or follow the river?")
    choice2 = input("swim or follow? ")
    if choice2 == "swim":
        print("You swim across and find a treasure chest! You win!")
    elif choice2 == "follow":
        print("You follow the river to a beautiful waterfall. Amazing!")
    else:
        print("You stand there confused. Nothing happens.")
`,
        solution: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")

if choice == "left":
    print("You follow the narrow path and find a river.")
    print("Do you swim across or follow the river?")
    choice2 = input("swim or follow? ")
    if choice2 == "swim":
        print("You swim across and find a treasure chest! You win!")
    elif choice2 == "follow":
        print("You follow the river to a beautiful waterfall. Amazing!")
    else:
        print("You stand there confused. Nothing happens.")
elif choice == "right":
    print("You take the wide path and find a mysterious cave.")
    print("Do you enter the cave or climb the hill?")
    choice2 = input("enter or climb? ")
    if choice2 == "enter":
        print("Inside the cave, you find a sleeping bear!")
        print("Do you sneak past or run away?")
        choice3 = input("sneak or run? ")
        if choice3 == "sneak":
            print("You sneak past and find a secret tunnel to freedom! You win!")
        else:
            print("You run away safely. Phew!")
    elif choice2 == "climb":
        print("You climb the hill and see a beautiful sunset. Peaceful!")
    else:
        print("You stand there confused. Nothing happens.")`,
      },
      {
        title: "Handle Wrong Inputs",
        instruction: `Add an else at the end to handle if the user types something other than "left" or "right". Print a message like "That's not a valid direction!"`,
        hint: `Simply add else: at the end with a print statement.`,
        starterCode: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")

if choice == "left":
    print("You follow the narrow path and find a river.")
    print("Do you swim across or follow the river?")
    choice2 = input("swim or follow? ")
    if choice2 == "swim":
        print("You swim across and find a treasure chest! You win!")
    elif choice2 == "follow":
        print("You follow the river to a beautiful waterfall. Amazing!")
    else:
        print("You stand there confused. Nothing happens.")
elif choice == "right":
    print("You take the wide path and find a mysterious cave.")
    print("Do you enter the cave or climb the hill?")
    choice2 = input("enter or climb? ")
    if choice2 == "enter":
        print("Inside the cave, you find a sleeping bear!")
        print("Do you sneak past or run away?")
        choice3 = input("sneak or run? ")
        if choice3 == "sneak":
            print("You sneak past and find a secret tunnel to freedom! You win!")
        else:
            print("You run away safely. Phew!")
    elif choice2 == "climb":
        print("You climb the hill and see a beautiful sunset. Peaceful!")
    else:
        print("You stand there confused. Nothing happens.")
`,
        solution: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")

if choice == "left":
    print("You follow the narrow path and find a river.")
    print("Do you swim across or follow the river?")
    choice2 = input("swim or follow? ")
    if choice2 == "swim":
        print("You swim across and find a treasure chest! You win!")
    elif choice2 == "follow":
        print("You follow the river to a beautiful waterfall. Amazing!")
    else:
        print("You stand there confused. Nothing happens.")
elif choice == "right":
    print("You take the wide path and find a mysterious cave.")
    print("Do you enter the cave or climb the hill?")
    choice2 = input("enter or climb? ")
    if choice2 == "enter":
        print("Inside the cave, you find a sleeping bear!")
        print("Do you sneak past or run away?")
        choice3 = input("sneak or run? ")
        if choice3 == "sneak":
            print("You sneak past and find a secret tunnel to freedom! You win!")
        else:
            print("You run away safely. Phew!")
    elif choice2 == "climb":
        print("You climb the hill and see a beautiful sunset. Peaceful!")
    else:
        print("You stand there confused. Nothing happens.")
else:
    print("That's not a valid direction! You wander aimlessly...")`,
      },
      {
        title: "Make It Your Own! 🎨",
        instruction: `Now it's YOUR turn! Change the story completely — use your own characters, places, and choices. Add more paths, more levels, and more endings. The demo above is just a template. You can make a space adventure, a detective mystery, a haunted house, or anything you imagine! Try adding more elif branches or deeper nested if-else blocks.`,
        hint: `Start by changing the print messages. Then add new choices with elif. You can make the story as long and complex as you want!`,
        starterCode: `print("Welcome to the Adventure!")
print("You are standing in a dark forest.")
print("To your left is a narrow path.")
print("To your right is a wide path.")
choice = input("Which way do you go? (left/right) ")

if choice == "left":
    print("You follow the narrow path and find a river.")
    print("Do you swim across or follow the river?")
    choice2 = input("swim or follow? ")
    if choice2 == "swim":
        print("You swim across and find a treasure chest! You win!")
    elif choice2 == "follow":
        print("You follow the river to a beautiful waterfall. Amazing!")
    else:
        print("You stand there confused. Nothing happens.")
elif choice == "right":
    print("You take the wide path and find a mysterious cave.")
    print("Do you enter the cave or climb the hill?")
    choice2 = input("enter or climb? ")
    if choice2 == "enter":
        print("Inside the cave, you find a sleeping bear!")
        print("Do you sneak past or run away?")
        choice3 = input("sneak or run? ")
        if choice3 == "sneak":
            print("You sneak past and find a secret tunnel to freedom! You win!")
        else:
            print("You run away safely. Phew!")
    elif choice2 == "climb":
        print("You climb the hill and see a beautiful sunset. Peaceful!")
    else:
        print("You stand there confused. Nothing happens.")
else:
    print("That's not a valid direction! You wander aimlessly...")
`,
        solution: `# This is YOUR story! Change everything below.
# Here's a quick example to get you started:

print("Welcome to SPACE ADVENTURE 3000!")
print("You are aboard a spaceship. The alarm is blaring!")
print("Do you go to the control room or the escape pod?")
choice = input("control room or escape pod? ")

if choice == "control room":
    print("You enter the control room. The ship is falling apart!")
    print("Do you try to land the ship or send a distress signal?")
    choice2 = input("land or signal? ")
    if choice2 == "land":
        print("You crash land on a strange planet. You survived!")
    elif choice2 == "signal":
        print("Help arrives just in time! You are rescued!")
    else:
        print("You freeze in panic. The ship shakes violently!")
elif choice == "escape pod":
    print("You jump into the escape pod and launch!")
    print("Do you head toward the nearby planet or the space station?")
    choice2 = input("planet or station? ")
    if choice2 == "planet":
        print("You land on an alien world. New adventure begins!")
    elif choice2 == "station":
        print("You dock at the space station. You are safe!")
    else:
        print("You drift off into deep space. Lonely...")
else:
    print("You hesitate too long. The ship explodes! Game over!")

print()
print("Now change this story and make your own!")`,
      },
    ],
  },
  {
    id: "simple-atm",
    title: "Simple ATM",
    emoji: "🏧",
    hook: "Build your own bank machine!",
    description: "Create a simple ATM that lets users check their balance, deposit money, and withdraw cash — with validation to make sure they can't withdraw more than they have!",
    difficulty: "Medium",
    steps: [
      {
        title: "Show the Menu",
        instruction: `Create a variable called "balance" and set it to 1000. Print a welcome message and a menu with 4 options: Check Balance, Deposit, Withdraw, and Exit. Ask the user to choose an option and print their choice.`,
        hint: `Use print("1. Check Balance") etc. to show the menu, then choice = input("Choose an option: ")`,
        starterCode: "",
        solution: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")
print("You chose:", choice)`,
      },
      {
        title: "Check Balance",
        instruction: `Add an if statement for option "1". If the user chooses 1, print "Your balance is:" followed by the balance variable.`,
        hint: `Use if choice == "1": and then print("Your balance is:", balance)`,
        starterCode: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")
print("You chose:", choice)
`,
        solution: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")

if choice == "1":
    print("Your balance is:", balance)`,
      },
      {
        title: "Deposit Money",
        instruction: `Add an elif for option "2". Ask the user how much to deposit using int(input()). Add that amount to the balance and print the new balance.`,
        hint: `Use elif choice == "2": then amount = int(input("Enter deposit amount: ")) and balance = balance + amount`,
        starterCode: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")

if choice == "1":
    print("Your balance is:", balance)
`,
        solution: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")

if choice == "1":
    print("Your balance is:", balance)
elif choice == "2":
    amount = int(input("Enter amount to deposit: "))
    balance = balance + amount
    print("Deposited! New balance:", balance)`,
      },
      {
        title: "Withdraw with Validation",
        instruction: `Add an elif for option "3". Ask how much to withdraw. Check if the amount is greater than the balance — if so, print "Not enough money!". Otherwise, subtract the amount from the balance and print the new balance. Add an elif for option "4" to print "Goodbye!" and an else for invalid options.`,
        hint: `Use if amount > balance: to check if they have enough money.`,
        starterCode: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")

if choice == "1":
    print("Your balance is:", balance)
elif choice == "2":
    amount = int(input("Enter amount to deposit: "))
    balance = balance + amount
    print("Deposited! New balance:", balance)
`,
        solution: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")

if choice == "1":
    print("Your balance is:", balance)
elif choice == "2":
    amount = int(input("Enter amount to deposit: "))
    balance = balance + amount
    print("Deposited! New balance:", balance)
elif choice == "3":
    amount = int(input("Enter amount to withdraw: "))
    if amount > balance:
        print("Not enough money!")
    else:
        balance = balance - amount
        print("Withdrew! New balance:", balance)
elif choice == "4":
    print("Goodbye!")
else:
    print("Invalid option!")`,
      },
      {
        title: "Multiple Transactions",
        instruction: `Let the user do 3 transactions! Wrap the menu and if-elif-else block in a for loop that runs 3 times. Also print a header showing which transaction they're on (like "Transaction 1 of 3").`,
        hint: `Use for turn in range(1, 4): and put all your code inside it. Use print() with a blank line before the menu to make it look clean.`,
        starterCode: `balance = 1000
print("Welcome to the ATM!")
print("1. Check Balance")
print("2. Deposit")
print("3. Withdraw")
print("4. Exit")
choice = input("Choose an option: ")

if choice == "1":
    print("Your balance is:", balance)
elif choice == "2":
    amount = int(input("Enter amount to deposit: "))
    balance = balance + amount
    print("Deposited! New balance:", balance)
elif choice == "3":
    amount = int(input("Enter amount to withdraw: "))
    if amount > balance:
        print("Not enough money!")
    else:
        balance = balance - amount
        print("Withdrew! New balance:", balance)
elif choice == "4":
    print("Goodbye!")
else:
    print("Invalid option!")`,
        solution: `balance = 1000
print("Welcome to the ATM!")

for turn in range(1, 4):
    print()
    print("--- Transaction", turn, "of 3 ---")
    print("1. Check Balance")
    print("2. Deposit")
    print("3. Withdraw")
    print("4. Exit")
    choice = input("Choose an option: ")

    if choice == "1":
        print("Your balance is:", balance)
    elif choice == "2":
        amount = int(input("Enter amount to deposit: "))
        balance = balance + amount
        print("Deposited! New balance:", balance)
    elif choice == "3":
        amount = int(input("Enter amount to withdraw: "))
        if amount > balance:
            print("Not enough money!")
        else:
            balance = balance - amount
            print("Withdrew! New balance:", balance)
    elif choice == "4":
        print("Goodbye!")
    else:
        print("Invalid option!")

print()
print("Thank you for using the ATM!")`,
      },
    ],
  },
];
