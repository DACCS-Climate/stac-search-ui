function getWord(elementID){
    var inputBox = document.getElementById(elementID);
    var textInput = inputBox.value;
    var suggestedWord = dictionary.suggest(textInput);
    var wordOutput = document.getElementById("suggestedWordOutput");

    wordOutput.innerText = suggestedWord;
}