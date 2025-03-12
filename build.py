import os
import shutil
import argparse

THIS_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_PATH = os.path.join(THIS_DIR, "templates")
SITE_PATH = os.path.join(TEMPLATE_PATH, "site")
CSV_PATH = os.path.join(THIS_DIR, "csv")

def filter_site_templates(template, extensions=("js", "html")):
    abs_filepath = os.path.join(TEMPLATE_PATH, template)
    basename = os.path.basename(template)
    return (SITE_PATH == os.path.commonpath((abs_filepath, SITE_PATH)) and
            "." in basename and
            basename.rsplit(".", 1)[1] in extensions)


def build(build_directory, stac_catalog_url, map_default_latitude, map_default_longitude, map_default_zoom, clean=True):

    if clean:
        shutil.rmtree(build_directory, ignore_errors=True)
    env = Environment(
        loader=FileSystemLoader(TEMPLATE_PATH), autoescape=select_autoescape(enabled_extensions=("html", "js", "css"))
    )

    shutil.copytree(os.path.join(THIS_DIR, "static"), build_directory, dirs_exist_ok=True)

    for template in env.list_templates(filter_func=filter_site_templates):
        build_destination = os.path.join(
            build_directory, os.path.relpath(os.path.join(TEMPLATE_PATH, template), SITE_PATH)
        )
        os.makedirs(os.path.dirname(build_destination), exist_ok=True)
        with open(build_destination, "w") as f:

            f.write(env.get_template(template).render(stac_catalog_url = stac_catalog_url,
                                                      map_default_lat = map_default_latitude,
                                                      map_default_lng = map_default_longitude,
                                                      map_default_zoom = map_default_zoom))



if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-b",
        "--build-directory",
        default=os.path.join(THIS_DIR, "build"),
        help="location on disk to write built templates to.",
    )

    parser.add_argument(
        "-u",
        "--stac-catalog-url",
        default="https://redoak.cs.toronto.edu/stac", #Keep for now. URL should not be U of T specific
        help="url of stac catalog on the node",
    )

    parser.add_argument(
        "-lat",
        "--map-default-latitude",
        type = float,
        default=43.1249,
        help="default latitude on leaflet map.",
    )

    parser.add_argument(
        "-lng",
        "--map-default-longitude",
        type=float,
        default=1.254,
        help="default longitude on leaflet map.",
    )

    parser.add_argument(
        "-z",
        "--map-default-zoom",
        type=int,
        default=2,
        help="default zoom level on leaflet map.",
    )

    parser.add_argument(
        "-c",
        "--clean",
        action="store_true",
        help="clean build directories before building.",
    )
    args = parser.parse_args()

    build(args.build_directory, args.stac_catalog_url, args.map_default_latitude, args.map_default_longitude, args.map_default_zoom, args.clean)