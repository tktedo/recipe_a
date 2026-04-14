from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@db:5432/memos"

    class Config:
        env_file = ".env"


settings = Settings()
