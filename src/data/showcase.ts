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
    hook: "Full paintbrush toolkit — drag, color, erase, fill, randomize!",
    description: "A complete paint program! Drag to paint smooth strokes, switch between 8 colors, toggle eraser mode, fill the canvas, randomize colors, change brush shape, and more.",
    difficulty: "Easy",
    runHint: "Drag to paint! 1-8=colors, E=eraser, F=fill, R=random, Q=square brush, S/B=size, C=clear",
    fullCode: `create_canvas(400, 400)

bg = "#222222"
background(bg)
drawing = False
color = "#ff4466"
brush_size = 6
eraser = False
square = False
last_x = 0
last_y = 0
colors = ["#ff4466", "#44bbdd", "#44dd66", "#ffdd44", "#ff8844", "#cc66ff", "#ff66aa", "#ffffff"]

def step():
    global drawing, color, brush_size, eraser, square, last_x, last_y, bg
    for evt in poll_events():
        t = evt["type"]
        if t == "keydown":
            c = evt["code"]
            if c == "KeyC": background(bg)
            elif c == "KeyE": eraser = not eraser
            elif c == "KeyF": background(color); bg = color
            elif c == "KeyR": color = random_color()
            elif c == "KeyQ": square = not square
            elif c == "KeyS": brush_size = max(2, brush_size - 2)
            elif c == "KeyB": brush_size = min(40, brush_size + 2)
            else:
                for i in range(8):
                    if c == "Digit" + str(i + 1):
                        eraser = False
                        color = colors[i]
        elif t == "mousedown":
            drawing = True
            last_x, last_y = evt["x"], evt["y"]
            draw_at(evt["x"], evt["y"])
        elif t == "mousemove" and drawing:
            stroke(last_x, last_y, evt["x"], evt["y"])
            last_x, last_y = evt["x"], evt["y"]
        elif t == "mouseup":
            drawing = False

def stroke(x1, y1, x2, y2):
    c = bg if eraser else color
    fill(c)
    if square:
        # Draw a thick line as overlapping squares
        steps = max(int(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5 / 3), 1)
        for i in range(steps + 1):
            t = i / steps
            cx = x1 + (x2 - x1) * t
            cy = y1 + (y2 - y1) * t
            rect(cx - brush_size / 2, cy - brush_size / 2, brush_size, brush_size)
    else:
        line(x1, y1, x2, y2)
        circle(x2, y2, brush_size / 2)

def draw_at(x, y):
    c = bg if eraser else color
    fill(c)
    if square:
        rect(x - brush_size / 2, y - brush_size / 2, brush_size, brush_size)
    else:
        circle(x, y, brush_size / 2)`,
    steps: [
      {
        title: "Canvas & Setup",
        code: `create_canvas(400, 400)

bg = "#222222"
background(bg)
drawing = False
color = "#ff4466"
brush_size = 6
eraser = False
square = False
last_x = 0
last_y = 0`,
        explanation: `Sets up the canvas and all painting variables: bg=background color, drawing=tracks mouse state, color=current brush, brush_size=thickness, eraser=toggles erase mode, square=toggles brush shape, last_x/Y=for smooth strokes.`,
      },
      {
        title: "8 Color Palette",
        code: `colors = ["#ff4466", "#44bbdd", "#44dd66",
          "#ffdd44", "#ff8844", "#cc66ff",
          "#ff66aa", "#ffffff"]`,
        explanation: `A list of 8 colors! Press keys 1-8 to select: red, blue, green, yellow, orange, purple, pink, white. Pick any color instantly!`,
      },
      {
        title: "The Step Function & Key Handling",
        code: `def step():
    global drawing, color, brush_size, eraser, square, last_x, last_y, bg
    for evt in poll_events():
        if evt["type"] == "keydown":
            c = evt["code"]
            if c == "KeyC": background(bg)
            elif c == "KeyE": eraser = not eraser
            elif c == "KeyF": background(color); bg = color
            elif c == "KeyR": color = random_color()
            elif c == "KeyQ": square = not square
            elif c == "KeyS": brush_size = max(2, brush_size - 2)
            elif c == "KeyB": brush_size = min(40, brush_size + 2)
            else:
                for i in range(8):
                    if c == "Digit" + str(i + 1):
                        eraser = False
                        color = colors[i]`,
        explanation: `step() runs every frame and processes all pending events. C=clear, E=toggle eraser, F=fill canvas with current color, R=pick random color, Q=toggle square brush, S/B=shrink/grow brush, 1-8=pick a color from the palette.`,
      },
      {
        title: "Mouse Event Handling",
        code: `        elif t == "mousedown":
            drawing = True
            last_x, last_y = evt["x"], evt["y"]
            draw_at(evt["x"], evt["y"])
        elif t == "mousemove" and drawing:
            stroke(last_x, last_y, evt["x"], evt["y"])
            last_x, last_y = evt["x"], evt["y"]
        elif t == "mouseup":
            drawing = False`,
        explanation: `Mouse down starts drawing and places the first dot. Mouse move draws a stroke between the last position and current one. Mouse up stops drawing. Smooth and responsive!`,
      },
      {
        title: "The Stroke Function",
        code: `def stroke(x1, y1, x2, y2):
    c = bg if eraser else color
    fill(c)
    if square:
        steps = max(int(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5 / 3), 1)
        for i in range(steps + 1):
            t = i / steps
            cx = x1 + (x2 - x1) * t
            cy = y1 + (y2 - y1) * t
            rect(cx - brush_size / 2, cy - brush_size / 2, brush_size, brush_size)
    else:
        line(x1, y1, x2, y2)
        circle(x2, y2, brush_size / 2)`,
        explanation: `The stroke function connects two points. If eraser mode is on, it draws with the background color (erasing!). Square brush draws overlapping squares along the path using math. Round brush draws a line plus a circle at the end for smooth caps.`,
      },
      {
        title: "The Draw Helper",
        code: `def draw_at(x, y):
    c = bg if eraser else color
    fill(c)
    if square:
        rect(x - brush_size / 2, y - brush_size / 2, brush_size, brush_size)
    else:
        circle(x, y, brush_size / 2)`,
        explanation: `draw_at() places a single brush dab at (x,y). Square mode draws a rectangle, round mode draws a circle. Eraser uses the background color to "erase" previous strokes.`,
      },
      {
        title: "Full Controls Reference",
        code: `# KEYS:
# 1-8  Pick color from palette
# E    Toggle eraser mode
# F    Fill canvas with current color
# R    Random color
# Q    Toggle square / round brush
# S    Smaller brush
# B    Bigger brush
# C    Clear canvas`,
        explanation: `Try them all! 1-8 for colors (red, blue, green, yellow, orange, purple, pink, white). E to erase mistakes. F to fill the whole canvas. R for surprise colors. Q to switch between round and square brushes. S and B to adjust size. C to start fresh!`,
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
        if evt["type"] == "keydown" and evt["code"] in ("Space", "ArrowUp") and not game_over:
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

    if pipe_x + 40 < 100 and pipe_x + 40 >= 96:
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
        if evt["type"] == "keydown" and evt["code"] in ("Space", "ArrowUp") and not game_over:
            bird_y -= 80`,
        explanation: `step() runs every frame. poll_events() gets all keyboard/mouse events from the browser. If Space or ArrowUp is pressed and the game isn't over, the bird jumps UP by 80 pixels!`,
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
        code: `    if pipe_x + 40 < 100 and pipe_x + 40 >= 96:
        score += 1

    fill("white")
    rect(180, 10, 40, 30)`,
        explanation: `When the pipe passes behind the bird (x crosses 100), score increases by 1. The >= ensures it counts exactly once per pipe. A white scoreboard rectangle is drawn at the top.`,
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
  {
    id: "hand-gesture",
    title: "Rock Paper Scissors",
    emoji: "✋",
    hook: "Show your hand to the camera!",
    description: "AI-powered hand gesture recognition! Show Rock, Paper, Scissors, Peace, Thumbs Up, or Pointing to the camera and the AI recognizes it in real-time using MediaPipe hand tracking.",
    difficulty: "Medium",
    runHint: "Show your hand to the camera! Gestures: Rock ✊, Paper ✋, Scissors ✌️, Thumbs Up 👍, Pointing ☝️",
    fullCode: `create_canvas(640, 480)

GESTURES = {
    "ROCK": "✊ Rock",
    "PAPER": "✋ Paper",
    "SCISSORS": "✌️ Scissors",
    "THUMBS_UP": "👍 Thumbs Up",
    "POINT": "☝️ Pointing",
    "OK": "👌 OK",
    "HAND": "🤚 Hand",
}
SKELETON = [(0,1),(1,2),(2,3),(3,4),(0,5),(5,6),(6,7),(7,8),(0,9),(9,10),(10,11),(11,12),(0,13),(13,14),(14,15),(15,16),(0,17),(17,18),(18,19),(19,20),(5,9),(9,13),(13,17)]

def step():
    background("#1a1a2e")
    hd = get_hand_data()
    if hd is None:
        text("Show your hand to the camera", 320, 240, 22, "#666666")
        return

    landmarks = hd["landmarks"]
    gesture = hd["gesture"]

    # Draw skeleton connections
    for i, j in SKELETON:
        x1 = landmarks[i]["x"] * 640
        y1 = landmarks[i]["y"] * 480
        x2 = landmarks[j]["x"] * 640
        y2 = landmarks[j]["y"] * 480
        fill("#44dd88")
        line(x1, y1, x2, y2)

    # Draw joint dots
    for lm in landmarks:
        fill("#ffffff")
        circle(lm["x"] * 640, lm["y"] * 480, 5)

    # Gesture name at top
    label = GESTURES.get(gesture, gesture)
    color_map = {"ROCK": "#ff4466", "PAPER": "#44bbdd", "SCISSORS": "#ffdd44", "THUMBS_UP": "#44dd66", "POINT": "#ff8844", "OK": "#cc66ff", "HAND": "#888888"}
    c = color_map.get(gesture, "white")
    fill(c)
    rect(200, 10, 240, 50)
    fill("#1a1a2e")
    text(label, 320, 46, 24, c)

    # Instructions
    fill("#444488")
    text("Rock | Paper | Scissors | Thumbs Up | Point | OK", 320, 470, 12, "#666688")`,
    steps: [
      {
        title: "Canvas Setup & Gesture Labels",
        code: `create_canvas(640, 480)

GESTURES = {
    "ROCK": "✊ Rock",
    "PAPER": "✋ Paper",
    "SCISSORS": "✌️ Scissors",
    "THUMBS_UP": "👍 Thumbs Up",
    "POINT": "☝️ Pointing",
    "OK": "👌 OK",
    "HAND": "🤚 Hand",
}`,
        explanation: `Creates a 640x480 canvas for the camera view. GESTURES maps internal names to display labels with emojis. The AI detects your hand and classifies it into one of these poses!`,
      },
      {
        title: "Skeleton Connections",
        code: `SKELETON = [(0,1),(1,2),(2,3),(3,4),(0,5),(5,6),(6,7),(7,8),
  (0,9),(9,10),(10,11),(11,12),(0,13),(13,14),(14,15),(15,16),
  (0,17),(17,18),(18,19),(19,20),(5,9),(9,13),(13,17)]`,
        explanation: `These 21 landmark indices define the hand skeleton. Each pair connects two joints: thumb (0-4), index (5-8), middle (9-12), ring (13-16), pinky (17-20), plus palm connections (5-9-13-17).`,
      },
      {
        title: "The Step Function",
        code: `def step():
    background("#1a1a2e")
    hd = get_hand_data()
    if hd is None:
        text("Show your hand to the camera", 320, 240, 22, "#666666")
        return`,
        explanation: `step() runs every frame. get_hand_data() reads the latest hand landmarks detected by MediaPipe in the browser. If no hand is visible, it shows a prompt. This is where Python meets AI!`,
      },
      {
        title: "Draw the Hand Skeleton",
        code: `    landmarks = hd["landmarks"]
    for i, j in SKELETON:
        x1 = landmarks[i]["x"] * 640
        y1 = landmarks[i]["y"] * 480
        x2 = landmarks[j]["x"] * 640
        y2 = landmarks[j]["y"] * 480
        fill("#44dd88")
        line(x1, y1, x2, y2)
    for lm in landmarks:
        fill("#ffffff")
        circle(lm["x"] * 640, lm["y"] * 480, 5)`,
        explanation: `Each landmark has x, y, z between 0-1. We multiply by canvas size (640x480) to get pixel positions. Green lines connect bones, white dots mark joints. The skeleton follows your hand in real-time!`,
      },
      {
        title: "Gesture Detection",
        code: `    gesture = hd["gesture"]
    color_map = {"ROCK": "#ff4466", "PAPER": "#44bbdd",
      "SCISSORS": "#ffdd44", "THUMBS_UP": "#44dd66",
      "POINT": "#ff8844", "OK": "#cc66ff", "HAND": "#888888"}
    c = color_map.get(gesture, "white")
    fill(c)
    rect(200, 10, 240, 50)`,
        explanation: `The JavaScript code classifies your hand pose by checking which fingers are extended (comparing fingertip-to-wrist distances). Each gesture gets a color-coded banner at the top of the screen!`,
      },
      {
        title: "Display the Gesture Label",
        code: `    label = GESTURES.get(gesture, gesture)
    fill("#1a1a2e")
    text(label, 320, 46, 24, c)`,
        explanation: `Draws the gesture name and emoji in the colored banner. "ROCK" shows ✊ Rock in red, "PAPER" shows ✋ Paper in blue, "SCISSORS" shows ✌️ Scissors in yellow, and so on!`,
      },
      {
        title: "How It Works — Behind the Scenes",
        code: `# JavaScript handles the AI:
# 1. MediaPipe Hands detects 21 landmarks
# 2. Gesture classifier checks finger extension
# 3. Result stored in window.__handData
# 4. Python reads it via get_hand_data()
# 5. Python draws skeleton + label`,
        explanation: `The heavy AI work runs in JavaScript (MediaPipe WASM). Python's job is to read the results and draw them beautifully. This is a great example of using Python for visualization while JS handles real-time ML!`,
      },
    ],
  },
];
