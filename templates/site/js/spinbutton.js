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

function changeInputBGColour(targetElementID){
    var inputField = document.getElementById(targetElementID);

    if(inputField.value != ""){
        inputField.classList.add("input-number-small-background");
    }
    else{
        inputField.classList.remove("input-number-small-background");
    }
}