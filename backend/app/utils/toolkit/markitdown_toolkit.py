from typing import Dict, List
from camel.toolkits import MarkItDownToolkit as BaseMarkItDownToolkit

from app.service.task import Agents
from app.utils.listen.toolkit_listen import auto_listen_toolkit
from app.utils.toolkit.abstract_toolkit import AbstractToolkit


@auto_listen_toolkit(BaseMarkItDownToolkit)
class MarkItDownToolkit(BaseMarkItDownToolkit, AbstractToolkit):
    agent_name: str = Agents.document_agent

    def __init__(self, api_task_id: str, timeout: float | None = None):
        self.api_task_id = api_task_id
    def parse_file(self, file_path: str) -> str:
        """
        Parses a file and converts it to Markdown.
        Includes automatic fallback for text-based files if MarkItDown fails.
        """
        try:
            return super().parse_file(file_path)
        except Exception as e:
            # Fallback for text-based files if MarkItDown fails (e.g., .md, .txt, .json)
            # This prevents "Unsupported file format" errors from crashing the agent
            if str(file_path).lower().endswith(('.md', '.txt', '.csv', '.json', '.py', '.xml', '.yml', '.yaml')):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        return f.read()
                except Exception as read_error:
                    # If fallback also fails, ensure we raise the original error or a meaningful one
                    raise e
            # Re-raise strictly distinct errors
            raise e
