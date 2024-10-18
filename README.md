# stac-ui-tools
Tools to build things for STAC search UI componenets

# Creating Custom Dictionaries

A dictionary requires two files an `"affix"` file (`.aff`) and a word list file (`.dic`).  The affix file is a list of 
prefixes and suffixes a word can have.  For example, "supply" can have the suffix "ied" when dropping the "y" to make "supplied".
An affix file is not needed for dictionaries of 100,000 words or less.

The word list file is a list of words separated by a newline character.

As there isn't that much information online for creating these files, they are saved as pdfs in this repository:
[Creating .aff file](documentation/hunspell-dictionary/create-aff-file.pdf)
[Creating a .dic file](documentation/hunspell-dictionary/creating-a-hunspell-dictionary-file.pdf)