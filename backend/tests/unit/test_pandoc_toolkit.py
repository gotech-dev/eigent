import os
import pytest
from unittest.mock import MagicMock, patch

# Pre-import modules to ensure we patch the loaded instances
import app.utils.listen.toolkit_listen as toolkit_listen_module
import app.service.task as task_service_module
import app.utils.toolkit.pandoc_toolkit as pandoc_toolkit_module
from app.utils.toolkit.pandoc_toolkit import PandocToolkit

@pytest.fixture
def mock_pandoc_toolkit():
    # Create a mock TaskLock
    mock_lock = MagicMock()
    
    # Patch the task_locks dictionary to include our test task ID
    # Use patch.dict on the module's dictionary
    with patch.dict(task_service_module.task_locks, {"test_task_id": mock_lock}), \
         patch.object(task_service_module, "process_task") as mock_process_task, \
         patch.object(pandoc_toolkit_module, "_safe_put_queue"):
        
        # Setup process_task mock
        mock_process_task.get.return_value = "process_id"
        
        toolkit = PandocToolkit(api_task_id="test_task_id", working_directory="/tmp")
        yield toolkit


def test_resolve_filepath(mock_pandoc_toolkit):
    # Test absolute path
    abs_path = "/tmp/test.docx"
    assert mock_pandoc_toolkit._resolve_filepath(abs_path) == abs_path
    
    # Test relative path
    rel_path = "test.docx"
    assert mock_pandoc_toolkit._resolve_filepath(rel_path) == "/tmp/test.docx"

@patch("subprocess.run")
def test_convert_text_to_docx_success(mock_subprocess, mock_pandoc_toolkit):
    # Setup mock success return
    mock_subprocess.return_value = MagicMock(returncode=0, stderr="")
    
    content = "# Hello World"
    filename = "output.docx"
    
    result = mock_pandoc_toolkit.convert_text_to_docx(content, filename)
    
    assert "Successfully created document" in result
    assert result.endswith("/tmp/output.docx")
    
    # Verify subprocess call
    args, kwargs = mock_subprocess.call_args
    # cmd should look like ['pandoc', '/tmp/temp_input_....md', '-o', '/tmp/output.docx']
    cmd = args[0]
    assert cmd[0] == "pandoc"
    assert cmd[2] == "-o"
    assert cmd[3] == "/tmp/output.docx"

@patch("subprocess.run")
def test_convert_text_to_docx_with_reference(mock_subprocess, mock_pandoc_toolkit):
    mock_subprocess.return_value = MagicMock(returncode=0, stderr="")
    
    content = "# Hello Template"
    filename = "template_out.docx"
    ref_path = "/tmp/template.docx"
    
    # Needs to exist check to pass
    with patch("os.path.exists", return_value=True): 
        result = mock_pandoc_toolkit.convert_text_to_docx(content, filename, reference_doc_path=ref_path)
    
    assert "Successfully created document" in result
    
    args, kwargs = mock_subprocess.call_args
    cmd = args[0]
    assert f"--reference-doc={ref_path}" in cmd

@patch("subprocess.run")
def test_convert_text_to_docx_failure(mock_subprocess, mock_pandoc_toolkit):
    # Setup mock failure
    mock_subprocess.return_value = MagicMock(returncode=1, stderr="Pandoc error")
    
    content = "# Fail"
    filename = "fail.docx"
    
    result = mock_pandoc_toolkit.convert_text_to_docx(content, filename)
    
    assert "Error running pandoc" in result
    assert "Pandoc error" in result
@patch("subprocess.run")
def test_convert_text_to_docx_with_extra_args(mock_subprocess, mock_pandoc_toolkit):
    mock_subprocess.return_value = MagicMock(returncode=0, stderr="")
    
    content = "# Extra Args"
    filename = "extra.docx"
    extra = ["--toc", "--number-sections"]
    
    result = mock_pandoc_toolkit.convert_text_to_docx(content, filename, extra_args=extra)
    
    assert "Successfully created document" in result
    
    args, kwargs = mock_subprocess.call_args
    cmd = args[0]
    assert "--toc" in cmd
    assert "--number-sections" in cmd

@patch("app.utils.toolkit.standardize_styles.standardize_reference_styles")
def test_standardize_reference_success(mock_standardize, mock_pandoc_toolkit):
    ref_path = "/tmp/ref.docx"
    out_path = "/tmp/ref_standard.docx"
    
    result = mock_pandoc_toolkit.standardize_reference(ref_path, out_path)
    
    assert result == out_path
    mock_standardize.assert_called_once_with(ref_path, out_path)

@patch("app.utils.toolkit.standardize_styles.standardize_reference_styles")
def test_standardize_reference_default_path(mock_standardize, mock_pandoc_toolkit):
    ref_path = "/tmp/ref.docx"
    # Logic is: name, ext = splitext -> name + "_standard" + ext
    expected_out = "/tmp/ref_standard.docx"
    
    result = mock_pandoc_toolkit.standardize_reference(ref_path)
    
    assert result == expected_out
    mock_standardize.assert_called_once_with(ref_path, expected_out)
