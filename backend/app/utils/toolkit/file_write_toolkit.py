import asyncio
import os
from typing import List
from camel.toolkits import FileToolkit as BaseFileToolkit
from app.component.environment import env
from app.service.task import process_task
from app.service.task import ActionWriteFileData, Agents, get_task_lock
from app.utils.listen.toolkit_listen import auto_listen_toolkit, listen_toolkit, _safe_put_queue
from app.utils.toolkit.abstract_toolkit import AbstractToolkit


from camel.toolkits import FunctionTool

@auto_listen_toolkit(BaseFileToolkit)
class FileToolkit(BaseFileToolkit, AbstractToolkit):
    agent_name: str = Agents.document_agent

    def __init__(
        self,
        api_task_id: str,
        working_directory: str | None = None,
        timeout: float | None = None,
        default_encoding: str = "utf-8",
        backup_enabled: bool = True,
    ) -> None:
        if working_directory is None:
            working_directory = env("file_save_path", os.path.expanduser("~/Downloads"))
        super().__init__(working_directory, timeout, default_encoding, backup_enabled)
        self.root = working_directory
        self.api_task_id = api_task_id

    def get_tools(self) -> List[FunctionTool]:
        base_tools = super().get_tools()
        new_tools = [
            FunctionTool(self.append_to_file),
            FunctionTool(self.merge_files),
        ]
        return base_tools + new_tools

    @listen_toolkit(
        BaseFileToolkit.write_to_file,
        lambda _,
        title,
        content,
        filename,
        encoding=None,
        use_latex=False: f"write content to file: {filename} with encoding: {encoding} and use_latex: {use_latex}",
    )
    def write_to_file(
        self,
        title: str,
        content: str | List[List[str]],
        filename: str,
        encoding: str | None = None,
        use_latex: bool = False,
    ) -> str:
        res = super().write_to_file(title, content, filename, encoding, use_latex)
        if "Content successfully written to file: " in res:
            task_lock = get_task_lock(self.api_task_id)
            # Capture ContextVar value before creating async task
            current_process_task_id = process_task.get("")

            # Use _safe_put_queue to handle both sync and async contexts
            _safe_put_queue(
                task_lock,
                ActionWriteFileData(
                    process_task_id=current_process_task_id,
                    data=res.replace("Content successfully written to file: ", ""),
                )
            )
        return res

    @listen_toolkit(
        inputs=lambda _, title, content, filename, encoding=None: f"append content to file: {filename} with encoding: {encoding}",
    )
    def append_to_file(
        self,
        title: str,
        content: str | List[List[str]],
        filename: str,
        encoding: str | None = None,
    ) -> str:
        """
        Appends content to the specified file.
        """
        # Logic adapted from BaseFileToolkit.write_to_file but with "a" mode
        file_path = os.path.join(self.root, filename)
        
        # Determine encoding
        if encoding is None:
            encoding = self.default_encoding
            
        try:
            with open(file_path, "a", encoding=encoding) as f:
                if isinstance(content, list):
                    # Handle list of lists (like CSV data) or just list of strings
                    import csv
                    writer = csv.writer(f)
                    writer.writerows(content)
                else:
                    f.write(str(content))
                    
            res = f"Content successfully appended to file: {file_path}"
        except Exception as e:
            res = f"Error during file append: {str(e)}"

        if "Content successfully appended to file: " in res:
            task_lock = get_task_lock(self.api_task_id)
            current_process_task_id = process_task.get("")
            
            _safe_put_queue(
                task_lock,
                ActionWriteFileData(
                    process_task_id=current_process_task_id,
                    data=res.replace("Content successfully appended to file: ", ""),
                )
            )
        return res

    @listen_toolkit(
        inputs=lambda _, input_files, output_filename, separator="\n": f"merge files: {input_files} -> {output_filename}",
    )
    def merge_files(
        self,
        input_files: List[str],
        output_filename: str,
        separator: str = "\n"
    ) -> str:
        """
        Merges multiple text files into a single file.

        Args:
            input_files (List[str]): List of filenames to merge.
            output_filename (str): The filename for the requested merged string.
            separator (str): content to insert between files (default: newline).
        """
        output_path = os.path.join(self.root, output_filename)
        
        try:
            with open(output_path, "w", encoding=self.default_encoding) as out_f:
                for i, filename in enumerate(input_files):
                    file_path = os.path.join(self.root, filename)
                    if not os.path.exists(file_path):
                        return f"Error: Input file not found: {filename}"
                    
                    with open(file_path, "r", encoding=self.default_encoding) as in_f:
                        out_f.write(in_f.read())
                    
                    # Add separator if it's not the last file
                    if i < len(input_files) - 1:
                        out_f.write(separator)

            res = f"Successfully merged {len(input_files)} files into {output_path}"
        except Exception as e:
            res = f"Error merging files: {str(e)}"

        # Notify UI about the new merged file
        if "Successfully merged" in res:
             task_lock = get_task_lock(self.api_task_id)
             current_process_task_id = process_task.get("")
             _safe_put_queue(
                task_lock,
                ActionWriteFileData(
                    process_task_id=current_process_task_id,
                    data=output_path,
                )
             )
        return res
