import os
import subprocess
from typing import Optional
from camel.toolkits import FunctionTool
from app.component.environment import env
from app.service.task import ActionWriteFileData, Agents, get_task_lock, process_task
from app.utils.listen.toolkit_listen import _safe_put_queue, auto_listen_toolkit, listen_toolkit
from app.utils.toolkit.abstract_toolkit import AbstractToolkit

class PandocToolkit(AbstractToolkit):
    agent_name: str = Agents.document_agent

    def __init__(
        self,
        api_task_id: str,
        working_directory: str | None = None,
        timeout: float | None = None,
    ) -> None:
        self.api_task_id = api_task_id
        if working_directory is None:
            working_directory = env("file_save_path", os.path.expanduser("~/Downloads"))
        self.working_directory = working_directory
        self.timeout = timeout
        # super().__init__(working_directory, timeout) logic removed as AbstractToolkit has no init

    def _resolve_filepath(self, filename: str) -> str:
        if os.path.isabs(filename):
            return filename
        return os.path.join(self.working_directory, filename)


    @listen_toolkit(
        inputs=lambda _, content, filename, reference_doc_path=None: f"convert text to docx: {filename}, ref: {reference_doc_path}"
    )
    def convert_text_to_docx(
        self,
        content: str,
        filename: str,
        reference_doc_path: Optional[str] = None
    ) -> str:
        """
        Converts Markdown text content to a DOCX file using Pandoc.
        Optionally uses a reference DOCX file for style transfer.

        Args:
            content (str): The Markdown content to convert.
            filename (str): The name of the output DOCX file (e.g., 'output.docx').
            reference_doc_path (str, optional): Absolute path to a reference .docx file to copy styles from.

        Returns:
            str: The absolute path of the generated DOCX file.
        """
        if not filename.lower().endswith(".docx"):
            filename += ".docx"

        output_path = self._resolve_filepath(filename)
        
        # Create a temporary input file for pandoc
        input_filename = f"temp_input_{os.urandom(4).hex()}.md"
        input_path = self._resolve_filepath(input_filename)

        try:
            with open(input_path, 'w', encoding='utf-8') as f:
                f.write(content)

            cmd = ["pandoc", input_path, "-o", output_path]
            
            if reference_doc_path:
                # Ensure reference path is absolute or resolve it if relative
                if not os.path.isabs(reference_doc_path):
                     reference_doc_path = self._resolve_filepath(reference_doc_path)
                
                if os.path.exists(reference_doc_path):
                    cmd.append(f"--reference-doc={reference_doc_path}")
                else:
                    return f"Error: Reference document not found at {reference_doc_path}"

            # Execute pandoc
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=False  # We handle return code manually
            )

            if process.returncode != 0:
                return f"Error running pandoc: {process.stderr}"

            # Notify UI about file creation
            task_lock = get_task_lock(self.api_task_id)
            current_process_task_id = process_task.get("")
            _safe_put_queue(
                task_lock,
                ActionWriteFileData(process_task_id=current_process_task_id, data=str(output_path))
            )

            return f"Successfully created document at: {output_path}"

        except Exception as e:
            return f"Exception during conversion: {str(e)}"
        finally:
            # Cleanup temp file
            if os.path.exists(input_path):
                os.remove(input_path)

    def get_tools(self) -> list[FunctionTool]:
        return [
            FunctionTool(self.convert_text_to_docx),
            FunctionTool(self.convert_file_to_docx),
        ]

    @listen_toolkit(
        inputs=lambda _, input_filename, output_filename, reference_doc_path=None: f"convert file to docx: {input_filename} -> {output_filename}, ref: {reference_doc_path}"
    )
    def convert_file_to_docx(
        self,
        input_filename: str,
        output_filename: str,
        reference_doc_path: Optional[str] = None
    ) -> str:
        """
        Converts an existing Markdown file to a DOCX file using Pandoc.
        Optionally uses a reference DOCX file for style transfer.

        Args:
            input_filename (str): The name of the input Markdown file (e.g., 'input.md').
            output_filename (str): The name of the output DOCX file (e.g., 'output.docx').
            reference_doc_path (str, optional): Absolute path to a reference .docx file to copy styles from.

        Returns:
            str: The absolute path of the generated DOCX file.
        """
        if not output_filename.lower().endswith(".docx"):
            output_filename += ".docx"

        input_path = self._resolve_filepath(input_filename)
        output_path = self._resolve_filepath(output_filename)

        if not os.path.exists(input_path):
            return f"Error: Input file not found at {input_path}"

        cmd = ["pandoc", input_path, "-o", output_path]
        
        if reference_doc_path:
            # Ensure reference path is absolute or resolve it if relative
            if not os.path.isabs(reference_doc_path):
                    reference_doc_path = self._resolve_filepath(reference_doc_path)
            
            if os.path.exists(reference_doc_path):
                cmd.append(f"--reference-doc={reference_doc_path}")
            else:
                return f"Error: Reference document not found at {reference_doc_path}"

        try:
            # Execute pandoc
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=False
            )

            if process.returncode != 0:
                return f"Error running pandoc: {process.stderr}"

            # Notify UI about file creation
            task_lock = get_task_lock(self.api_task_id)
            current_process_task_id = process_task.get("")
            _safe_put_queue(
                task_lock,
                ActionWriteFileData(process_task_id=current_process_task_id, data=str(output_path))
            )

            return f"Successfully created document at: {output_path}"

        except Exception as e:
            return f"Exception during conversion: {str(e)}"
