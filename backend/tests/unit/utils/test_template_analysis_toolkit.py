import os
import pytest
import sys
from unittest.mock import MagicMock, patch, mock_open

# Add project root to sys.path to resolve 'utils' import
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../")))

from app.utils.toolkit.template_analysis_toolkit import TemplateAnalysisToolkit

# Mock pypdf for testing
class MockPage:
    def extract_text(self):
        return "Page content"

class MockPdfReader:
    def __init__(self, stream):
        self.pages = [MockPage(), MockPage()]

class TestTemplateAnalysisToolkit:
    @pytest.fixture(autouse=True)
    def mock_task_lock(self):
        with patch("app.utils.listen.toolkit_listen.get_task_lock") as mock_get_lock:
            mock_lock = MagicMock()
            mock_get_lock.return_value = mock_lock
            yield mock_lock

    @pytest.fixture
    def toolkit(self):
        return TemplateAnalysisToolkit(api_task_id="test-task")

    def test_analyze_markdown_structure(self, toolkit):
        markdown_content = """
# Title
## Section 1
Content here.
### Subsection 1.1
More content.
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Data 1   |
| Row 2    | Data 2   |

## Section 2
Final content.
"""
        with patch("builtins.open", mock_open(read_data=markdown_content)):
            with patch("os.path.exists", return_value=True):
                result = toolkit.analyze_document_structure("/path/to/test.md")
        
        assert "## Sections and Headings" in result
        assert "- **[Level 1]** Title" in result
        assert "- **[Level 2]** Section 1" in result
        assert "- **[Level 3]** Subsection 1.1" in result
        assert "## Table Structures" not in result # Based on current implementation, tables are listed under Table structures if explicitly implemented in summary or inline? 
        # Checking implementation: it adds "### Table 1" inline or at end?
        # Let's check the code: It adds "### Table {count}" to the outline list.
        assert "### Table 1" in result
        assert "- **Rows:** ~2" in result

    def test_analyze_text_structure_heuristics(self, toolkit):
        text_content = """
I. INTRODUCTION
This is the intro.

1. Background
Details about background.

2. Objectives
Our goals.

II. IMPLEMENTATION
A. Phase 1
Doing things.
"""
        with patch("builtins.open", mock_open(read_data=text_content)):
            with patch("os.path.exists", return_value=True):
                result = toolkit.analyze_document_structure("/path/to/test.txt")
        
        assert "## Detected Sections (Heuristic)" in result
        assert "- **[Level 1]** I. INTRODUCTION" in result
        assert "- **[Level 2]** 1. Background" in result
        assert "- **[Level 2]** A. Phase 1" in result # Heuristic might map A. to level 1 or 2 depending on regex

    def test_analyze_style_formal(self, toolkit):
        formal_content = """
Căn cứ vào quy định hiện hành, chúng tôi xin trình bày phương án này.
Mục đích của dự án nhằm mục đích tối ưu hóa quy trình.
Việc triển khai được thực hiện cẩn trọng.
Therefore, we propose this solution.
"""
        with patch("builtins.open", mock_open(read_data=formal_content)):
            with patch("os.path.exists", return_value=True):
                result = toolkit.analyze_writing_style("/path/to/formal.txt")
        
        assert "## Formality Level" in result
        assert "Trang trọng" in result or "Formal" in result

    def test_analyze_style_casual(self, toolkit):
        casual_content = """
Mình thấy cái này cũng ổn đấy.
Bạn có thể làm thế này nhé.
Việc này ok thôi.
Gonna do this stuff later.
"""
        with patch("builtins.open", mock_open(read_data=casual_content)):
            with patch("os.path.exists", return_value=True):
                result = toolkit.analyze_writing_style("/path/to/casual.txt")
        
        assert "## Formality Level" in result
        assert "Thân mật" in result or "Casual" in result

    def test_unexpected_file_extension_structure(self, toolkit):
        with patch("os.path.exists", return_value=True):
            result = toolkit.analyze_document_structure("/path/to/image.png")
        assert "Unsupported file format" in result

    def test_unexpected_file_extension_style(self, toolkit):
        with patch("os.path.exists", return_value=True):
            result = toolkit.analyze_writing_style("/path/to/image.png")
        assert "Unsupported file format" in result

    @patch("docx.Document")
    def test_analyze_docx_structure(self, mock_document_class, toolkit):
        # Mock Document object
        mock_doc = MagicMock()
        mock_document_class.return_value = mock_doc
        
        # Mock Paragraphs
        p1 = MagicMock(); p1.text = "Title"; p1.style.name = "Heading 1"
        p2 = MagicMock(); p2.text = "Introduction"; p2.style.name = "Heading 2"
        p3 = MagicMock(); p3.text = "Details"; p3.style.name = "Normal"; p3.runs = [MagicMock(bold=True)]
        mock_doc.paragraphs = [p1, p2, p3]
        
        # Mock Tables
        t1 = MagicMock()
        t1.rows = [MagicMock(), MagicMock()] # 2 rows
        t1.columns = [MagicMock(), MagicMock(), MagicMock()] # 3 cols
        t1.rows[0].cells = [MagicMock(text="Col1"), MagicMock(text="Col2"), MagicMock(text="Col3")]
        mock_doc.tables = [t1]

        with patch("os.path.exists", return_value=True):
            result = toolkit.analyze_document_structure("/path/to/doc.docx")

        assert "## Sections and Headings" in result
        assert "- **[Level 1]** Title" in result
        assert "- **[Level 2]** Introduction" in result
        assert "## Table Structures" in result
        assert "- **Rows:** 2" in result
        assert "- **Columns:** 3" in result

    @patch("pypdf.PdfReader")
    def test_analyze_pdf(self, mock_pdf_reader, toolkit):
        # Setup mock
        mock_pdf_reader.return_value = MockPdfReader(None)
        
        with patch("os.path.exists", return_value=True):
            result = toolkit.analyze_document_structure("/path/to/doc.pdf")
            
        assert "# Document Structure Analysis (PDF)" in result
        assert "**Pages:** 2" in result
        assert "## Detected Sections (Heuristic)" in result
