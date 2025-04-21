import os
import subprocess
import unicodedata
from jinja2 import Environment, FileSystemLoader

TEMPLATE_DIR = "templates"
OUTPUT_DIR = "generated"

os.makedirs(OUTPUT_DIR, exist_ok=True)

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

# ✅ Strip weird Unicode combining marks (like \u0300)
def sanitize_unicode(text: str) -> str:
    return unicodedata.normalize("NFKD", text).encode("utf-8", "ignore").decode("utf-8")


def render_latex(template_name: str, data: dict, output_filename: str) -> str:
    tex_file = os.path.join(OUTPUT_DIR, f"{output_filename}.tex")
    pdf_file = os.path.join(OUTPUT_DIR, f"{output_filename}.pdf")

    # Render LaTeX from Jinja2
    template = env.get_template(template_name)
    rendered = template.render(data)

    # ✅ Sanitize the content (fixes charmap and LaTeX crashes)
    rendered = sanitize_unicode(rendered)

    # ✅ Write .tex file with UTF-8 encoding
    with open(tex_file, "w", encoding="utf-8") as f:
        f.write(rendered)

    # ✅ Compile LaTeX to PDF using pdflatex
    try:
        subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", "-output-directory", OUTPUT_DIR, tex_file],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as e:
        log_path = os.path.join(OUTPUT_DIR, f"{output_filename}.log")
        with open(log_path, "w", encoding="utf-8") as log:
            log.write(e.stdout.decode("utf-8", errors="ignore"))
        raise RuntimeError("LaTeX failed. Check log file for details.")

    return pdf_file
