document.addEventListener("DOMContentLoaded", function (){
    //TODO: Uncomment when spin buttons added to frontend search UI
    //For text input small
    //Sets placeholder text when the spin button input is clicked into or out of
    /*
    var textInputElement = document.getElementById("inputNumberSmall");

    setPlaceholderText(textInputElement, "1");

    textInputElement.addEventListener("click", function(){
        setPlaceholderText(textInputElement, "");
        setTextboxBackground(textInputElement);
    });

    textInputElement.addEventListener("focus", function(){
        setPlaceholderText(textInputElement, "");
    });

    textInputElement.addEventListener("blur", function(){
        setPlaceholderText(textInputElement , "1");
        setTextboxBackground(textInputElement);
    });
    */
})

function increment(targetElementID){
    var target = document.getElementById(targetElementID);

    var newValue = Number(target.value) + 1;
    target.value = newValue;
}

function decrement(targetElementID){
    var target = document.getElementById(targetElementID);

    var newValue = Number(target.value) - 1;
    target.value = newValue;
}