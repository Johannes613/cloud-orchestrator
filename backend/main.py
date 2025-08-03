from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/apps/{app_id}")
def read_app(app_id: int):
    return {"app_id": app_id}
