import sys
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from backend.app.main import app


def test_health():
    assert TestClient(app).get('/api/health').json() == {'status': 'ok'}


def test_portfolio_has_two_apps():
    response = TestClient(app).get("/api/portfolio")

    assert response.status_code == 200

    data = response.json()

    assert len(data["apps"]) == 2

    assert {app["name"] for app in data["apps"]} == {
        "Matchforth",
        "In Need",
    }

    assert {app["url"] for app in data["apps"]} == {
        "https://matchforth.com",
        "https://in-need.us",
    }
