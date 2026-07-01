export interface ShowcaseStep {
  title: string;
  code: string;
  explanation: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  emoji: string;
  hook: string;
  description: string;
  difficulty: "Easy" | "Medium";
  fullCode: string;
  steps: ShowcaseStep[];
  runHint: string;
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "drawing-app",
    title: "Drawing App",
    emoji: "🎨",
    hook: "Click to draw colorful circles!",
    description: "Turn your mouse into a paintbrush! Every click draws a colorful circle. Watch how just a few lines of Python can create an interactive drawing app.",
    difficulty: "Easy",
    runHint: "Click anywhere on the canvas to draw!",
    fullCode: `from canvas_helper import *

create_canvas(400, 400)

def draw(x, y):
    fill(random_color())
    circle(x, y, 25)

on_click(draw)
start_anim(lambda: None)`,
    steps: [
      {
        title: "Import the Tools",
        code: `from canvas_helper import *`,
        explanation: `This imports all the drawing functions like create_canvas(), fill(), circle(), and on_click(). It gives us the power to draw on the screen!`,
      },
      {
        title: "Create the Canvas",
        code: `create_canvas(400, 400)`,
        explanation: `This creates a 400x400 pixel canvas on the screen. Think of it like setting up a blank sheet of paper for us to draw on.`,
      },
      {
        title: "Define the Draw Function",
        code: `def draw(x, y):`,
        explanation: `This defines a function called "draw" that will run every time you click. The x and y tell us WHERE on the canvas you clicked.`,
      },
      {
        title: "Pick a Random Color",
        code: `    fill(random_color())`,
        explanation: `random_color() picks a random bright color each time. fill() tells Python "use this color" for the next shape we draw. The indentation means this line is INSIDE the draw function.`,
      },
      {
        title: "Draw a Circle",
        code: `    circle(x, y, 25)`,
        explanation: `This draws a circle of radius 25 at the position (x, y) where you clicked. The fill color we set earlier is used automatically!`,
      },
      {
        title: "Connect Click to Drawing",
        code: `on_click(draw)`,
        explanation: `This tells Python "whenever the user clicks, call the draw function." It links the click event to our code. Without this, nothing would happen on click!`,
      },
      {
        title: "Keep the Program Running",
        code: `start_anim(lambda: None)`,
        explanation: `This keeps the program alive so it doesn't exit immediately. Without this, the program would run once and stop before you could click anything!`,
      },
    ],
  },
  {
    id: "bouncing-ball",
    title: "Bouncing Ball",
    emoji: "💥",
    hook: "Watch a ball bounce around the screen!",
    description: "A ball bounces off the walls forever. Change the speed, color, or size and see what happens instantly. This is how all video game animations work!",
    difficulty: "Easy",
    runHint: "Just watch — the ball bounces automatically!",
    fullCode: `from canvas_helper import *

create_canvas(400, 400)

x = 200
y = 200
speed_x = 5
speed_y = 3

def update():
    global x, y, speed_x, speed_y
    background("black")
    x = x + speed_x
    y = y + speed_y
    if x > 400 or x < 0:
        speed_x = -speed_x
    if y > 400 or y < 0:
        speed_y = -speed_y
    fill("cyan")
    circle(x, y, 20)

start_anim(update)`,
    steps: [
      {
        title: "Setup Canvas & Ball Position",
        code: `create_canvas(400, 400)

x = 200
y = 200`,
        explanation: `Creates a 400x400 canvas and places the ball at the center (200, 200). The x and y variables track WHERE the ball is on screen.`,
      },
      {
        title: "Set the Speed",
        code: `speed_x = 5
speed_y = 3`,
        explanation: `These control how fast the ball moves. speed_x = 5 means it moves 5 pixels right every frame. speed_y = 3 means 3 pixels down. Change these to make the ball faster or slower!`,
      },
      {
        title: "The Update Function",
        code: `def update():
    global x, y, speed_x, speed_y`,
        explanation: `This function runs every frame (~60 times per second!). "global" tells Python we want to CHANGE the position variables, not create new ones.`,
      },
      {
        title: "Draw Background & Move Ball",
        code: `    background("black")
    x = x + speed_x
    y = y + speed_y`,
        explanation: `First, the background is redrawn in black (this clears the previous frame). Then the ball's position is updated by adding the speed. This creates the illusion of movement!`,
      },
      {
        title: "Bounce Off Walls",
        code: `    if x > 400 or x < 0:
        speed_x = -speed_x
    if y > 400 or y < 0:
        speed_y = -speed_y`,
        explanation: `When the ball hits any edge (x > 400 = right wall, x < 0 = left wall), we flip the direction by making speed negative. This creates the bounce effect!`,
      },
      {
        title: "Draw the Ball",
        code: `    fill("cyan")
    circle(x, y, 20)`,
        explanation: `Sets the ball color to cyan and draws it at the current (x, y) position with radius 20. Try changing "cyan" to "red" or "yellow" to see the ball change color!`,
      },
      {
        title: "Start the Animation Loop",
        code: `start_anim(update)`,
        explanation: `This starts the game loop! It calls the update() function ~60 times every second. Each call moves the ball a tiny bit and redraws it — creating smooth animation.`,
      },
    ],
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird",
    emoji: "🐤",
    hook: "Press SPACE to fly!",
    description: "A simple Flappy Bird clone! Press the Spacebar to make the bird flap and try to fly through the pipes. See how gravity, collision, and scoring work in a real game.",
    difficulty: "Medium",
    runHint: "Press SPACE to flap! Avoid the pipes!",
    fullCode: `from canvas_helper import *

create_canvas(400, 500)

bird_y = 250
gravity = 5
pipe_x = 400
pipe_gap = 150
gap_y = 200
score = 0
game_running = True

def flap(key):
    global bird_y
    if key == "Space" and game_running:
        bird_y = bird_y - 80

def update():
    global bird_y, pipe_x, score, game_running, gap_y
    background("skyblue")

    # Gravity pulls bird down
    bird_y = bird_y + gravity

    # Draw bird
    fill("yellow")
    circle(100, bird_y, 15)

    # Move pipe
    pipe_x = pipe_x - 4

    # Reset pipe
    if pipe_x < -40:
        pipe_x = 400
        gap_y = 100 + (score % 5) * 50

    # Draw pipes
    fill("green")
    rect(pipe_x, 0, 40, gap_y)
    rect(pipe_x, gap_y + pipe_gap, 40, 500)

    # Collision with ground
    if bird_y > 480:
        game_running = False

    # Collision with pipes
    if 100 + 15 > pipe_x and 100 - 15 < pipe_x + 40:
        if bird_y - 15 < gap_y or bird_y + 15 > gap_y + pipe_gap:
            game_running = False

    # Scoring
    if pipe_x + 40 < 100 and pipe_x + 40 > 96:
        score = score + 1

    # Draw score
    fill("white")
    rect(180, 10, 40, 30)
    fill("black")

on_key_press(flap)
start_anim(update)`,
    steps: [
      {
        title: "Setup Game Variables",
        code: `bird_y = 250
gravity = 5
pipe_x = 400
pipe_gap = 150
gap_y = 200
score = 0
game_running = True`,
        explanation: `These variables control everything: bird_y = bird's position, gravity = how fast it falls, pipe_x = where the pipe is, pipe_gap = the hole size, gap_y = the hole position. score tracks your points and game_running tells us if the game is active.`,
      },
      {
        title: "The Flap Function",
        code: `def flap(key):
    global bird_y
    if key == "Space" and game_running:
        bird_y = bird_y - 80`,
        explanation: `This runs when you press a key. If it's the Spacebar and the game is running, the bird jumps UP by 80 pixels. Negative = upward!`,
      },
      {
        title: "Update & Gravity",
        code: `def update():
    global bird_y, pipe_x, score, game_running, gap_y
    background("skyblue")
    bird_y = bird_y + gravity`,
        explanation: `The update function runs every frame (~60fps). background() clears the screen. Adding gravity to bird_y pulls the bird down each frame — that's why it falls if you don't flap!`,
      },
      {
        title: "Draw Bird & Move Pipe",
        code: `    fill("yellow")
    circle(100, bird_y, 15)
    pipe_x = pipe_x - 4`,
        explanation: `Draws the bird as a yellow circle at (100, bird_y). Then moves the pipe left by 4 pixels. When pipe_x < -40, the pipe resets to the right with a new gap position.`,
      },
      {
        title: "Draw the Pipes",
        code: `    fill("green")
    rect(pipe_x, 0, 40, gap_y)
    rect(pipe_x, gap_y + pipe_gap, 40, 500)`,
        explanation: `Two green rectangles form the pipe: one from the top down to the gap, and one from the gap bottom to the floor. The empty space between them is where the bird must fly through!`,
      },
      {
        title: "Collision Detection",
        code: `    if bird_y > 480:
        game_running = False
    if 100 + 15 > pipe_x and 100 - 15 < pipe_x + 40:
        if bird_y - 15 < gap_y or bird_y + 15 > gap_y + pipe_gap:
            game_running = False`,
        explanation: `Two checks: (1) If bird falls below 480, it hit the ground. (2) If the bird overlaps with the pipe rectangle AND is outside the gap, it hit the pipe. Either way, game over!`,
      },
      {
        title: "Scoring & Animation Loop",
        code: `    if pipe_x + 40 < 100 and pipe_x + 40 > 96:
        score = score + 1
    fill("white")
    rect(180, 10, 40, 30)
    fill("black")

on_key_press(flap)
start_anim(update)`,
        explanation: `When the pipe passes behind the bird (x position crosses 100), score increases by 1. A white score box is drawn at the top. on_key_press connects the spacebar to flap, and start_anim keeps the game running at 60fps!`,
      },
    ],
  },
];
