import os
import pandas
import shutil
import argparse

from jinja2 import FileSystemLoader, Environment, select_autoescape


THIS_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_PATH = os.path.join(THIS_DIR, "templates")
SITE_PATH = os.path.join(TEMPLATE_PATH, "site")
CSV_PATH = os.path.join(THIS_DIR, "csv")
DICTIONARY_DIR = "dictionary"

def readKeywordCSV():
    keywordDF = pandas.DataFrame()
    fileList = os.listdir(CSV_PATH)

    for csvFile in fileList:
        if(os.path.isfile(os.path.join(CSV_PATH, csvFile))):
            keywordDF = pandas.read_csv(os.path.join(CSV_PATH, csvFile))

    return keywordDF


def getVariableList(DF):

    variable = DF['Variable']
    variableList = variable.tolist()
    return variableList

def getStandardNameList(DF):
    splitStandardNameList = []
    standardNameDF = DF["Standard name"]
    standardNameList = standardNameDF.tolist()

    for name in standardNameList:
        nameArray = name.split("_")

        for word in range(len(nameArray)):
            splitStandardNameList.append(nameArray[word])

    return splitStandardNameList

def getVariableLongNameList(DF):
    splitLongNameList = []
    longNameDF = DF['Long name']
    longNameList = longNameDF.tolist()

    for name in longNameList:
        nameArray = name.split(" ")

        for word in range(len(nameArray)):
            splitLongNameList.append(nameArray[word])

    return splitLongNameList

def createDictionaryFile(custom_dictionary_name, variableList):
    listLength = len(variableList)
    custom_dictionary_directory = custom_dictionary_name
    dictionary_name = custom_dictionary_name + ".dic"

    try:
        os.mkdir(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR,custom_dictionary_directory))
        with open(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR, custom_dictionary_directory, dictionary_name), "w") as f:
            f.write(f"{str(listLength)}\n")
            f.close()

        with open(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR, custom_dictionary_directory, dictionary_name), "a") as f:
            for variable in variableList:
                f.write(f"{variable}\n")
    except FileExistsError:

        with open(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR,custom_dictionary_directory, dictionary_name), "w") as f:
            f.write(f"{str(listLength)}\n")
            f.close()

        with open(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR, custom_dictionary_directory, dictionary_name), "a") as f:
            for variable in variableList:
                f.write(f"{variable}\n")

        f.close()

def createAffixFile(custom_dictionary_name, variableList):
    encoding = "UTF-8"
    custom_dictionary_directory = custom_dictionary_name
    dictionary_affix_name = custom_dictionary_directory + ".aff"
    if(len(variableList) < 100000):
        try:
            os.mkdir(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR, custom_dictionary_directory))

            with open(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR, custom_dictionary_directory, dictionary_affix_name ), "w") as f:
                f.write("SET " + encoding)
                f.close()
        except FileExistsError:
            with open(os.path.join(TEMPLATE_PATH, DICTIONARY_DIR, custom_dictionary_directory, dictionary_affix_name ), "w") as f:
                f.write("SET " + encoding)
                f.close()



def buildDictionary(custom_dictionary_name):
    dataframe = readKeywordCSV()
    longNameList = getVariableLongNameList(dataframe)
    testList = longNameList[0:9]

    createAffixFile(custom_dictionary_name, testList)
    createDictionaryFile(custom_dictionary_name, testList)


def filter_site_templates(template, extensions=("js", "html")):
    abs_filepath = os.path.join(TEMPLATE_PATH, template)
    basename = os.path.basename(template)
    return (SITE_PATH == os.path.commonpath((abs_filepath, SITE_PATH)) and
            "." in basename and
            basename.rsplit(".", 1)[1] in extensions)


def build(build_directory, custom_dictionary_name, clean=True):
    DICTIONARY_TEMPLATE_PATH = os.path.join(TEMPLATE_PATH, DICTIONARY_DIR, custom_dictionary_name)

    buildDictionary(custom_dictionary_name)

    if clean:
        shutil.rmtree(build_directory, ignore_errors=True)
    env = Environment(
        loader=FileSystemLoader(TEMPLATE_PATH), autoescape=select_autoescape(enabled_extensions=("html", "js", "css", "dic", "aff"))
    )

    shutil.copytree(os.path.join(THIS_DIR, "static"), build_directory, dirs_exist_ok=True)
    shutil.copytree(os.path.join(THIS_DIR, DICTIONARY_TEMPLATE_PATH), os.path.join(build_directory, DICTIONARY_DIR, custom_dictionary_name), dirs_exist_ok=True)

    for template in env.list_templates(filter_func=filter_site_templates):
        build_destination = os.path.join(
            build_directory, os.path.relpath(os.path.join(TEMPLATE_PATH, template), SITE_PATH)
        )
        os.makedirs(os.path.dirname(build_destination), exist_ok=True)
        with open(build_destination, "w") as f:
            f.write(env.get_template(template).render(custom_typojs_dictionary = custom_dictionary_name))



if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-b",
        "--build-directory",
        default=os.path.join(THIS_DIR, "build"),
        help="location on disk to write built templates to.",
    )

    parser.add_argument(
        "-d",
        "--custom-dictionary-name",
        default="stac_dictionary",
        help="name of dictionary.",
    )

    parser.add_argument(
        "-c",
        "--clean",
        action="store_true",
        help="clean build directories before building.",
    )
    args = parser.parse_args()
    build(args.build_directory, args.custom_dictionary_name, args.clean)