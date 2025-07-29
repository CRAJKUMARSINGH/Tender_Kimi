from fastapi import FastAPI

app = FastAPI(title="Tender Kimi Backend", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "Welcome to Tender Kimi FastAPI Backend"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
