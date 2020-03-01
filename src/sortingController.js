import testObjects from "./testObjects.js";
import displayController from "./displayController.js";
import sortingAlgorithms from "./sortingAlgorithms.js";

const sortingController = (() => {

    let sortingState = false; //true = ON | false = OFF
    let isSorted = false;
    let pauseState = false;
    let speed = 100;
    let maxSpeed = 700;
    const array = testObjects.testArray.slice();

    const setSpeed = newSpeed => speed = newSpeed;
    const getSpeed = () => speed;

    const setMaxSpeed = newMaxSpeed => maxSpeed = newMaxSpeed;
    const getMaxSpeed = () => maxSpeed;

    const getPauseState = () => pauseState;

    const handleSort = async () => {
        if (!sortingState && !isSorted) {
            sortingState = true;
            displayController.displayPause();

            let sortedArray = await sortingAlgorithms.bubbleSort(array);
    
            isSorted = true;
            sortingState = false;
            pauseState = false;
            displayController.displayPlay();
            console.log(sortedArray);
        } else if (sortingState) {
            if (!pauseState) {
                pauseState = true;
                displayController.displayPlay();
            } else {
                pauseState = false;
                displayController.displayPause();
            }
        }
    };

    const handleUnsort = () => {
        if (!sortingState) {
            displayController.drawArray(array);
            isSorted = false;   
        }
    };

    const handleSpeedChange = () => {
        let newSpeed = document.getElementById("speedSlider").value;
        document.getElementById("value").innerHTML = getMaxSpeed() - newSpeed;
        setSpeed(newSpeed);
    };
    
    const applyEventListeners = () => {
        document.getElementById("sortButton").addEventListener("click", handleSort),
        document.getElementById("unsortButton").addEventListener("click", handleUnsort),
        document.getElementById("speedSlider").addEventListener("input", handleSpeedChange);
    };

    return {
        applyEventListeners,
        getSpeed,
        getMaxSpeed,
        getPauseState
    };
})();

export default sortingController;