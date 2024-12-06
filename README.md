# stac-search-ui
New user interface for STAC search




# Development

UI components can be seen at `http://localhost:8000/sample.html`

1. Install the requirements.
Go to the root directory of the project and run the following command

```
python3 -m pip install -r requirements.txt
```

2. Build the project with the following command:

```
python3 build.py
```
The files will be moved to the `build` directory.


3.  Go to the `build` directory and start the webserver

```
python3 -m http.server
```

4.  Go to `http://localhost:8000/sample.html` in a web browser.
