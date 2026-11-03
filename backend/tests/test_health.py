from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import app

client = TestClient(app)


def test_root_endpoint() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to CanopyCrew API 🌱"}


def test_health_endpoints() -> None:
    for path in ("/health", "/api/v1/health"):
        response = client.get(path)
        assert response.status_code == 200
        assert response.json() == {
            "status": "healthy",
            "app": "CanopyCrew API",
        }


def test_cors_allows_localhost_vite_origin() -> None:
    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_cors_allows_cloud_run_domain() -> None:
    cloud_run_origin = "https://canopycrew-frontend-abc123-rj.a.run.app"
    response = client.options(
        "/health",
        headers={
            "Origin": cloud_run_origin,
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == cloud_run_origin


def test_cors_rejects_untrusted_origin() -> None:
    response = client.options(
        "/health",
        headers={
            "Origin": "http://untrusted.example.com",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert "access-control-allow-origin" not in response.headers


def test_settings_masks_api_key_and_ignores_extra_env(monkeypatch) -> None:
    monkeypatch.setenv("NVIDIA_API_KEY", "test-placeholder-value")
    monkeypatch.setenv("PORT", "8080")
    monkeypatch.setenv("CORS_ORIGINS", "https://canopycrew.org")
    monkeypatch.setenv("VITE_API_BASE_URL", "http://localhost:8000/api/v1")

    cfg = Settings(_env_file=None)
    assert cfg.api_port == 8080
    assert "http://localhost:5173" in cfg.cors_origins
    assert "https://canopycrew.org" in cfg.cors_origins
    assert cfg.nvidia_api_key is not None
    assert "test-placeholder-value" not in repr(cfg)

