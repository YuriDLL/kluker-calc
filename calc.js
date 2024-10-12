let timeout_s = [0, 15, 30, 60, 60 * 5, 60 * 30, 60 * 60, 90 * 60, 120 * 60, 150 * 60, 180 * 60];
let income_scale = 1.07;
let cost_start_scale = 1.1025;
let cost_scale_scale = 1.05;
let start_parameters = [
    [1, "Бегущий по Плюсу", 1000, 5000],
    [2, "Листинг", 1200, 7000],
    [3, "Голубиное кабаре", 70, 1000],
    [4, "Маскарад", 100, 1000],
    [5, "Финансовая грамота", 300, 1300],
    [6, "Филосовский булыжник", 50, 800],
    [7, "24 на 7", 200, 4500],
    [8, "Козырное местечко", 150, 1250],
    [9, "Олимпийка", 90, 1400],
    [10, "Стильный чёрный пакет", 500, 1600],
    [11, "Голубильдер", 150, 2000],
    [12, "Цацка", 140, 700],
    [13, "Кормящая рука", 200, 3000],
    [14, "Спа-набор", 300, 1250],
    [15, "Секретный сейф", 500, 10000],
    [16, "Пероплан", 110, 1300],
    [17, "Космобатут", 250, 3000],
    [18, "Журнал с анекдотами", 500, 15000],
    [19, "Клюк да Винчи", 600, 4000],
    [20, "Покатушки", 900, 10000],
    [21, "Чистый памятник", 1500, 25000],
    [22, "VR-Кандибобер", 2000, 50000],
    [23, "В самый раз", 400, 5500],
    [24, "Зерновой прогноз", 900, 8000],
    [25, "Голубиная почта", 800, 12000],
    [26, "Голубка Пикассо", 400, 5000],
    [27, "Пурпурный пояс", 3000, 25000],
    [28, "Реальная мотивация", 1700, 20000],
    [29, "Золотой запас", 300, 5000],
    [30, "Тинэйдж Мутант Нинзя Клюкер", 1500, 50000],
];
show_columns = ['number', 'name', 'level', 'payback', 'income', 'cost'];
sort = {'column': 'name', 'direction': 'up'};
let state = Array();

start_parameters.forEach(boost => {
    state_boost = {
        "number": boost[0],
        "name": boost[1],
        "level": 0,
        "income": boost[2],
        "cost": boost[3],
        "next_cost_scale": cost_start_scale,
    };
    state_boost.payback = state_boost.cost / state_boost.income;
    state.push(state_boost);
})

function create_button(parent, name, sign) {
    let button = document.createElement("button");
    button.className = 'btn btn-primary';
    button.textContent = sign;
    button.onclick = function () {
        edit_row = state.find((a) => a.name === name);
        if (sign === '+')
        {
            edit_row.level += 1;
            edit_row.income *= income_scale;
            edit_row.cost *= edit_row.next_cost_scale;
            edit_row.next_cost_scale *= cost_scale_scale;
        }
        else
        {
            edit_row.level -= 1;
            if (edit_row.level < 0)
            {
                edit_row.level = 0;
            }
            else
            {
                edit_row.income /= income_scale;
                edit_row.next_cost_scale /= cost_scale_scale;
                edit_row.cost /= edit_row.next_cost_scale;
            }
        }
        
        edit_row.payback = edit_row.cost / edit_row.income;
        update_table();
    }
    parent.append(button);
}

function createRow(boost_state) {
    let row = document.createElement("tr");
    show_columns.forEach(field => {
        let column = document.createElement("td");
        if (field === 'name' || field === 'level' || field === 'number')
        {
            column.textContent = boost_state[field];
        }
        else
        {
            // 2.2.toPrecision(4)
            column.textContent = boost_state[field].toPrecision(4);
        }

        if (field === 'level')
        {
            create_button(column, boost_state.name, '+');
            create_button(column, boost_state.name, '-');
        }
            
        row.append(column);
    });
    
    return row;
}

function update_table() {
    if (sort.direction === 'up')
    {
        state.sort((a, b) => (a[sort.column] - b[sort.column]));
    }
    else
    {
        state.sort((a, b) => (b[sort.column] - a[sort.column]));
    }
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

update_table();