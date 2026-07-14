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
    hook: "Drag to paint with your mouse!",
    description: "Turn your mouse into a paintbrush! Drag to draw smooth lines, press 1-4 to switch colors, S/B to change brush size, and C to clear the canvas.",
    difficulty: "Easy",
    runHint: "Drag to draw! Press 1-4 for colors, S/B for size, C to clear!",
    fullCode: `create_canvas(400, 400)
background("#222222")

drawing = False
color = "#ff4466"
brush_size = 6
last_x = 0
last_y = 0

def step():
    global drawing, color, brush_size, last_x, last_y
    for evt in poll_events():
        t = evt["type"]
        if t == "keydown":
            c = evt["code"]
            if c == "KeyC": background("#222222")
            elif c == "Digit1": color = "#ff4466"
            elif c == "Digit2": color = "#44bbdd"
            elif c == "Digit3": color = "#44dd66"
            elif c == "Digit4": color = "#ffdd44"
            elif c == "KeyS": brush_size = max(2, brush_size - 2)
            elif c == "KeyB": brush_size = min(30, brush_size + 2)
        elif t == "mousedown":
            drawing = True
            last_x, last_y = evt["x"], evt["y"]
            draw_at(evt["x"], evt["y"])
        elif t == "mousemove" and drawing:
            fill(color)
            line(last_x, last_y, evt["x"], evt["y"])
            last_x, last_y = evt["x"], evt["y"]
        elif t == "mouseup":
            drawing = False

def draw_at(x, y):
    fill(color)
    circle(x, y, brush_size)`,
    steps: [
      {
        title: "Create Canvas & Background",
        code: `create_canvas(400, 400)
background("#222222")`,
        explanation: `Creates a 400x400 pixel canvas with a dark background. The drawing surface is ready!`,
      },
      {
        title: "Set Up Drawing Variables",
        code: `drawing = False
color = "#ff4466"
brush_size = 6
last_x = 0
last_y = 0`,
        explanation: `"drawing" tracks if the mouse is held down. "color" starts as red, "brush_size" is the stroke thickness. last_x/Y remember where the mouse was so we can draw smooth lines.`,
      },
      {
        title: "The Step Function & Event Loop",
        code: `def step():
    global drawing, color, brush_size, last_x, last_y
    for evt in poll_events():`,
        explanation: `step() runs every frame (~60fps). poll_events() grabs all pending mouse/keyboard events from the browser. We loop through each event and react accordingly.`,
      },
      {
        title: "Handle Key Presses",
        code: `        if t == "keydown":
            c = evt["code"]
            if c == "KeyC": background("#222222")
            elif c == "Digit1": color = "#ff4466"
            elif c == "Digit2": color = "#44bbdd"
            elif c == "Digit3": color = "#44dd66"
            elif c == "Digit4": color = "#ffdd44"
            elif c == "KeyS": brush_size = max(2, brush_size - 2)
            elif c == "KeyB": brush_size = min(30, brush_size + 2)`,
        explanation: `Keys 1-4 switch between red, blue, green, and yellow. S shrinks the brush (min 2px), B grows it (max 30px). C clears the canvas to black.`,
      },
      {
        title: "Handle Mouse Down",
        code: `        elif t == "mousedown":
            drawing = True
            last_x, last_y = evt["x"], evt["y"]
            draw_at(evt["x"], evt["y"])`,
        explanation: `When the mouse button is pressed, we mark "drawing = True", save the position, and draw the first dot immediately.`,
      },
      {
        title: "Handle Mouse Move & Up",
        code: `        elif t == "mousemove" and drawing:
            fill(color)
            line(last_x, last_y, evt["x"], evt["y"])
            last_x, last_y = evt["x"], evt["y"]
        elif t == "mouseup":
            drawing = False`,
        explanation: `While dragging, every mouse move draws a line from the LAST position to the CURRENT one — creating smooth strokes! Releasing the mouse sets drawing = False.`,
      },
      {
        title: "The Draw Helper",
        code: `def draw_at(x, y):
    fill(color)
    circle(x, y, brush_size)`,
        explanation: `This helper draws a filled circle at (x, y) using the current color and brush size. Simple but powerful!`,
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
    fullCode: `create_canvas(400, 400)

x = 200
y = 200
speed_x = 5
speed_y = 3

def step():
    global x, y, speed_x, speed_y
    background("black")
    x += speed_x
    y += speed_y
    if x > 400 or x < 0:
        speed_x = -speed_x
    if y > 400 or y < 0:
        speed_y = -speed_y
    fill("cyan")
    circle(x, y, 20)`,
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
        title: "The Step Function",
        code: `def step():
    global x, y, speed_x, speed_y`,
        explanation: `step() runs every frame (~60 times per second!). "global" tells Python we want to CHANGE the position variables, not create new ones.`,
      },
      {
        title: "Draw Background & Move Ball",
        code: `    background("black")
    x += speed_x
    y += speed_y`,
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
        title: "Animation Runs Automatically",
        code: `# No extra code needed!
# React calls step() 60fps for you`,
        explanation: `Unlike the old approach, you don't need start_anim()! The page automatically calls your step() function every frame. Just define step() and it works!`,
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
    fullCode: `create_canvas(400, 500)

bird_y = 250
gravity = 5
pipe_x = 400
gap_y = 200
score = 0
game_over = False
PIPE_GAP = 150

def step():
    global bird_y, pipe_x, gap_y, score, game_over
    for evt in poll_events():
        if evt["type"] == "keydown" and evt["code"] == "Space" and not game_over:
            bird_y -= 80

    if game_over:
        return

    background("skyblue")
    bird_y += gravity
    pipe_x -= 4

    if pipe_x < -40:
        pipe_x = 400
        gap_y = 100 + (score % 5) * 50

    fill("yellow")
    circle(100, bird_y, 15)
    fill("green")
    rect(pipe_x, 0, 40, gap_y)
    rect(pipe_x, gap_y + PIPE_GAP, 40, 500)

    if bird_y > 480 or bird_y < 0:
        game_over = True
        return

    if 100 + 15 > pipe_x and 100 - 15 < pipe_x + 40:
        if bird_y - 15 < gap_y or bird_y + 15 > gap_y + PIPE_GAP:
            game_over = True
            return

    if pipe_x + 40 < 100 and pipe_x + 40 > 96:
        score += 1

    fill("white")
    rect(180, 10, 40, 30)`,
    steps: [
      {
        title: "Setup Canvas & Game Variables",
        code: `create_canvas(400, 500)

bird_y = 250
gravity = 5
pipe_x = 400
gap_y = 200
score = 0
game_over = False
PIPE_GAP = 150`,
        explanation: `Creates a 400x500 game canvas. Sets up all game variables: bird_y = where the bird is, gravity = how fast it falls, pipe_x and gap_y = pipe position, score = your points, game_over = whether you crashed. PIPE_GAP is the space between the two pipes.`,
      },
      {
        title: "The Step Function & Flapping",
        code: `def step():
    global bird_y, pipe_x, gap_y, score, game_over
    for evt in poll_events():
        if evt["type"] == "keydown" and evt["code"] == "Space" and not game_over:
            bird_y -= 80`,
        explanation: `step() runs every frame. poll_events() gets all keyboard/mouse events from the browser. If Space is pressed and the game isn't over, the bird jumps UP by 80 pixels!`,
      },
      {
        title: "Game Over Check & Gravity",
        code: `    if game_over:
        return

    background("skyblue")
    bird_y += gravity
    pipe_x -= 4`,
        explanation: `If the game is over, step() returns immediately — the screen freezes! Otherwise, sky clears the frame, gravity pulls the bird down, and the pipe scrolls left.`,
      },
      {
        title: "Draw Bird & Pipes",
        code: `    fill("yellow")
    circle(100, bird_y, 15)
    fill("green")
    rect(pipe_x, 0, 40, gap_y)
    rect(pipe_x, gap_y + PIPE_GAP, 40, 500)`,
        explanation: `Draws the bird as a yellow circle on the left. Then draws two green rectangles forming the pipe — one from the top, one from the bottom, with a gap in between for the bird to fly through.`,
      },
      {
        title: "Collision Detection",
        code: `    if bird_y > 480 or bird_y < 0:
        game_over = True
        return

    if 100 + 15 > pipe_x and 100 - 15 < pipe_x + 40:
        if bird_y - 15 < gap_y or bird_y + 15 > gap_y + PIPE_GAP:
            game_over = True
            return`,
        explanation: `Three ways to die: (1) Hit the ground (y > 480), (2) Hit the ceiling (y < 0), (3) Hit a pipe — bird overlaps pipe rect AND is outside the gap. Any collision sets game_over and freezes the game!`,
      },
      {
        title: "Score & Scoreboard",
        code: `    if pipe_x + 40 < 100 and pipe_x + 40 > 96:
        score += 1

    fill("white")
    rect(180, 10, 40, 30)`,
        explanation: `When the pipe's right edge passes behind the bird (x crosses 96-100 range), score increases! A white scoreboard rectangle is drawn at the top.`,
      },
      {
        title: "No Extra Wiring Needed",
        code: `# That's it!
# React calls step() every frame
# poll_events() reads key presses
# No on_key_press or start_anim needed!`,
        explanation: `This is the beauty of the new system! You just define step() and poll_events() — no event listeners, no animation loop setup. React handles all the browser plumbing. Just focus on the game logic!`,
      },
    ],
  },
];
