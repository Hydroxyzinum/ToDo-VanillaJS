// Получение ссылок на элементы DOM страницы
const taskContainer = document.querySelector(".task-container");
const addTaskPopup = document.querySelector(".add-task");
const taskCard = document.querySelectorAll(".task-card");
const taskView = document.querySelector(".task-view");
const catePopup = document.querySelector(".category");

// Получение текущей даты и времени
const now = new Date();

// Получение текущего месяца и года
let cmonth = now.getMonth();
let cyear = now.getFullYear();

// Создание уникального идентификатора на основе текущей даты (ггггммдд)
const nowid =
  now.getFullYear() + "" + (now.getMonth() + 1) + "" + now.getDate();

// Установка текущего идентификатора
let currid = nowid;

// Инициализация пустого массива для хранения задач
let taskArray = [];

// Инициализация объекта со статистическими данными о задачах
let statsData = {
  aktif: 0,
  komplit: 0,
  hapus: 0,
  total: 0,
  unset: 0,
  work: 0,
  education: 0,
  sport: 0,
  social: 0,
  entertainment: 0,
};

// Загрузка данных из localStorage при запуске приложения
loadData();

// Загрузка задач на страницу
loadTask();

// Инициализация отображения текущей даты и времени на странице
initTime();

// Функция для обработки события клика на кнопку выхода из аккаунта
const exit = () => {
  document
    .querySelector('[data-target="exit"]')
    .addEventListener("click", () => {
      // При клике показываем контейнер для подтверждения выхода
      document.querySelector(".close-container").style.display = "block";

      // Обработчик для кнопки "Да"
      document
        .querySelector('[data-target="yes"]')
        .addEventListener("click", () => {
          // При подтверждении выхода перенаправляем пользователя на страницу "auto.html"
          document.location.href = "auto.html";
        });

      // Обработчик для кнопки "Нет"
      document
        .querySelector('[data-target="no"]')
        .addEventListener("click", () => {
          // При отмене выхода скрываем контейнер для подтверждения выхода
          document.querySelector(".close-container").style.display = "none";
        });
    });
};

// Вызываем функцию для обработки события клика на кнопку выхода из аккаунта
exit();

// Функция для загрузки данных из localStorage
function loadData() {
  // Проверяем, есть ли сохраненные задачи в localStorage
  if (JSON.parse(localStorage.getItem("tasks")) === null) {
    // Если нет, сохраняем пустой массив в localStorage и присваиваем его переменной taskArray
    localStorage.setItem("tasks", JSON.stringify(taskArray));
    taskArray = JSON.parse(localStorage.getItem("tasks"));
  } else {
    // Если есть, загружаем задачи из localStorage в переменную taskArray
    taskArray = JSON.parse(localStorage.getItem("tasks"));
  }

  // Проверяем, есть ли сохраненные статистические данные в localStorage
  if (JSON.parse(localStorage.getItem("stats")) === null) {
    // Если нет, сохраняем пустой объект со статистическими данными в localStorage и присваиваем его переменной statsData
    localStorage.setItem("stats", JSON.stringify(statsData));
    statsData = JSON.parse(localStorage.getItem("stats"));
  } else {
    // Если есть, загружаем статистические данные из localStorage в переменную statsData
    statsData = JSON.parse(localStorage.getItem("stats"));
  }
}

// Функция для сохранения данных в localStorage
function saveData() {
  // Сохраняем текущий массив задач и статистические данные в localStorage
  localStorage.setItem("tasks", JSON.stringify(taskArray));
  localStorage.setItem("stats", JSON.stringify(statsData));
  // Загружаем статистические данные на страницу
  loadStats();
}

// Функция для загрузки задач на страницу
function loadTask() {
  // Удаляем все существующие карточки задач
  const updatedtaskCard = document.querySelectorAll(".task-card");
  updatedtaskCard.forEach((updatedtaskCard) => {
    updatedtaskCard.remove();
  });
  // Скрываем контейнер для завершенных задач
  document.querySelector(".task-container-completed").style.display = "none";
  // Показываем сообщение о пустом списке задач
  document.querySelector(".empty-task").style.display = "block";

  // Проверяем, есть ли задачи для текущего дня в массиве taskArray
  if (taskArray.find((tanggal) => tanggal.date === currid)) {
    // Находим задачи для текущего дня
    let existTask = taskArray.find((tanggal) => tanggal.date === currid);
    let contentArray = existTask.content;

    // Создаем и отображаем карточки для каждой задачи
    for (let i = 0; i < contentArray.length; i++) {
      let currcontent = contentArray[i];

      const tab = document.createElement("div");
      tab.classList = "task-card";
      tab.onclick = function () {
        opentaskView(
          currcontent.title,
          currcontent.desc,
          currcontent.timestart,
          currcontent.timeend,
          currcontent.category,
          currcontent.uid,
          currcontent.isCompleted
        );
      };

      const tabContent = document.createElement("span");
      tabContent.classList = "task-content";

      const image = document.createElement("img");
      image.src = "Img/" + currcontent.category + ".png";

      const title = document.createElement("h2");
      title.innerHTML = currcontent.title;

      const des = document.createElement("p");
      des.innerHTML = currcontent.desc;

      const time = document.createElement("h3");
      time.innerHTML = currcontent.time;

      tab.appendChild(image);
      tabContent.appendChild(title);
      tabContent.appendChild(des);
      tabContent.appendChild(time);
      tab.appendChild(tabContent);

      // Скрываем сообщение о пустом списке задач
      document.querySelector(".empty-task").style.display = "none";

      // Проверяем, выполнена ли задача, и добавляем карточку в соответствующий контейнер
      if (currcontent.isCompleted == "false") {
        // Если задача не выполнена, добавляем карточку в контейнер ".task-container"
        document.querySelector(".task-container").appendChild(tab);
      } else if (currcontent.isCompleted == "true") {
        // Если задача выполнена, изменяем стиль карточки и добавляем ее в контейнер ".task-container-completed"
        tab.style = "background: linear-gradient(120deg, #D6FFA3, #97FF00)";
        document.querySelector(".task-container-completed").style.display =
          "flex";
        document.querySelector(".task-container-completed").appendChild(tab);
      }
    }
  }
}
// Функция для изменения текущего месяца в зависимости от значения 'val'
function changeMonth(val) {
  if (val == 0) {
    // Если 'val' равен 0, увеличиваем текущий месяц на 1
    if (cmonth < 11) {
      cmonth++;
    } else {
      // Если текущий месяц - декабрь (11), устанавливаем январь (0) следующего года
      cmonth = 0;
      cyear += 1;
    }
  } else {
    // Если 'val' не равен 0, уменьшаем текущий месяц на 1
    if (cmonth > 0) {
      cmonth--;
    } else {
      // Если текущий месяц - январь (0), устанавливаем декабрь (11) предыдущего года
      cmonth = 11;
      cyear -= 1;
    }
  }

  // Обновляем отображение даты и времени на странице
  initTime();
  // Симулируем клик на кнопку текущей даты для обновления задач на странице
  document.querySelector(".date button").click();
  // Сбрасываем горизонтальную прокрутку в контейнере даты до начального положения
  document.querySelector(".date").scrollLeft = 0;
}

// Функция для инициализации отображения текущей даты и времени на странице
function initTime() {
  // Массивы с названиями месяцев и дней недели на разных языках
  const months = [
    "Январь 🌨️",
    "Февраль 🌨️",
    "Март 🌧️",
    "Апрель ☀️",
    "Май ☀️",
    "Июнь ☀️",
    "Июль ☀️",
    "Август ☀️",
    "Сентябрь 🌧️",
    "Октябрь 🌧️",
    "Ноябрь 🌨️",
    "Декабрь 🌨️",
  ];
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const daysmin = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const monthsEng = [
    "January",
    "February",
    "Marth",
    "April",
    "May",
    "June",
    "Jule",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Получаем название текущего месяца и дня недели, а также номер текущего дня
  let month = months[cmonth];
  let day = days[now.getDay()];
  let numday = now.getDate();

  // Получаем общее количество дней в текущем месяце
  const getMonthTotalDays = new Date(
    now.getFullYear(),
    cmonth + 1,
    0
  ).getDate();

  // Удаляем все существующие кнопки с датами на странице
  let allBtn = document.querySelectorAll(".date button");
  allBtn.forEach((btn) => {
    btn.remove();
  });

  // Создаем новые кнопки с датами для текущего месяца
  for (let i = 1; i < getMonthTotalDays + 1; i++) {
    let relativenow = new Date(now.getFullYear(), cmonth, i);
    let relaviveday = daysmin[relativenow.getDay()];

    const tbox = document.createElement("button");
    tbox.innerHTML = i;

    const tday = document.createElement("span");
    tday.innerHTML = relaviveday;
    tbox.appendChild(tday);

    tbox.id = now.getFullYear() + "" + (cmonth + 1) + "" + i;
    tbox.onclick = function () {
      currid = tbox.id;
      deactiveBtn(tbox);
      loadTask();
    };
    tbox.classList = "dateBtn";
    document.querySelector(".date").appendChild(tbox);

    if (i == numday) {
      // При совпадении текущей даты и кнопки, выравниваем кнопку в центр контейнера даты
      const parent = document.querySelector(".date");
      parent.scrollLeft = tbox.offsetLeft - parent.offsetLeft;
      currid = tbox.id;
      deactiveBtn(tbox);
    }
  }

  // Обновляем отображение текущего месяца и года на странице
  document.querySelector(".topdate-holder h2").innerHTML = month;
  document.querySelector(".topdate-holder h4").innerHTML = cyear;
  document.querySelector(".topdate-holder h2").value = monthsEng;
}

// Функция для отключения активных кнопок даты и активации переданной кнопки 'val'
function deactiveBtn(val) {
  let allBtn = document.querySelectorAll(".date button");
  allBtn.forEach((fbtn) => {
    fbtn.classList = "dateBtn";
  });
  val.classList = "dateBtnActive";
}

// Получение текущей даты и времени
const currentDate = new Date();
const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
const currentTimes = `${currentDate.getHours()}:${
  currentDate.getMinutes() + 1
}`;

// Получение элементов формы добавления задачи
const timeStartListener = document.querySelector('.event_listen[type="time"]');
let title = document.getElementById("taskname");
let desc = document.getElementById("taskdesc");
let category = "unset";
let timeStart = document.getElementById("timestart");
let timeEnd = document.getElementById("timeend");

// Получение элементов для отображения выбранной категории и времени
const cateDisplayer = document.querySelector(
  ".lower-input button:nth-child(1) span"
);
const tsDisplayer = document.querySelector(
  ".lower-input button:nth-child(2) span"
);
const teDisplayer = document.querySelector(
  ".lower-input button:nth-child(3) span"
);

// Функция для открытия всплывающего окна добавления задачи
function opentaskPopup() {
  addTaskPopup.style.display = "flex";
}

// Функция для закрытия всплывающего окна добавления задачи и сброса значений полей
function closetaskPopup() {
  addTaskPopup.style.display = "none";
  document.querySelector(".category").style.display = "none";
  [title.value, desc.value, category, timeStart.value, timeEnd.value] = [
    "",
    "",
    "Работа",
    "19:00",
    "13:00",
  ];
  [cateDisplayer.innerHTML, tsDisplayer.innerHTML, teDisplayer.innerHTML] = [
    category,
    timeStart.value,
    timeEnd.value,
  ];
}

// Функция для открытия окна просмотра задачи с переданными данными
function opentaskView(t, d, ts, te, c, u, ic) {
  taskView.style.display = "flex";

  let title = taskView.querySelector(".task-form-view h1");
  let desc = taskView.querySelector(".task-form-view p");
  let del = taskView.querySelector(".task-view #taskDelete");
  let cmplt = taskView.querySelector(".task-view #taskComplete");

  let cateDisplay = document.querySelector(
    ".lower-input-view button:nth-child(1) span"
  );
  let tsDisplay = document.querySelector(
    ".lower-input-view button:nth-child(2) span"
  );
  let teDisplay = document.querySelector(
    ".lower-input-view button:nth-child(3) span"
  );
  let imgDisplay = document.querySelector(".task-form-view img");

  imgDisplay.src = "Img/" + c + ".png";

  title.innerHTML = t;
  desc.innerHTML = d;
  tsDisplay.innerHTML = ts;
  teDisplay.innerHTML = te;
  cateDisplay.innerHTML = c;
  del.onclick = function () {
    deleteTask(u);
  };

  if (ic == "false") {
    cmplt.style.display = "block";
    cmplt.onclick = function () {
      completeTask(u);
    };
  } else {
    cmplt.style.display = "none";
  }
}

// Функция для закрытия окна просмотра задачи
function closetaskView() {
  taskView.style.display = "none";
}

// Функция для открытия всплывающего окна выбора категории
function openCategory() {
  catePopup.style.display = "flex";
  // Добавляем обработчик события для каждой кнопки в окне выбора категории
  document.querySelectorAll(".category button").forEach((button) => {
    button.addEventListener("click", function () {
      category = button.innerHTML; // Обновляем выбранную категорию
      cateDisplayer.innerHTML = button.innerHTML; // Обновляем отображение выбранной категории
      closeCategory();
    });
  });
}

// Функция для закрытия всплывающего окна выбора категории
function closeCategory() {
  catePopup.style.display = "none";
}

// Функция для добавления задачи при нажатии кнопки "Добавить задачу"
function addtaskBtn() {
  if (timeStart.value < currentTime) {
    alert("Вы добавляете задачу в прошедшем времени");
  }
  let timeStartEnd = timeStart.value + " - " + timeEnd.value;

  // Вызываем функцию addtask, передавая ей данные о задаче
  addtask(
    title.value,
    desc.value,
    timeStart.value,
    timeEnd.value,
    category,
    timeStartEnd
  );
}

// Обновление отображения времени при изменении времени начала
timeStart.oninput = function () {
  tsDisplayer.innerHTML = timeStart.value;
};

// Обновление отображения времени при изменении времени окончания
timeEnd.oninput = function () {
  teDisplayer.innerHTML = timeEnd.value;
};

// Функция для добавления задачи в массив и сохранения данных
function addtask(t, d, ts, te, c, tse) {
  let uniqueid = Math.random() * 100;

  statsData.aktif++; // Увеличиваем счетчик активных задач
  statsData.total++; // Увеличиваем общий счетчик задач
  statsData[c]++; // Увеличиваем счетчик задач в выбранной категории
  saveData(); // Сохраняем измененные данные в localStorage

  if (taskArray.find((tanggal) => tanggal.date === currid)) {
    // Если для текущей даты уже есть задачи в массиве
    let existTask = taskArray.find((tanggal) => tanggal.date === currid);
    let content = existTask.content;
    content.push({
      uid: uniqueid,
      isCompleted: "false",
      title: t,
      desc: d,
      timestart: ts,
      timeend: te,
      time: tse,
      category: c,
    });

    loadTask(); // Загружаем задачи для текущей даты
    closetaskPopup(); // Закрываем всплывающее окно добавления задачи
    saveData(); // Сохраняем измененные данные в localStorage
  } else {
    // Если для текущей даты еще нет задач в массиве
    taskArray.push({
      date: currid,
      content: [
        {
          uid: uniqueid,
          isCompleted: "false",
          title: t,
          desc: d,
          timestart: ts,
          timeend: te,
          time: tse,
          category: c,
        },
      ],
    });

    loadTask(); // Загружаем задачи для текущей даты
    closetaskPopup(); // Закрываем всплывающее окно добавления задачи
    saveData(); // Сохраняем измененные данные в localStorage
  }
}

// Функция для удаления задачи по ее уникальному идентификатору (uid)
function deleteTask(val) {
  if (taskArray.find((tanggal) => tanggal.date === currid)) {
    // Если для текущей даты есть задачи в массиве
    let getTask = taskArray.find((tanggal) => tanggal.date === currid);
    let taskContent = getTask.content;
    let getUidTask = getTask.content.find((id) => id.uid === val);

    if (taskContent.isCompleted == "false") {
      // Если задача активная
      if (statsData.aktif > 0) {
        statsData.hapus++; // Увеличиваем счетчик удаленных задач
        statsData.aktif--; // Уменьшаем счетчик активных задач
        saveData(); // Сохраняем измененные данные в localStorage
      }
    } else {
      // Если задача уже выполнена
      if (statsData.komplit > 0) {
        statsData.hapus++; // Увеличиваем счетчик удаленных задач
        statsData.komplit--; // Уменьшаем счетчик выполненных задач
        saveData(); // Сохраняем измененные данные в localStorage
      }
    }

    let indPos = taskContent.indexOf(getUidTask);

    if (taskContent.length > 1) {
      taskContent.splice(indPos, 1);
    } else {
      taskArray.pop();
    }

    saveData(); // Сохраняем измененные данные в localStorage
    loadTask(); // Загружаем задачи для текущей даты
    closetaskView(); // Закрываем окно просмотра задачи
  }
}

// Функция для завершения задачи по ее уникальному идентификатору (uid)
function completeTask(val) {
  if (statsData.aktif > 0) {
    statsData.komplit++; // Увеличиваем счетчик выполненных задач
    statsData.aktif--; // Уменьшаем счетчик активных задач
    saveData(); // Сохраняем измененные данные в localStorage
  }

  if (taskArray.find((tanggal) => tanggal.date === currid)) {
    // Если для текущей даты есть задачи в массиве
    let getTask = taskArray.find((tanggal) => tanggal.date === currid);
    let getUidTask = getTask.content.find((id) => id.uid === val);
    getUidTask.isCompleted = "true"; // Устанавливаем задаче статус выполнено
  }

  saveData(); // Сохраняем измененные данные в localStorage
  loadTask(); // Загружаем задачи для текущей даты
  closetaskView(); // Закрываем окно просмотра задачи
}

// Функция для переключения между разделами: "Расписание" и "Статистика"
function section(val) {
  if (val == 0) {
    document.getElementById("schedule").scrollIntoView({
      behavior: "smooth",
    });
    document.querySelector(".navbar button:first-child img").src =
      "Img/category.png";
    document.querySelector(".navbar button:last-child img").src =
      "Img/chart-glyph.png";
  } else {
    document.getElementById("stats").scrollIntoView({
      behavior: "smooth",
    });
    document.querySelector(".navbar button:last-child img").src =
      "Img/chart-glyph.png";
    document.querySelector(".navbar button:first-child img").src =
      "Img/category.png";
  }
}

// Геттеры для статистики
const aktifD = document.querySelector(".box-holder span:nth-child(1) h1");
const komplitD = document.querySelector(".box-holder span:nth-child(2) h1");
const hapusD = document.querySelector(".box-holder span:nth-child(4) h1");
const totalD = document.querySelector(".box-holder span:nth-child(3) h1");
const unsetD = document.querySelector(".catbox-holder span:nth-child(1)");
const workD = document.querySelector(".catbox-holder span:nth-child(2)");
const eduD = document.querySelector(".catbox-holder span:nth-child(3)");
const sportD = document.querySelector(".catbox-holder span:nth-child(4)");
const socialD = document.querySelector(".catbox-holder span:nth-child(5)");
const entD = document.querySelector(".catbox-holder span:nth-child(6)");
// **************

// Загрузка данных в статистику
loadStats();

function loadStats() {
  aktifD.innerHTML = statsData.aktif;
  komplitD.innerHTML = statsData.komplit;
  hapusD.innerHTML = statsData.hapus;
  totalD.innerHTML = statsData.total;
  unsetD.innerHTML = statsData.unset;
  workD.innerHTML = statsData.work;
  eduD.innerHTML = statsData.education;
  sportD.innerHTML = statsData.sport;
  socialD.innerHTML = statsData.social;
  entD.innerHTML = statsData.entertainment;
}

// Проверка выбранной даты при клике на кнопку с датой
const currentDay = currentDate.getDate();
const getActiveButton = document.querySelector(".dateBtnActive");
const getbtnDate = document.querySelectorAll(".dateBtn");
getbtnDate.forEach((item) => {
  item.addEventListener("click", (e) => {
    const split = item.textContent.slice(0, -2);
    if (Number(split) < currentDay) {
      confirm("Вы выбрали прошлую дату!");
    }
  });
});

// Функция валидатор на проверку актуального времени

// Отправка данных на почту при нажатии кнопки "Отправить на почту"
const sendMailer = () => {
  const serviceId = 'ВАШ SERVICE ID EMAIL.JS';
  const templateID = 'ВАШ TEMPLATE ID EMAIL.JS';

  const getTopDateYear = document.querySelector(".topdate-holder h4");
  const getTopDateMonth = document.querySelector(".topdate-holder h2");
  const buttonSend = document.querySelector(".sendMail");
  buttonSend.addEventListener("click", () => {
    const result = [];
    const getTaskFormHead = document.querySelector(".task-form-view h1");
    const getTaskFormP = document.querySelector(".task-form-view p");
    const loweryHolderDiv = document.querySelectorAll(
      ".loweri-holder-view button"
    );
    loweryHolderDiv.forEach((item, index) => {
      if (index === 1 || index === 2 || index === 0) {
        result.push(item.textContent);
      }
    });
    const [work, first, second] = result;
    const firstSlice = first.slice(-5);
    const secondSlice = second.slice(-5);
    const [category, value] = work.split(":");

    let templateParams = {
      category: category,
      value: value,
      year: getTopDateYear.textContent,
      month: getTopDateMonth.textContent,
      start: firstSlice,
      end: secondSlice,
      task: getTaskFormHead.textContent,
      message: getTaskFormP.textContent,
    };

    // Отправка данных на сервер и обработка ответа
    emailjs
      .send(serviceId, templateID, templateParams)
      .then((e) => {
        alert("Отправлено!");
        closetaskView();
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

sendMailer();

// Отмена отправки формы при нажатии кнопки "Отправить на почту"
document.querySelector(".form-input").addEventListener("submit", (e) => {
  e.preventDefault();
});
