# replacerrr

To read template file, find and replace programmaticaly by csv, and output file for every row at csv.

> replacerrr(with 3 r) named like that because this program do bulk find and replace.
  Read 1 template file, find and replaces, and generate multiple output file.

## Motivation

Bismillah

We build this project to generate bunch of certificates. We need to fast and responsively.
As design never be final until given to certificate owner, our design is improve
fast and constantly. We won't use our time to generate certificates by hand.
This project is a solution for us. Hope this may help you too.

## How this works

It read a template file, read a csv, and output files.
This program is dead-simple, find and replace is the only it does.

The first row of csv is threated as header, the header is the find.
Any row below that is the replace. 1 row will output 1 file.
Unlimited column and row are possible.

Operation is started from top-left to end of row, then next row till end.

## How use this

Link the template and data file path at gulpfile.js to your file. Done.

There are SVGtoPDF utility. Uses Inkscape as exporter(define `INKSCAPE_EXECUTEABLE` env otherwise `inkscape` command called).
Default, this utility is on. Delete SVGtoPDF at bottom of gulpfile.js to deactivate.
