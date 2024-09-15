import typing as t

from pydantic import BaseModel, Field


class CodeFile(BaseModel):
    filename: str
    code_str: str


class Project(BaseModel):
    goal: str
    code_files: t.List[CodeFile]
