from typing import List, Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sympy as sp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatrixRequest(BaseModel):
    matrix: List[List[Union[int, float]]]


def determinant(matrix: List[List[Union[int, float]]]):
    M = sp.Matrix(matrix)
    return M.det()


@app.post("/calcular-determinante")
def calculate_determinant(payload: MatrixRequest):
    matrix = payload.matrix

    if not matrix:
        raise HTTPException(status_code=400, detail="A matriz não pode ser vazia.")

    n = len(matrix)
    if any(len(row) != n for row in matrix):
        raise HTTPException(
            status_code=400,
            detail="A matriz precisa ser quadrada (n x n)."
        )

    det = determinant(matrix)

    return {"determinant": str(det)}
