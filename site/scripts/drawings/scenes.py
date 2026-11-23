"""The site's own line drawings, drawn to the Steven Yule Deck Style rules.

    python3 scripts/drawings/scenes.py

Run from site/. Writes portfolio.svg, review-digital.svg and
review-portfolio.svg to public/drawings/. Each drawing carries one idea in
red. Lines follow the ground and end at something real: a solid, a cabinet
or the edge of a site. Solids are painted back to front.

The cover and career drawings, public/drawings/*.webp, are the deck's own
PNGs converted to WebP at one and two times their displayed width. Their
sources are in the style package, not here.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from iso import Scene, C

def boxes(s, items):
    # back to front by the nearest corner, so nearer solids are painted last
    for b in sorted(items, key=lambda b: (b[0] + b[3]) + (b[1] + b[4])):
        x, y, z, w, d, h, kw = b
        s.box(x, y, z, w, d, h, **kw)

def portfolio():
    s = Scene()
    W, D = 27, 16
    s.ground(W, D)
    for x0, x1 in [(0.8, 8.8), (9.6, 17.0), (18.4, 26.2)]:
        s.strip(x0, 0.8, x1, 8.0, "#EFF3F4", "#C9D3D6")
    s.strip(0, 9.2, W, 10.8, "#C7D3D7")
    yk = 11.6
    s.route([(0.0, yk), (22.2, yk)])
    for xb, yf in [(4.4, 7.2), (13.2, 6.8), (22.2, 5.6)]:
        s.route([(xb, yk), (xb, yf)], sw=8)
    b = dict(bands=0.9)
    boxes(s, [
        (1.2, 1.2, 0, 2.4, 2.4, 6.6, b),
        (6.2, 0.9, 0, 2.2, 2.1, 8.4, b),
        (1.4, 4.6, 0, 5.8, 2.6, 1.8, b),
        (10.2, 1.4, 0, 3.0, 2.6, 4.5, b),
        (14.0, 1.4, 0, 2.6, 4.2, 3.6, b),
        (10.2, 4.4, 0, 3.6, 2.4, 2.7, b),
        (20.0, 2.2, 0, 4.4, 3.4, 1.8, b),
    ])
    s.node(0.0, yk)
    for xb in (4.4, 13.2, 22.2):
        s.node(xb, yk, r=8)
    return s

def digital():
    # one asset, its data connection in red from a cabinet at the site edge to the plant room
    s = Scene()
    W, D = 18, 12
    s.ground(W, D)
    s.strip(0.6, 8.6, 17.4, 9.4, "#C7D3D7", "#8FA5AD")
    yr = 10.4
    s.route([(1.9, yr), (12.8, yr), (12.8, 5.6)])
    boxes(s, [
        (2.6, 1.4, 0, 8.2, 4.6, 4.2, dict(grid=(1.025, 1.4))),
        (11.2, 3.4, 0, 3.2, 2.2, 1.6, dict(bands=None)),
        (1.0, 10.0, 0, 0.9, 0.8, 1.1, dict(bands=None)),
    ])
    s.node(12.8, yr)
    return s

def phases():
    # three developments on their own sites, joined by one red connection that ends at each site's edge
    s = Scene()
    g, e = C["ground"], C["gedge"]
    s.strip(0, 0, 8.5, 6, g, e)
    s.strip(11.5, 0, 20, 6, g, e)
    s.strip(5.5, 9.5, 14.5, 15.5, g, e)
    yk = 7.75
    s.route([(4.2, 6.0), (4.2, yk), (15.8, yk), (15.8, 6.0)])
    s.route([(10.0, yk), (10.0, 9.5)])
    b = dict(bands=0.9)
    boxes(s, [
        (1.0, 1.0, 0, 2.6, 2.4, 6.2, b),
        (4.6, 0.8, 0, 2.6, 2.4, 7.6, b),
        (1.2, 4.0, 0, 3.0, 1.4, 1.8, b),
        (12.4, 0.8, 0, 3.2, 2.6, 3.6, b),
        (16.2, 1.2, 0, 2.8, 3.6, 2.7, b),
        (7.0, 11.2, 0, 4.6, 3.0, 1.8, b),
    ])
    for p in [(4.2, yk), (10.0, yk), (15.8, yk)]:
        s.node(*p, r=8)
    return s

out = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).resolve().parents[2] / "public" / "drawings")
for name, fn in [("portfolio", portfolio), ("review-digital", digital), ("review-portfolio", phases)]:
    sc = fn(); open(f"{out}/{name}.svg", "w").write(sc.svg()); print(name, sc.size)
