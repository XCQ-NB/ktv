#!/usr/bin/env python3
"""Generate 3D glossy icons matching the reference UI design."""

import math
import os
import struct
import zlib
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS_3D = os.path.join(ROOT, 'assets', 'icons', '3d')
ICONS_TAB = os.path.join(ROOT, 'assets', 'icons')
LOGO_PATH = os.path.join(ROOT, 'assets', 'logo.png')


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def rounded_rect_mask(size, radius):
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def create_gradient(size, c1, c2, direction='diag'):
    img = Image.new('RGB', (size, size))
    for y in range(size):
        for x in range(size):
            if direction == 'diag':
                t = (x + y) / (2 * (size - 1))
            elif direction == 'vertical':
                t = y / (size - 1)
            else:
                t = x / (size - 1)
            img.putpixel((x, y), lerp(c1, c2, t))
    return img


def add_glass_highlight(img, radius):
    w, h = img.size
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.ellipse((-w * 0.2, -h * 0.4, w * 0.9, h * 0.42), fill=(255, 255, 255, 95))
    draw.rounded_rectangle((5, 5, w - 6, h * 0.38), radius=radius - 5, fill=(255, 255, 255, 50))
    draw.line((8, h * 0.36, w - 8, h * 0.36), fill=(255, 255, 255, 30), width=2)
    return Image.alpha_composite(img.convert('RGBA'), overlay)


def add_bottom_shine(img, radius):
    w, h = img.size
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle((8, h * 0.70, w - 8, h - 8), radius=radius - 8, fill=(255, 255, 255, 25))
    draw.rounded_rectangle((10, h * 0.78, w - 10, h - 10), radius=radius - 10, fill=(0, 0, 0, 18))
    return Image.alpha_composite(img, overlay)


def create_3d_icon(size, c1, c2, draw_glyph, direction='diag'):
    radius = int(size * 0.22)
    pad = int(size * 0.12)
    canvas = Image.new('RGBA', (size + pad * 2, size + pad * 2), (0, 0, 0, 0))

    shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=max(3, size // 14)))
    canvas.paste(shadow, (pad + size // 12, pad + size // 6), shadow)

    base = create_gradient(size, c1, c2, direction).convert('RGBA')
    mask = rounded_rect_mask(size, radius)
    icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    icon.paste(base, (0, 0), mask)
    icon = add_glass_highlight(icon, radius)
    icon = add_bottom_shine(icon, radius)

    glyph = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_glyph(ImageDraw.Draw(glyph), size)
    icon = Image.alpha_composite(icon, glyph)
    canvas.paste(icon, (pad, pad), icon)
    return canvas


def draw_music_note(draw, size):
    s = size
    white = (255, 255, 255, 245)
    w = max(2, s // 22)
    draw.ellipse((s * 0.28, s * 0.58, s * 0.48, s * 0.78), fill=white)
    draw.rectangle((s * 0.44, s * 0.24, s * 0.50, s * 0.66), fill=white)
    draw.polygon([
        (s * 0.48, s * 0.24), (s * 0.72, s * 0.30), (s * 0.72, s * 0.42),
        (s * 0.50, s * 0.36), (s * 0.50, s * 0.24)
    ], fill=white)


def draw_calendar(draw, size):
    s = size
    white = (255, 255, 255, 245)
    x1, y1, x2, y2 = s * 0.22, s * 0.26, s * 0.78, s * 0.76
    draw.rounded_rectangle((x1, y1, x2, y2), radius=s * 0.08, fill=white)
    inner = (s * 0.28, s * 0.38, s * 0.72, s * 0.70)
    draw.rounded_rectangle(inner, radius=s * 0.05, fill=(180, 200, 255, 255))
    draw.rectangle((s * 0.30, s * 0.26, s * 0.38, s * 0.36), fill=white)
    draw.rectangle((s * 0.62, s * 0.26, s * 0.70, s * 0.36), fill=white)
    draw.line((s * 0.30, s * 0.44, s * 0.70, s * 0.44), fill=white, width=max(2, s // 30))
    draw.rectangle((s * 0.36, s * 0.50, s * 0.44, s * 0.58), fill=white)
    draw.rectangle((s * 0.48, s * 0.50, s * 0.56, s * 0.58), fill=white)
    draw.rectangle((s * 0.60, s * 0.50, s * 0.68, s * 0.58), fill=white)


def draw_screen(draw, size):
    s = size
    white = (255, 255, 255, 245)
    draw.rounded_rectangle((s * 0.20, s * 0.24, s * 0.80, s * 0.66), radius=s * 0.06, fill=white)
    draw.rounded_rectangle((s * 0.28, s * 0.32, s * 0.72, s * 0.58), radius=s * 0.04, fill=(170, 210, 255, 255))
    draw.polygon([
        (s * 0.44, s * 0.66), (s * 0.56, s * 0.66), (s * 0.58, s * 0.74), (s * 0.42, s * 0.74)
    ], fill=white)
    draw.rectangle((s * 0.36, s * 0.74, s * 0.64, s * 0.78), fill=white)


def draw_clipboard(draw, size):
    s = size
    white = (255, 255, 255, 245)
    draw.rounded_rectangle((s * 0.24, s * 0.22, s * 0.76, s * 0.80), radius=s * 0.08, fill=white)
    draw.rounded_rectangle((s * 0.36, s * 0.16, s * 0.64, s * 0.30), radius=s * 0.05, fill=white)
    draw.line((s * 0.34, s * 0.40, s * 0.66, s * 0.40), fill=(200, 180, 240, 255), width=max(2, s // 28))
    draw.line((s * 0.34, s * 0.50, s * 0.58, s * 0.50), fill=(200, 180, 240, 255), width=max(2, s // 28))
    draw.line((s * 0.34, s * 0.60, s * 0.62, s * 0.60), fill=(200, 180, 240, 255), width=max(2, s // 28))
    draw.line((s * 0.40, s * 0.70, s * 0.52, s * 0.82), fill=(120, 90, 200, 255), width=max(3, s // 18))
    draw.line((s * 0.40, s * 0.82, s * 0.58, s * 0.64), fill=(120, 90, 200, 255), width=max(3, s // 18))


def draw_chart(draw, size):
    s = size
    white = (255, 255, 255, 245)
    draw.rounded_rectangle((s * 0.20, s * 0.24, s * 0.80, s * 0.78), radius=s * 0.08, fill=white)
    draw.rectangle((s * 0.30, s * 0.56, s * 0.40, s * 0.68), fill=(140, 210, 150, 255))
    draw.rectangle((s * 0.46, s * 0.44, s * 0.56, s * 0.68), fill=(100, 190, 120, 255))
    draw.rectangle((s * 0.62, s * 0.34, s * 0.72, s * 0.68), fill=(70, 170, 100, 255))


def draw_task(draw, size):
    s = size
    white = (255, 255, 255, 245)
    draw.rounded_rectangle((s * 0.22, s * 0.24, s * 0.78, s * 0.78), radius=s * 0.08, fill=white)
    draw.line((s * 0.32, s * 0.40, s * 0.44, s * 0.52), fill=(90, 180, 100, 255), width=max(3, s // 16))
    draw.line((s * 0.44, s * 0.52, s * 0.68, s * 0.36), fill=(90, 180, 100, 255), width=max(3, s // 16))
    draw.line((s * 0.32, s * 0.58, s * 0.68, s * 0.58), fill=(170, 220, 175, 255), width=max(2, s // 24))
    draw.line((s * 0.32, s * 0.68, s * 0.58, s * 0.68), fill=(170, 220, 175, 255), width=max(2, s // 24))


def draw_bell(draw, size):
    s = size
    white = (255, 255, 255, 245)
    draw.pieslice((s * 0.28, s * 0.24, s * 0.72, s * 0.68), 200, 340, fill=white)
    draw.rectangle((s * 0.30, s * 0.62, s * 0.70, s * 0.68), fill=white)
    draw.ellipse((s * 0.44, s * 0.68, s * 0.56, s * 0.76), fill=white)
    draw.ellipse((s * 0.46, s * 0.20, s * 0.54, s * 0.28), fill=white)


def draw_bars(draw, size):
    s = size
    white = (255, 255, 255, 245)
    draw.rounded_rectangle((s * 0.24, s * 0.58, s * 0.38, s * 0.76), radius=s * 0.04, fill=white)
    draw.rounded_rectangle((s * 0.44, s * 0.44, s * 0.58, s * 0.76), radius=s * 0.04, fill=white)
    draw.rounded_rectangle((s * 0.64, s * 0.30, s * 0.78, s * 0.76), radius=s * 0.04, fill=white)


ICON_DEFS = {
    'note': (draw_music_note, (255, 138, 128), (38, 198, 218)),
    'calendar': (draw_calendar, (100, 181, 246), (30, 136, 229)),
    'screen': (draw_screen, (79, 195, 247), (2, 136, 209)),
    'clipboard': (draw_clipboard, (179, 157, 219), (126, 87, 194)),
    'chart': (draw_chart, (129, 199, 132), (56, 142, 60)),
    'task': (draw_task, (165, 214, 167), (76, 175, 80)),
    'bell': (draw_bell, (171, 145, 227), (123, 97, 203)),
    'bars': (draw_bars, (129, 199, 132), (67, 160, 71)),
}


def create_tab_icon(size, color, draw_fn):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_fn(draw, size, color)
    return img


def draw_tab_home(draw, size, color):
    s = size
    c = color + (255,)
    w = max(3, s // 10)
    pts = [
        (s * 0.5, s * 0.16), (s * 0.84, s * 0.40), (s * 0.74, s * 0.40),
        (s * 0.74, s * 0.80), (s * 0.26, s * 0.80), (s * 0.26, s * 0.40), (s * 0.16, s * 0.40)
    ]
    if sum(color) > 400:
        draw.polygon(pts, fill=c)
    else:
        draw.polygon(pts, outline=c, width=w)
        draw.line((s * 0.38, s * 0.80, s * 0.62, s * 0.80), fill=c, width=w)


def draw_tab_checkin(draw, size, color):
    s = size
    c = color + (255,)
    w = max(3, s // 10)
    if sum(color) > 400:
        draw.rounded_rectangle((s * 0.16, s * 0.18, s * 0.84, s * 0.84), radius=s * 0.10, fill=c)
        draw.rectangle((s * 0.24, s * 0.30, s * 0.76, s * 0.76), fill=(255, 255, 255, 255))
    else:
        draw.rounded_rectangle((s * 0.16, s * 0.18, s * 0.84, s * 0.84), radius=s * 0.10, outline=c, width=w)
    draw.line((s * 0.24, s * 0.34, s * 0.76, s * 0.34), fill=c, width=w)
    draw.line((s * 0.34, s * 0.18, s * 0.34, s * 0.28), fill=c, width=w)
    draw.line((s * 0.66, s * 0.18, s * 0.66, s * 0.28), fill=c, width=w)
    draw.line((s * 0.32, s * 0.54, s * 0.42, s * 0.64), fill=c, width=w + 1)
    draw.line((s * 0.42, s * 0.64, s * 0.68, s * 0.44), fill=c, width=w + 1)


def draw_tab_dashboard(draw, size, color):
    s = size
    c = color + (255,)
    w = max(3, s // 10)
    bars = [(0.24, 0.58, 0.40, 0.80), (0.44, 0.42, 0.60, 0.80), (0.64, 0.26, 0.80, 0.80)]
    for x1, y1, x2, y2 in bars:
        if sum(color) > 400:
            draw.rounded_rectangle((s * x1, s * y1, s * x2, s * y2), radius=s * 0.04, fill=c)
        else:
            draw.rounded_rectangle((s * x1, s * y1, s * x2, s * y2), radius=s * 0.04, outline=c, width=w)


def draw_tab_schedule(draw, size, color):
    s = size
    c = color + (255,)
    w = max(3, s // 10)
    if sum(color) > 400:
        draw.ellipse((s * 0.16, s * 0.16, s * 0.84, s * 0.84), fill=c)
        draw.ellipse((s * 0.26, s * 0.26, s * 0.74, s * 0.74), fill=(255, 255, 255, 255))
    else:
        draw.ellipse((s * 0.16, s * 0.16, s * 0.84, s * 0.84), outline=c, width=w)
    draw.line((s * 0.5, s * 0.30, s * 0.5, s * 0.52), fill=c, width=w)
    draw.line((s * 0.5, s * 0.52, s * 0.68, s * 0.64), fill=c, width=w)


def draw_tab_profile(draw, size, color):
    s = size
    c = color + (255,)
    w = max(3, s // 10)
    if sum(color) > 400:
        draw.ellipse((s * 0.30, s * 0.16, s * 0.70, s * 0.48), fill=c)
        draw.pieslice((s * 0.18, s * 0.48, s * 0.82, s * 0.98), 200, 340, fill=c)
    else:
        draw.ellipse((s * 0.30, s * 0.16, s * 0.70, s * 0.48), outline=c, width=w)
        draw.arc((s * 0.18, s * 0.48, s * 0.82, s * 0.98), 200, 340, fill=c, width=w)


def create_logo(size=256):
    icon = create_3d_icon(size, (167, 167, 255), (123, 120, 237), lambda d, s: None)
    draw = ImageDraw.Draw(icon)
    # Re-draw with MK text
    base = create_gradient(size, (167, 167, 255), (123, 120, 237), 'diag').convert('RGBA')
    radius = int(size * 0.22)
    mask = rounded_rect_mask(size, radius)
    core = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    core.paste(base, (0, 0), mask)
    core = add_glass_highlight(core, radius)
    core = add_bottom_shine(core, radius)
    pad = int(size * 0.12)
    canvas = Image.new('RGBA', (size + pad * 2, size + pad * 2), (0, 0, 0, 0))
    shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=(0, 0, 0, 60))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=max(2, size // 18)))
    canvas.paste(shadow, (pad + size // 16, pad + size // 7), shadow)
    canvas.paste(core, (pad, pad), core)
    draw = ImageDraw.Draw(canvas)
    try:
        from PIL import ImageFont
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', int(size * 0.32))
    except Exception:
        font = ImageFont.load_default()
    text = 'MK'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = pad + (size - tw) // 2
    ty = pad + (size - th) // 2 - size * 0.02
    draw.text((tx, ty), text, fill=(255, 255, 255, 255), font=font)
    return canvas


def main():
    os.makedirs(ICONS_3D, exist_ok=True)
    os.makedirs(ICONS_TAB, exist_ok=True)

    for name, (fn, c1, c2) in ICON_DEFS.items():
        icon = create_3d_icon(240, c1, c2, fn)
        icon.save(os.path.join(ICONS_3D, f'{name}.png'))

    tab_defs = [
        ('home', draw_tab_home),
        ('checkin', draw_tab_checkin),
        ('dashboard', draw_tab_dashboard),
        ('schedule', draw_tab_schedule),
        ('profile', draw_tab_profile),
    ]
    for name, fn in tab_defs:
        inactive = create_tab_icon(81, (153, 153, 153), fn)
        active = create_tab_icon(81, (123, 120, 237), fn)
        inactive.save(os.path.join(ICONS_TAB, f'{name}.png'))
        active.save(os.path.join(ICONS_TAB, f'{name}-active.png'))

    create_logo(256).save(LOGO_PATH)
    print('Generated 3D icons successfully')


if __name__ == '__main__':
    main()
