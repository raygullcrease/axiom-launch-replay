"""Packs the rendered icon PNGs into a .ico (Windows) and a .icns (macOS)."""
import sys
from pathlib import Path

from PIL import Image

src, out, name = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
master = Image.open(src / "icon-1024.png").convert("RGBA")
frames = [Image.open(src / f"icon-{s}.png").convert("RGBA") for s in (16, 24, 32, 48, 64, 128, 256)]
frames[-1].save(out / f"{name}.ico", format="ICO", append_images=frames[:-1], sizes=[f.size for f in frames])
master.save(out / f"{name}.icns", format="ICNS")
print("packed", out / f"{name}.ico", out / f"{name}.icns")
