# Copyright 2026 Nathaniel Caldwell
# SPDX-License-Identifier: Apache-2.0
import json
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Social(BaseModel):
    platform: Literal[
        "github",
        "linkedin",
        "facebook",
        "instagram",
    ]
    url: str = ""


class PortfolioApp(BaseModel):
    name: str
    logo: str
    url: str = ""


class Portfolio(BaseModel):
    name: str
    job_title: str
    email: str  # Email validation is optional; keep setup dependency-free.
    socials: list[Social]
    apps: list[PortfolioApp] = Field(min_length=2)


ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = Path(os.getenv("PORTFOLIO_CONFIG_PATH") or ROOT / "frontend/src/content/portfolio.json")

app = FastAPI(title="Nathaniel Caldwell's Portfolio API", docs_url=None, redoc_url=None)
origins = [s.strip() for s in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if s.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/portfolio", response_model=Portfolio)
def get_portfolio():
    return Portfolio.model_validate(json.loads(CONFIG_PATH.read_text(encoding="utf-8")))
