.PHONY: examples resume check deps clean test-integration

CC = lualatex
EXAMPLES_DIR = examples
RESUME_DIR = examples/resume
CV_DIR = examples/cv
RESUME_SRCS = $(shell find $(RESUME_DIR) -name '*.tex')
CV_SRCS = $(shell find $(CV_DIR) -name '*.tex')

examples: $(foreach x, coverletter cv resume, $x.pdf)

resume.pdf: $(EXAMPLES_DIR)/resume.tex $(RESUME_SRCS)
	$(CC) -output-directory=$(EXAMPLES_DIR) $<

cv.pdf: $(EXAMPLES_DIR)/cv.tex $(CV_SRCS)
	$(CC) -output-directory=$(EXAMPLES_DIR) $<

coverletter.pdf: $(EXAMPLES_DIR)/coverletter.tex
	$(CC) -output-directory=$(EXAMPLES_DIR) $<

resume:
	cd src && xelatex resume.tex

check: resume
	@pages=$$(pdfinfo src/resume.pdf | grep -oP 'Pages:\s+\K\d+'); \
	if [ "$$pages" != "2" ]; then \
		echo "ERROR: resume is $$pages page(s), expected 2"; \
		exit 1; \
	fi; \
	echo "OK: resume is 2 pages"

# Build-compiles gate: every example document must compile to a PDF.
test-integration: examples

deps:
	./install.sh

clean:
	rm -rf $(EXAMPLES_DIR)/*.pdf src/*.pdf src/*.aux src/*.log src/*.out
