from pydantic_settings import BaseSettings


class Config(BaseSettings):
    openai_api_key: str


settings = Config()  # type: ignore
