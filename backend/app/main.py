from fastapi import FastAPI

app = FastAPI(
    title="CanopyCrew API",
    version="0.1.0",
    description="Backend API for the CanopyCrew urban greening platform."
)


@app.get("/")
def root():
    return {
        "message": "Welcome to CanopyCrew API 🌱"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "app": "CanopyCrew API"
    }
