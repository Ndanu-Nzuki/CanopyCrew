from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.plans import router as plans_router
from app.api.routes.sites import router as sites_router
from app.core.config import get_settings

settings = get_settings()

# Explicitly ensure Vite dev server (http://localhost:5173) and production Cloud Run
# domains (*.run.app + any configured CORS_ORIGINS) are permitted.
ALLOWED_ORIGINS = list(dict.fromkeys(["http://localhost:5173", *settings.cors_origins]))

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for the CanopyCrew urban greening platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(sites_router, prefix=settings.api_v1_prefix)
app.include_router(plans_router, prefix=settings.api_v1_prefix)
