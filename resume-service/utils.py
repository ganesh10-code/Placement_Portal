import os
import subprocess
from jinja2 import Environment, FileSystemLoader

TEMPLATE_DIR = "templates"
OUTPUT_DIR = "generated"

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def render_latex(template_name: str, data: dict, output_filename: str) -> str:
    tex_file = os.path.join(OUTPUT_DIR, f"{output_filename}.tex")
    pdf_file = os.path.join(OUTPUT_DIR, f"{output_filename}.pdf")

    # Render LaTeX
    template = env.get_template(template_name)
    rendered = template.render(data)

    # Write .tex file
    with open(tex_file, "w") as f:
        f.write(rendered)

    # Compile PDF using pdflatex
    try:
        subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", "-output-directory", OUTPUT_DIR, tex_file],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as e:
        with open(f"{OUTPUT_DIR}/{output_filename}.log", "w") as log:
            log.write(e.stdout.decode())
        raise RuntimeError("LaTeX failed. Check log.")


    return pdf_file
