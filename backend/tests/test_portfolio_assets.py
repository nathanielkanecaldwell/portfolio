# Copyright 2026 Nathaniel Caldwell
# SPDX-License-Identifier: Apache-2.0
import json
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FRONTEND = ROOT / "frontend"


def test_identity_links_and_logos_are_packaged():
    data = json.loads((FRONTEND / "src/content/portfolio.json").read_text(encoding="utf-8"))
    assert data["name"] == "Nathaniel Caldwell"
    assert data["email"] == "nathanielkanecaldwell@gmail.com"
    assert [(app["name"], app["url"]) for app in data["apps"][:2]] == [
        ("Matchforth", "https://matchforth.com"),
        ("In Need", "https://in-need.us"),
    ]
    for app in data["apps"]:
        logo = FRONTEND / "src/assets/logos" / app["logo"]
        assert logo.is_file(), f"Missing logo: {logo}"
        if logo.suffix.lower() == ".png":
            image = logo.read_bytes()
            assert image[:8] == b"\x89PNG\r\n\x1a\n"
            width, height = struct.unpack(">II", image[16:24])
            assert width > 0 and height > 0


def test_social_icons_and_bundled_source():
    data = json.loads((FRONTEND / "src/content/portfolio.json").read_text(encoding="utf-8"))
    for social in data["socials"]:
        svg = FRONTEND / "src/assets/socials" / (social["platform"] + ".svg")
        assert svg.is_file(), f"Missing social icon: {svg}"
        assert "<svg" in svg.read_text(encoding="utf-8")
    code = (FRONTEND / "src/main.jsx").read_text(encoding="utf-8")
    assert "import portfolio from './content/portfolio.json'" in code
    assert "import matchforthLogo from './assets/logos/matchforth.png'" in code
    assert "import inNeedLogo from './assets/logos/in-need.png'" in code
    assert "await fetch(" not in code
    assert "fetch('/portfolio.json'" not in code
