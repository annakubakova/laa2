let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/public'));


// GET                                              получение списка данных
app.get('/api/list', function (req, res) {

    try {
        let content = fs.readFileSync('todo.json', 'utf8');
        let todoList = JSON.parse(content);
        res.send(todoList);
        res.status(200).json({ success: true, list})
        } catch (error) {
      res.status(401).json({ success: false, message: error.message });
        }
});

// GET ID                                           получение одного пользователя по id

app.get('/api/list/:id', function (req, res) {

    try {  
    let id = req.params.id; // получаем id
    let content = fs.readFileSync('todo.json', 'utf8');
    let todoList = JSON.parse(content);
    let list = null;

    // находим в массиве пользователя по id
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == id) {
            list = todoList[i];
            break;
        }
    }
        res.status(200).json({ success: true, list })
        } catch (error) {
      res.status(401).json({ success: false, message: error.message });
        }

});


// POST                                             получение отправленных данных
app.post('/api/list', jsonParser, function (req, res) {

        try {
            if (!req.body) return res.sendStatus(400);
            let todoName = req.body.name;
            let todoDate = req.body.date;
            let list = { name: todoName, date: todoDate };
        
            let data = fs.readFileSync('todo.json', 'utf8');
            let todoList = JSON.parse(data);
        
            // находим максимальный id
            let id = Math.max.apply(
                Math,
                todoList.map(function (o) {
                    return o.id;
                })
            );
            // увеличиваем его на единицу
            list.id = id + 1;
            // добавляем пользователя в массив
            todoList.push(list);
            data = JSON.stringify(todoList);
            // перезаписываем файл с новыми данными
            fs.writeFileSync('todo.json', data);

        res.status(200).json({ success: true, list})
        } catch (error) {
      res.status(401).json({ success: false, message: error.message });
        }
});

// PUT ID                                                                                         изменение пользователя

app.put('/api/list/:id', jsonParser, function (req, res) {

    try {
        if (!req.body) return res.sendStatus(400);

        let todoId = req.params.id;
        let todoName = req.body.name;
        let todoDate = req.body.date;
    
        let data = fs.readFileSync('todo.json', 'utf8');
        let todoList = JSON.parse(data);
        let list;
        for (let i = 0; i < todoList.length; i++) {

            if (todoList[i].id == todoId) {
                list = todoList[i];
                break;
            }
        }
        
        // изменяем данные у пользователя
        if (list) {
            list.date = todoDate;
            list.name = todoName;
            let data = JSON.stringify(todoList);
            fs.writeFileSync('todo.json', data);
        res.status(200).json({ success: true, list })}
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
        }
});

// DELETE ID                                                                    удаление пользователя по id
app.delete('/api/list/:id', function (req, res) {

    try {
        let id = req.params.id;
        let data = fs.readFileSync('todo.json', 'utf8');
        let todoList = JSON.parse(data);
        let index = -1;

        // находим индекс пользователя в массиве
        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].id == id) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            // удаляем пользователя из массива по индексу
            let list = todoList.splice(index, 1)[0];
            let data = JSON.stringify(todoList);
            fs.writeFileSync('todo.json', data);
            // отправляем удаленного пользователя
            return list
        }   
        res.status(200).json({ success: true, list})
        } catch (error) {
      res.status(401).json({ success: false, message: error.message });
        }
});

app.listen(3000, function () {
    console.log('Сервер ожидает подключения...');
});
