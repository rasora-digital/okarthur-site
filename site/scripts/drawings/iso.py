"""Isometric scene builder from the Steven Yule Deck Style, unchanged.

Used by scenes.py. See that file for how the site's drawings are made.
"""
import math
C = dict(top="#FFFFFF", left="#E6EDEF", right="#D5E0E3", ground="#F8FAFA", gedge="#C9D3D6",
         ink="#283C42", band="#597B84", red="#BA4432", road="#8FA5AD", door="#597B84")
K = 34.0          # pixels per unit
c30, s30 = math.cos(math.radians(30)), 0.5

class Scene:
    def __init__(self, ox=0, oy=0):
        self.ox, self.oy, self.el = ox, oy, []
        self.bx = [1e9, 1e9, -1e9, -1e9]
    def keep(self, px, py):
        b = self.bx; b[0] = min(b[0], px); b[1] = min(b[1], py); b[2] = max(b[2], px); b[3] = max(b[3], py)
    def P(self, x, y, z=0):
        pt = (self.ox + (x - y) * c30 * K, self.oy + (x + y) * s30 * K - z * K)
        self.keep(*pt)
        return pt
    def poly(self, pts, fill, stroke=None, sw=0, extra=""):
        d = " ".join(f"{a:.1f},{b:.1f}" for a, b in pts)
        st = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ' stroke="none"'
        self.el.append(f'<polygon points="{d}" fill="{fill}"{st} {extra}/>')
    def line(self, pts, stroke, sw, cap="round", extra=""):
        d = " ".join(f"{a:.1f},{b:.1f}" for a, b in pts)
        self.el.append(f'<polyline points="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="{cap}" stroke-linejoin="round" {extra}/>')
    def ground(self, W, D):
        P = self.P
        self.poly([P(0,0), P(W,0), P(W,D), P(0,D)], C["ground"], C["gedge"], 3)
    def strip(self, x0, y0, x1, y1, fill, stroke=None):
        P = self.P
        self.poly([P(x0,y0), P(x1,y0), P(x1,y1), P(x0,y1)], fill, stroke, 2.5 if stroke else 0)
    def route(self, pts, color=None, sw=11, z=0.02):
        self.line([self.P(x, y, z) for x, y in pts], color or C["red"], sw)
    def box(self, x, y, z, w, d, h, bands=None, grid=None, door=None):
        P = self.P
        x1, y1, z1 = x + w, y + d, z + h
        left = [P(x,y1,z), P(x1,y1,z), P(x1,y1,z1), P(x,y1,z1)]     # faces +y
        right = [P(x1,y,z), P(x1,y1,z), P(x1,y1,z1), P(x1,y,z1)]    # faces +x
        top = [P(x,y,z1), P(x1,y,z1), P(x1,y1,z1), P(x,y1,z1)]
        self.poly(left, C["left"]); self.poly(right, C["right"]); self.poly(top, C["top"])
        if bands:
            for k in range(1, int(h / bands) + (0 if abs(h / bands - round(h / bands)) < 1e-6 else 1)):
                zz = z + k * bands
                if zz >= z1 - 1e-6: break
                self.line([P(x,y1,zz), P(x1,y1,zz), P(x1,y,zz)], C["band"], 2.2, "butt")
        if grid:
            gx, gz = grid
            n = int(round(w / gx))
            for i in range(1, n):
                xx = x + i * w / n
                self.line([P(xx,y1,z), P(xx,y1,z1)], C["band"], 2.2, "butt")
            m = int(round(d / gx))
            for i in range(1, m):
                yy = y + i * d / m
                self.line([P(x1,yy,z), P(x1,yy,z1)], C["band"], 2.2, "butt")
            for k in range(1, int(round(h / gz))):
                zz = z + k * h / round(h / gz)
                self.line([P(x,y1,zz), P(x1,y1,zz), P(x1,y,zz)], C["band"], 2.2, "butt")
        if door:
            dx0, dx1, dh = door
            self.poly([P(dx0,y1,z), P(dx1,y1,z), P(dx1,y1,z+dh), P(dx0,y1,z+dh)], C["door"], C["ink"], 2.5)
        # outline
        sil = [P(x,y,z1), P(x1,y,z1), P(x1,y,z), P(x1,y1,z), P(x,y1,z), P(x,y1,z1)]
        self.poly(sil, "none", C["ink"], 4)
        self.line([P(x,y1,z1), P(x1,y1,z1), P(x1,y,z1)], C["ink"], 3)
        self.line([P(x1,y1,z1), P(x1,y1,z)], C["ink"], 3)
    def tank(self, cx, cy, r, h):
        P = self.P
        a, b = r * K * math.sqrt(1.5), r * K * math.sqrt(0.5)
        bx, by = P(cx, cy, 0); tx, ty = P(cx, cy, h)
        self.keep(bx - a, by + b); self.keep(bx + a, ty - b)
        # body
        self.el.append(f'<path d="M{bx-a:.1f},{ty:.1f} L{bx-a:.1f},{by:.1f} A{a:.1f},{b:.1f} 0 0 0 {bx+a:.1f},{by:.1f} L{bx+a:.1f},{ty:.1f} Z" fill="{C["left"]}" stroke="{C["ink"]}" stroke-width="4" stroke-linejoin="round"/>')
        self.el.append(f'<ellipse cx="{tx:.1f}" cy="{ty:.1f}" rx="{a:.1f}" ry="{b:.1f}" fill="{C["top"]}" stroke="{C["ink"]}" stroke-width="4"/>')
    def arrowhead(self, x, y, dx, dy, z=0.02, size=0.55, color=None):
        # arrow pointing along ground direction (dx, dy) with tip at (x, y)
        L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; px, py = -uy, ux
        tip = self.P(x, y, z)
        b1 = self.P(x - ux * size + px * size * 0.6, y - uy * size + py * size * 0.6, z)
        b2 = self.P(x - ux * size - px * size * 0.6, y - uy * size - py * size * 0.6, z)
        self.poly([tip, b1, b2], color or C["red"], color or C["red"], 2)
    def node(self, x, y, z=0.02, r=9, color=None):
        px, py = self.P(x, y, z)
        self.el.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{r}" fill="#FFFFFF" stroke="{color or C["red"]}" stroke-width="5"/>')
    def svg(self):
        m = 12; x0, y0, x1, y1 = self.bx[0] - m, self.bx[1] - m, self.bx[2] + m, self.bx[3] + m
        w, h = x1 - x0, y1 - y0
        self.size = (int(round(w)), int(round(h)))
        return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.0f}" height="{h:.0f}" viewBox="{x0:.1f} {y0:.1f} {w:.1f} {h:.1f}"><rect x="{x0:.1f}" y="{y0:.1f}" width="{w:.1f}" height="{h:.1f}" fill="#FFFFFF"/>' + "".join(self.el) + "</svg>"
