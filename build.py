import os
import pandas
import shutil
import argparse

from jinja2 import FileSystemLoader, Environment, select_autoescape


THIS_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_PATH = os.path.join(THIS_DIR, "templates")
SITE_PATH = os.path.join(TEMPLATE_PATH, "site")
CSV_PATH = os.path.join(THIS_DIR, "csv")
CSV_FILENAME = 'CMIP6_Variables.csv'
CUSTOM_DICTIONARY_NAME = "stac_dictionary"
DICTIONARY_TEMPLATE_PATH = os.path.join(TEMPLATE_PATH, "dictionary", CUSTOM_DICTIONARY_NAME)
DICTIONARY_PATH = os.path.join(THIS_DIR, "build/dictionary", CUSTOM_DICTIONARY_NAME)

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

def createDictionaryFile(variableList):
    listLength = len(variableList)

    with open(os.path.join(DICTIONARY_TEMPLATE_PATH,"stac_dictionary.dic"), "w") as f:
        f.write(f"{str(listLength)}\n")
        f.close()

    with open(os.path.join(DICTIONARY_TEMPLATE_PATH, "stac_dictionary.dic"), "a") as f:
        for variable in variableList:
            f.write(f"{variable}\n")

        f.close()

def createAffixFile(variableList):
    encoding = "UTF-8"
    if(len(variableList) < 100000):
        with open(os.path.join(DICTIONARY_TEMPLATE_PATH, "stac_dictionary.aff" ), "w") as f:
            f.write("SET " + encoding)
            f.close()



def buildDictionary():
    dataframe = readKeywordCSV()
    longNameList = getVariableLongNameList(dataframe)
    testList = longNameList[0:9]

    createAffixFile(testList)
    createDictionaryFile(testList)


def filter_site_templates(template, extensions=("js", "html")):
    abs_filepath = os.path.join(TEMPLATE_PATH, template)
    basename = os.path.basename(template)
    return (SITE_PATH == os.path.commonpath((abs_filepath, SITE_PATH)) and
            "." in basename and
            basename.rsplit(".", 1)[1] in extensions)


def build(build_directory, custom_dictionary_directory, clean=True):

    buildDictionary()

    if clean:
        shutil.rmtree(build_directory, ignore_errors=True)
    env = Environment(
        loader=FileSystemLoader(TEMPLATE_PATH), autoescape=select_autoescape(enabled_extensions=("html", "js", "css", "dic", "aff"))
    )

    shutil.copytree(os.path.join(THIS_DIR, "static"), build_directory, dirs_exist_ok=True)
    shutil.copytree(os.path.join(THIS_DIR, DICTIONARY_TEMPLATE_PATH), os.path.join(build_directory, "dictionary", custom_dictionary_directory), dirs_exist_ok=True)

    for template in env.list_templates(filter_func=filter_site_templates):
        build_destination = os.path.join(
            build_directory, os.path.relpath(os.path.join(TEMPLATE_PATH, template), SITE_PATH)
        )
        os.makedirs(os.path.dirname(build_destination), exist_ok=True)
        with open(build_destination, "w") as f:
            f.write(env.get_template(template).render())



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
        "--custom-dictionary-directory",
        default=os.path.join(THIS_DIR, "build/dictionary/stac_dictionary"),
        help="location on disk to write dictionary files to.",
    )

    parser.add_argument(
        "-c",
        "--clean",
        action="store_true",
        help="clean build directories before building.",
    )
    args = parser.parse_args()
    build(args.build_directory, args.custom_dictionary_directory, args.clean)