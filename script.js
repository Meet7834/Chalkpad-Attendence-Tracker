//This function adds a new cell at the end of the row:
const addCell = (row, bunks, shortAtd) => {
    //Making the new cell exactly the same as chalkpad-official ones:
    let cell = document.createElement("td");
    cell.setAttribute("width", "2%");
    cell.setAttribute("align", "center");

    //Deciding if you should which color the cell text should be:
    if (!shortAtd) {
        cell.setAttribute("style", "color: #82CD47;");
    } else {
        cell.setAttribute("style", "color: #DC3535;");
    };

    //Adding text and appending the cell to the row:
    cell.innerText = bunks;
    row.append(cell);
};

//This function adds heading to the our new column:
const addHeadingCell = (headingRow) => {
    //Same concept as previous function: create cell -> modify cell according to chalkpad -> add text -> append:
    let cell = document.createElement("td");
    cell.setAttribute("width", "2%");
    cell.setAttribute("align", "center");
    cell.classList.add("searchhead_text");
    cell.setAttribute("border", "0");
    cell.innerText = 'Bunks/Extra Class';
    headingRow.append(cell);
};

//This function adds instructions as to what red and green colors mean:
const addInstructions = () => {
    //Selecting the div where i want to add instructions:
    let div = document.querySelector("#attendanceResultDiv");

    //Creating new element -> Adding style to it -> adding text to it:
    let green = document.createElement("p");
    green.innerText = 'Green: How many classes you can bunk without it falling below 75%.';
    green.setAttribute("style", "color: #82CD47");

    //Creating new element -> Adding style to it -> adding text to it:
    let red = document.createElement("p");
    red.innerText = 'Red: How many classes you have to attend to make your attendence 75%';
    red.setAttribute("style", "color: #DC3535 ");

    //Appending both the elements to the selected div:
    div.append(green);
    div.append(red);
};

//This function calculates the number of classes you can bunk or have to attend:
const noOfBunks = (attended, deliverd) => {
    
    const target = 75;//In future updates user will have option to change the target attendence: 

    //declaring variables: bunks->number of classes student can bunk, shortAtd->if students has attendence less thean 75% it will be set to true and student will have to attend extra classes to compensate for it:
    let bunks = 0;
    let shortAtd = false;
    per = (attended / deliverd) * 100;

    //If student has attendence more than 75%:
    if (per >= target) {

        //Increases bunks and deliverd classes by one untill attendence falls below 75%:
        while (per >= target) {
            bunks = bunks + 1;
            deliverd = deliverd + 1;
            per = (attended / deliverd) * 100;
        };

        //This decreases bunks and deliverd by one because loop was running one more time than needed:
        bunks--;
        deliverd--;
        per = (attended / deliverd) * 100;

        //Returns number of bunks and if student has short attendence:
        return {bunks, shortAtd};

    } else { //If student has attendence less than 75%:

        //It will change shortAtd to true meaning student will have to attend more classes to make the attendence to 75%:
        shortAtd = true;

        //Same logic as in if loop just incrementing:
        while (per < target) {
            attended ++;
            bunks++;
            deliverd ++;
            per = (attended / deliverd) * 100;
        }

        //This time loop runs exactly as many times as needed so no need to increment or decrement:
        per = (attended / deliverd) * 100;
        return {bunks, shortAtd}; //Same logic as in if loop
    }
};

//This fuction is heart of the code:
const mainFunc = () => {
    //Try and catch because if the first time page isn't loaded fully and error happens it will try to do it again.
    try {
        //Selectes the main table we want data from:
        const table = document.querySelector("#attendanceResultDiv > table > tbody")
        const noOfSubjects = table.children.length; //No of subjects so that we know how many times the loop has to run
        const headingRow = document.querySelector('#attendanceResultDiv > table > tbody > tr:nth-child(1)'); //First row
        addHeadingCell(headingRow);//adds the aditional cell to the heading row

        //This loop runs for number of subjects of the student and it runs from second because first row is the heading row:
        for (let i = 2; i <= noOfSubjects; i++) {
            const row = document.querySelector(`#attendanceResultDiv > table > tbody > tr:nth-child(${i})`);//Selects the subject row
            
            //Selects all the elements as named:
            const attended = row.children[6];
            const dutyLeave = parseInt(row.children[7].innerText);
            const medicalLeave = parseInt(row.children[8].innerText);
            const deliverd = row.children[9];

            //adds dl and ml to the total attended lectures:
            let numAtn = parseInt(attended.innerText) + dutyLeave + medicalLeave;
            let numDel = parseInt(deliverd.innerText) + dutyLeave + medicalLeave;

            const {bunks, shortAtd} = noOfBunks(numAtn, numDel);//collects the variables returned from the fucntion
            
            addCell(row, bunks, shortAtd); //adds new cell to each row
        }

        addInstructions(); //adds the instructions
    } catch { //This is in case code failes to run first time because it couldn't get data from chalkpad
        console.log('It Failed to run one time.')
        setTimeout(function () {
            mainFunc();//This runs the mainfunc again after 2 seconds cause by then it would have got data probably and if it still fails then recursion happens and it will run until it has found the data.
        }, 2000)
    };
};

//this function is incase student tries to change the semester:
const semesterChange = ()=>{
    //Selects the select element listens for changes to happen to it:
    const mySelectElement = document.querySelector("#semesterDetail");
    mySelectElement.addEventListener('change', function() {
        setTimeout(function(){
            mainFunc(); //runs the mainFunc again if any changes happen to the select element
        },1200);
    });
};

//This calls the mainFunc and semesterChange after 1.5 seconds after the page has loaded
setTimeout(function () {
    mainFunc();
    semesterChange();
}, 1500);