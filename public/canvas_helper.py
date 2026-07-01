from js import document, window, console
import random
import math

_canvas = None
_ctx = None
_anim_id = None

def create_canvas(w, h):
    global _canvas, _ctx
    existing = document.getElementById("showcase-canvas")
    if existing is None:
        canv = document.createElement("canvas")
        canv.id = "showcase-canvas"
        canv.width = w
        canv.height = h
        style = (
            "border-radius:12px;display:block;margin:0 auto;"
            f"width:{w}px;height:{h}px;max-width:100%"
        )
        canv.setAttribute("style", style)
        container = document.getElementById("canvas-container")
        if container:
            container.appendChild(canv)
        else:
            document.body.appendChild(canv)
        _canvas = canv
    else:
        existing.width = w
        existing.height = h
        _canvas = existing
    _ctx = _canvas.getContext("2d")

def _get_ctx():
    if _ctx is None:
        create_canvas(400, 400)
    return _ctx

def background(color):
    ctx = _get_ctx()
    ctx.fillStyle = _resolve_color(color)
    ctx.fillRect(0, 0, _canvas.width, _canvas.height)

def fill(color):
    ctx = _get_ctx()
    ctx.fillStyle = _resolve_color(color)

def rect(x, y, w, h):
    ctx = _get_ctx()
    ctx.fillRect(x, y, w, h)

def circle(x, y, r):
    ctx = _get_ctx()
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * math.pi)
    ctx.fill()

def clear():
    ctx = _get_ctx()
    ctx.clearRect(0, 0, _canvas.width, _canvas.height)

def random_color():
    r = random.randint(100, 255)
    g = random.randint(100, 255)
    b = random.randint(100, 255)
    return f"rgb({r},{g},{b})"

def rgb(r, g, b):
    return f"rgb({r},{g},{b})"

def _resolve_color(color):
    if color.startswith("#") or color.startswith("rgb"):
        return color
    named = {
        "red": "#ff4444",
        "green": "#44aa44",
        "blue": "#4488ff",
        "yellow": "#ffdd44",
        "cyan": "#44dddd",
        "orange": "#ff8844",
        "pink": "#ff66aa",
        "purple": "#aa66ff",
        "white": "#ffffff",
        "black": "#222222",
        "skyblue": "#87ceeb",
    }
    return named.get(color, color)

def get_width():
    if _canvas:
        return _canvas.width
    return 400

def get_height():
    if _canvas:
        return _canvas.height
    return 400

def on_key_press(fn):
    def handler(event):
        fn(event.key)
    document.addEventListener("keydown", handler)

def on_click(fn):
    def handler(event):
        rect = _canvas.getBoundingClientRect()
        x = event.clientX - rect.left
        y = event.clientY - rect.top
        fn(x, y)
    _canvas.addEventListener("click", handler)

def start_anim(fn):
    global _anim_id
    frame_count = [0]

    def loop(timestamp):
        fn()
        frame_count[0] += 1
        if frame_count[0] < 10000:
            window.requestAnimationFrame(loop)

    window.requestAnimationFrame(loop)
