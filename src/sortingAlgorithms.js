import displayController from "./displayController.js";
import sortingController from "./sortingController.js";

const removeHighlight = async (bar) => {
    await new Promise(resolve => {
        setTimeout(() => {
            bar.classList.remove("highlighted");
            resolve();
        }, sortingController.getSpeed());
    });
};

const switchPlaces = async (chart, i, j) => {
    await new Promise(resolve => {
        setTimeout(() => {
            displayController.switchPlaces(chart, i, j);
            resolve();
        }, sortingController.getSpeed());
    });
};

const handlePause = async (step) => {
    step--;
    await new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 0);
    });
    return step
};

const compareArrays = (array1, array2) => {
    if (array1.length != array2.length)
        return false;
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) 
            return false;
    }
    return true;
};

/*----------------------------------------------------------------------------------------*/

const sortingAlgorithms = (() => {

    const bubbleSort = arrayOriginal => {
        let array = arrayOriginal.slice();
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] > array[j]) [array[i], array[j]] = [array[j], array[i]];
            }
        }
        return array;
    }

    const bubbleSortVisualized = async arrayOriginal => {
        let step = 0;
        let array = arrayOriginal.slice();
        let testArray = [...array];
        let chart = document.getElementById("chart");
        for (let i = 0; i < array.length; i++) {

            let selectedBar = chart.children[i];
            selectedBar.classList.add("selected");

            for (let j = i + 1; j < array.length; j++) {

                let highlightedBar = chart.children[j];
                highlightedBar.classList.add("highlighted");
                
                if (sortingController.getPauseState()) {
                    if (sortingController.getResetState() || sortingController.getCompleteSortState()) {
                        highlightedBar.classList.remove("highlighted");
                        return;
                    } else if (sortingController.getLastStepTrigger()) {
                        [testArray[i], testArray[j]] = [testArray[j], testArray[i]];
                        if (compareArrays(testArray, sortingController.getSortingStep(0))) {
                            [array[i], array[j]] = [array[j], array[i]];
                            await switchPlaces(chart, i, j);
                            selectedBar = chart.children[i];
                            document.getElementById("lastStepButton").disabled = true;

                        } else if (compareArrays(testArray, sortingController.getSortingStep(step-1))) {
                            step--;
                            [array[i], array[j]] = [array[j], array[i]];
                            await switchPlaces(chart, i, j);
                            selectedBar = chart.children[i];
                            
                        } else {
                            highlightedBar.classList.remove("highlighted");
                            [testArray[i], testArray[j]] = [testArray[j], testArray[i]];
                            if (j - 1 != i) {
                                j -= 1;
                            } else {
                                selectedBar.classList.remove("selected");
                                i -= 1;
                                selectedBar = chart.children[i];
                                selectedBar.classList.remove("sorted");
                                selectedBar.classList.add("selected");
                                j = array.length - 1;
                            }
                        }
                        highlightedBar = chart.children[j];
                        highlightedBar.classList.add("highlighted");
                        sortingController.setLastStepTrigger();
                    }
                    j = await handlePause(j);

                } else if (array[i] > array[j]) {
                    [array[i], array[j]] = [array[j], array[i]];
                    step++;
                    testArray = [...array];
                    await switchPlaces(chart, i, j);
                    selectedBar = chart.children[i];

                } else {
                    await removeHighlight(highlightedBar);
                }
            }
            selectedBar.classList.remove("selected");
            selectedBar.classList.add("sorted");
        }
        return array;
    };

    const bubbleSortSteps = inputArray => {
        let array = inputArray.slice();
        let steps = [[...array]];
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] > array[j]) {
                    [array[i], array[j]] = [array[j], array[i]];
                    steps.push([...array]);
                }    
            }
        }
        return steps;
    };

    return {
        bubbleSort,
        bubbleSortVisualized,
        bubbleSortSteps
    };
})();

export default sortingAlgorithms;