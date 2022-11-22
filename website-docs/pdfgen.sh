#!/bin/bash
# This script creates a PDF format document ffrom the markdown files.
# The individual sections are organized into separate files,
# so this script provides helper functions to add chapter ans section-level titles
# and to merge the converted files into a single latex temporary file, that is finally converted to pdf.
#
# The script uses the following tools:
# - Pandoc: https://pandoc.org/
# - Eisvogel pandoc latex template: https://github.com/Wandmalfarbe/pandoc-latex-template
# - sed stream editor: https://www.gnu.org/software/sed/manual/sed.html
# - LaTex [pdfTeX 3.141592653-2.6-1.40.22 (TeX Live 2022/dev/Debian)]:
#   https://linuxconfig.org/how-to-install-latex-on-ubuntu-22-04-jammy-jellyfish-linux 

# Create a PDF format single title page
pandoc --to=latex -o title.pdf --template eisvogel --listings  <(echo "
---
title: "Easer"
author: [Tamás Benke]
date: "2022-11-21"
subject: "Markdown"
keywords: [easer,http,web-server,mocking,mats,messaging,rest,api,gateway]
subtitle: "User\'s Manual"
lang: "en"
titlepage: true
...
")

# Helper function to append a Chapter-level title to the latex format document
chapter () {
pandoc -f markdown -t latex <(echo "
# $1

") >> tmp.latex
}

# Helper function to append a Section-level title and the section content from a markdown file to the latex format document
# Put the required replace patterns into the `pdfgen.sed` file if needed.
# NOTE: The sed commands have effect only to the stdout, and do not overwrite the original file. 
Section () {
pandoc -f markdown -t latex <(echo "
## $1

") >> tmp.latex
sed -f pdfgen.sed $2 | pandoc --to=latex --base-header-level 2  >> tmp.latex
}

# Convert the individual markdown pages to LaTex format, then merge them into a single latex file
#pandoc -f markdown -t latex <(echo "
## Getting Started
#
#") >> tmp.latex

chapter "Getting Started"
Section "Overview" "overview.md"
Section "Installation" "installation.md"
Section "Basic Operations" "basic-operations.md"

chapter "Guides"
Section "Configuration" "configuration.md"
Section "REST API Specification" "rest-api-specification.md"
Section "Static Web Server" "static-webserver-mode.md"
Section "REST API / NATS Gateway" "rest-api-nats-gw-mode.md"
Section "Mock Server" "mock-server-mode.md"
Section "Websocket / NATS Gateway" "websocket-nats-gw-mode.md"
Section "Easer Internals" "easer-internals.md"


# Convert the merged latex format document to PDF format
pandoc tmp.latex -o tmp.pdf --standalone --toc --number-sections --template eisvogel #--listings

# Merge thew title page, and the content pages into one PDF
gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=easer_users_manual.pdf title.pdf tmp.pdf

# Clean up the temporary files
rm tmp.latex
rm tmp.log
rm title.pdf
rm tmp.pdf
