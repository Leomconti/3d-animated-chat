from contextlib import asynccontextmanager
from typing import Literal, Union

import instructor
from app.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from pydantic import BaseModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

instructor_tools = instructor.from_openai(AsyncOpenAI(api_key=settings.openai_api_key))


class MessageRequest(BaseModel):
    message: str
    animations: list[str]


@app.post("/chat")
async def chat(message_request: MessageRequest):
    result = await call_llm(message_request)
    return result


def create_animation_model(animations: list[str]):
    animations_literal = Literal[tuple(animations)]  # type: ignore

    class AnimationAndMessage(BaseModel):
        animation_name: animations_literal  # type: ignore
        message: str

    return AnimationAndMessage


async def call_llm(message_request: MessageRequest) -> Union[dict, BaseModel]:
    print(message_request)

    AnimationAndMessage = create_animation_model(message_request.animations)

    result = await instructor_tools.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an AI character in a game. You are given a message from the user and a list of animations. Return the animation that best fits the conversation as a reaction for you to send to the user. And continue the conversation with the user",
            },
            {"role": "user", "content": message_request.message},
        ],
        response_model=AnimationAndMessage,
    )

    return result
