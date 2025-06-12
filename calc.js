let timeout_s = [0, 15, 30, 60, 60 * 5, 60 * 30, 60 * 60, 90 * 60, 120 * 60, 150 * 60, 180 * 60];
let income_scale = 1.07;
let cost_start_scale = 1.1025;
let cost_scale_scale = 1.05;
let start_parameters = [
    ["Звук успеха", 768, 6140],
    ["Умный выбор", 731, 5850],
    ["S-класс", 100, 833],
    ["Детективно", 200, 1400],
    ["Будешь сиять", 625, 5000],
];
show_columns = ['number', 'name', 'level', 'payback', 'income', 'cost'];
sort = {'column': 'name', 'direction': 'up'};
let state = Array();

start_parameters.forEach((boost, indx) => {
    boost.splice(0, 0, indx);
    state_boost = {
        "number": boost[0],
        "name": boost[1],
        "level": 0,
        "income": boost[2],
        "cost": boost[3],
    };
    state_boost.payback = state_boost.cost / state_boost.income;
    state.push(state_boost);
})

function createRow(boost_state) {
    let row = document.createElement("tr");
    show_columns.forEach(field => {
        let column = document.createElement("td");
        if (field === 'name' || field === 'number')
        {
            column.textContent = boost_state[field];
        }
        else if (field === 'level')
        {
            let input = document.createElement("input");
            input.className = 'form-control';
            input.type = 'number';
            input.value = boost_state[field];
            
            input.addEventListener('input', function (e) {
                if (e.target.value < 0)
                    e.target.value = 0;
                row = input.parentElement.parentElement;
                update_boost(row);
            })
            column.append(input);
        }
        row.append(column);
    });
    update_boost(row);
    return row;
}

function update_table() {
    sort_stat();
    table = document.getElementById("main-table")
    table.innerHTML = "";
    state.forEach(boost => {
        table.append(createRow(boost));
    })
}

function change_sort(field_name) {
    direction = 'up'
    if (sort.column === field_name)
    {
        direction = sort.direction === 'down' ? 'up' : 'down';
    }
    sort.column = field_name;
    sort.direction = direction;
    update_table();
}

function update_boost(row) {
    number =  parseInt(row.childNodes[0].textContent);
    old_index = state.findIndex((a) => a.number === number);
    let updated_boost = state[old_index];

    let boost_start_parameters = start_parameters.find((a) => a[0] === number);
    let boost_start_income = boost_start_parameters[2];
    
    updated_boost.level = parseInt(row.childNodes[2].childNodes[0].value);
    updated_boost.income = boost_start_income * Math.pow(income_scale, updated_boost.level);
    let cost_scale = cost_start_scale;
    let cost = boost_start_parameters[3];
    for (let i = 0; i < updated_boost.level; i++) {
        cost *= cost_scale;
        cost_scale *= cost_scale_scale;
    }
    updated_boost.cost = cost;
    updated_boost.payback = updated_boost.cost / updated_boost.income;

    row.childNodes[3].textContent = updated_boost.payback.toPrecision(4);
    row.childNodes[4].textContent = updated_boost.income.toPrecision(4);
    row.childNodes[5].textContent = updated_boost.cost.toPrecision(4);

    sort_stat();
    new_index = state.findIndex((a) => a.number === number);
    if (new_index != old_index)
    {
        let table = document.getElementById("main-table");
        row.remove();
        if (new_index === 0)
        {
            table.prepend(row);
        }
        else
        {
            let prev_number = state[new_index - 1].number;
            table.childNodes.forEach(prev_row => {
                if (parseInt(prev_row.childNodes[0].textContent) == prev_number){
                    prev_row.after(row);
                }
            })
        }
    }
}

function sort_stat(){
    if (sort.direction === 'up')
    {
        state.sort((a, b) => (a[sort.column] - b[sort.column]));
    }
    else
    {
        state.sort((a, b) => (b[sort.column] - a[sort.column]));
    }
}

update_table();
