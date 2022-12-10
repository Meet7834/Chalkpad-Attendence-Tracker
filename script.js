const addCell = (row, extraClass, shortAtd) => {
    let cell = document.createElement("td");
    cell.setAttribute("width", "2%");
    cell.setAttribute("align", "center");
    if (!shortAtd) {
        cell.setAttribute("style", "color: #82CD47;");
    } else {
        cell.setAttribute("style", "color: #DC3535;");
    };
    cell.innerText = extraClass;
    row.append(cell);
};

const addHeadingCell = (headingRow) => {
    let cell = document.createElement("td");
    cell.setAttribute("width", "2%");
    cell.setAttribute("align", "center");
    cell.classList.add("searchhead_text");
    cell.setAttribute("border", "0");
    cell.innerText = 'Bunks/Extra Class';
    headingRow.append(cell);
};

const addInstructions = () => {
    let div = document.querySelector("#attendanceResultDiv");
    let green = document.createElement("p");
    green.innerText = 'Green: How many classes you can bunk without it falling below 75%.';
    green.setAttribute("style", "color: #82CD47");
    let red = document.createElement("p");
    red.innerText = 'Red: How many classes you have to attend to make your attendence 75%';
    red.setAttribute("style", "color: #DC3535 ");

    div.append(green);
    div.append(red);
};

const noOfextraClass = (attended, deliverd) => {
    const target = 75;
    let extraClass = 0;
    let shortAtd = false;
    per = (attended / deliverd) * 100;

    if (per >= target) {
        while (per >= target) {
            extraClass = extraClass + 1;
            deliverd = deliverd + 1;
            per = (attended / deliverd) * 100;
        };
        extraClass--;
        deliverd --;
        per = (attended / deliverd) * 100;
        return {extraClass, per, shortAtd};

    } else {
        shortAtd = true;
        while (per < target) {
            attended ++;
            extraClass++;
            deliverd ++;
            per = (attended / deliverd) * 100;
        }
        per = (attended / deliverd) * 100;
        return {extraClass, per, shortAtd};
    }
};

const mainFunc = () => {
    try {
        const table = document.querySelector("#attendanceResultDiv > table > tbody")
        const noOfSubjects = table.children.length;
        const headingRow = document.querySelector('#attendanceResultDiv > table > tbody > tr:nth-child(1)');
        addHeadingCell(headingRow);
        for (let i = 2; i <= noOfSubjects; i++) {
            const row = document.querySelector(`#attendanceResultDiv > table > tbody > tr:nth-child(${i})`);
            const attended = row.children[6];
            const dutyLeave = parseInt(row.children[7].innerText);
            const medicalLeave = parseInt(row.children[8].innerText);
            const deliverd = row.children[9];
            let numAtn = parseInt(attended.innerText) + dutyLeave + medicalLeave;
            let numDel = parseInt(deliverd.innerText) + dutyLeave + medicalLeave;
            const {extraClass, per, shortAtd} = noOfextraClass(numAtn, numDel);
            addCell(row, extraClass, shortAtd);
        }
        addInstructions();
    } catch {
        console.log('It Failed to run one time.')
        setTimeout(function () {
            mainFunc();
        }, 2000)
    };
};

const semesterChange = ()=>{
    const mySelectElement = document.querySelector("#semesterDetail");
    mySelectElement.addEventListener('change', function() {
        setTimeout(function(){
            mainFunc();
        },1000);    
    });
};

setTimeout(function () {
    mainFunc();
    semesterChange();
}, 1000);