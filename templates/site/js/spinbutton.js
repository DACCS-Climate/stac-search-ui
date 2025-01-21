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