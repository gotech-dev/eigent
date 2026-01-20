import sys
from unittest.mock import MagicMock, patch, mock_open

# Mock the missing 'utils' module which seems to be environment-specific
# This must be done BEFORE importing app modules that depend on it
mock_utils = MagicMock()
mock_traceroot = MagicMock()
mock_traceroot.trace = lambda: lambda x: x  # Mock the @trace decorator
mock_traceroot.get_logger.return_value = MagicMock() # Mock logger
mock_utils.traceroot_wrapper = mock_traceroot
sys.modules["utils"] = mock_utils
sys.modules["utils.traceroot_wrapper"] = mock_traceroot

import os
import pytest

# Pre-import modules to ensure we patch the loaded instances
import app.utils.toolkit.file_write_toolkit as file_write_toolkit_module
import app.utils.toolkit.pandoc_toolkit as pandoc_toolkit_module
from app.utils.toolkit.file_write_toolkit import FileToolkit
from app.utils.toolkit.pandoc_toolkit import PandocToolkit
import app.service.task as task_service_module

@pytest.fixture
def mock_task_context():
    # Common mock setup for both toolkits
    mock_lock = MagicMock()
    with patch.dict(task_service_module.task_locks, {"test_task_id": mock_lock}), \
         patch.object(task_service_module, "process_task") as mock_process_task:
        
        mock_process_task.get.return_value = "process_id"
        yield mock_lock

def test_file_toolkit_append(mock_task_context):
    with patch.object(file_write_toolkit_module, "_safe_put_queue") as mock_put_queue:
         
        # Mock open to verify file write
        with patch("builtins.open", mock_open()) as mock_file:
            toolkit = FileToolkit(api_task_id="test_task_id", working_directory="/tmp")
            
            result = toolkit.append_to_file(
                title="Test Title",
                content="New Content",
                filename="test.md"
            )
            
            assert "Content successfully appended" in result
            
            # Verify file handle
            mock_file.assert_called_with("/tmp/test.md", "a", encoding="utf-8")
            mock_file().write.assert_called_with("New Content")
        
        assert "Content successfully appended" in result
        
        # Verify UI notification
        mock_put_queue.assert_called_once()
        args = mock_put_queue.call_args[0]
        # args[1] should be ActionWriteFileData
        assert "/tmp/test.md" in args[1].data

@patch("subprocess.run")
def test_pandoc_toolkit_convert_file(mock_subprocess, mock_task_context):
    with patch.object(pandoc_toolkit_module, "_safe_put_queue") as mock_put_queue, \
         patch("app.utils.toolkit.pandoc_toolkit.os.path.exists") as mock_exists:
        
        # Setup mock exists to return True for input file
        mock_exists.return_value = True
        mock_subprocess.return_value = MagicMock(returncode=0, stderr="")
        
        toolkit = PandocToolkit(api_task_id="test_task_id", working_directory="/tmp")
        
        result = toolkit.convert_file_to_docx(
            input_filename="input.md",
            output_filename="output.docx"
        )
        
        assert "Successfully created document" in result
        
        # Verify subprocess call
        call_args = mock_subprocess.call_args[0][0]
        assert call_args[0] == "pandoc"
        assert "/tmp/input.md" in call_args
        assert "/tmp/output.docx" in call_args
        
        # Verify UI notification
        mock_put_queue.assert_called_once()
        assert "/tmp/output.docx" in mock_put_queue.call_args[0][1].data

def test_file_toolkit_merge(mock_task_context):
    with patch.object(file_write_toolkit_module, "_safe_put_queue") as mock_put_queue:
        
        # Simpler mock strategy: just verify logic flow
        # We can mock os.path.join to return simple names
        # And mock open to return a mock that has read/write
        
        mock_file_handle = MagicMock()
        mock_file_handle.read.return_value = "FileContent"
        mock_file_handle.__enter__.return_value = mock_file_handle
        
        with patch("builtins.open", return_value=mock_file_handle) as mock_open_func, \
             patch("os.path.exists", return_value=True):
            
            toolkit = FileToolkit(api_task_id="test_task_id", working_directory="/tmp")
            
            result = toolkit.merge_files(
                input_files=["part1.md", "part2.md"],
                output_filename="merged.md",
                separator="\n---\n"
            )
            
            assert "Successfully merged 2 files" in result
            
            # Verify we wrote content from inputs
            # 2 reads (one for each input) -> 2 writes of content
            # 1 separator write
            # Total 3 writes to output file
            assert mock_file_handle.write.call_count >= 3
            mock_file_handle.write.assert_any_call("FileContent")
            mock_file_handle.write.assert_any_call("\n---\n")


