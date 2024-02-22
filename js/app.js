jQuery(document).ready(function ($) {
    // Определение даты
    function getCurrentDate() {
        const currentDate = new Date();
        const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const dayNames = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
        const day = currentDate.getDate();
        const monthIndex = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const dayOfWeekIndex = currentDate.getDay();
        const formattedDate = day + " " + monthNames[monthIndex] + " " + year;
        const dayOfWeek = dayNames[dayOfWeekIndex];
        const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
        return { date: formattedDate, dayOfWeek: capitalizedDay };
    }

    // HTML Текст блока
    function addBlockText(title, text) {
        return (`
        <div class="content__card text-block">
            <div class="content__card-title">
                <span id="editableSpan">${title ? title : 'Что я сделал сегодня? 💪'}</span>
            </div>
            <div class="content__card-list">
                <div class="content__card-text">
                    ${text ? text : ''}
                </div>
            </div>
            <label class="content__card-label">
                <span class="button-plus"></span>
                <input type="text">
            </label>
        </div>
        `)
    }

    // HTML Палзунок блока
    function addBlockRange(title) {
        return (`
        <div class="content__card range-block">
            <div class="content__card-title">
                <span id="editableSpan">${title ? title : 'Насколько я доволен собой?'}</span>
            </div>
            <label class="content__card-label">
                <input class="styled-slider slider-progress" type="range" min="0" max="10">
                <span>0</span>
            </label>
        </div>
        `)
    }

    // HTML Чекбокс блока
    function addBlockCheckbox(title) {
        return (`
        <div class="content__card block-checkbox">
            <div class="content__card-title"><span id="editableSpan">${title ? title : 'На чем сегодня был фокус?'}</span></div>
            <div class="content__card-list"></div>
            <div class="content__card-time">
                <div class="time-block" data-time="0">0</div>
                <div class="time-block" data-time="5 ч">5 ч</div>
                <div class="time-block" data-time="15 ч">15 ч</div>
                <div class="time-block" data-time="30 ч">30 ч</div>
                <div class="time-block" data-time="1 ч">1 ч</div>
                <div class="time-block" data-time="1,5 ч">1,5 ч</div>
                <div class="time-block" data-time="2 ч">2 ч</div>
            </div>
            <label class="content__card-label">
                <span class="button-plus"></span>
                <input type="text">
            </label>
        </div>
        `)
    }

    // Добавление новой 
    function addNewCheckbox(input) {
        const value = input.val().trim();
        if (value === '') {
            return;
        } else {
            const cardList = input.closest('.content__card').find('.content__card-list');
            const activeTimeBlock = $(".content__card-time > .time-block.active");
            let time = '';
            if (activeTimeBlock.length) {
                time = activeTimeBlock.text();
            }

            cardList.append(`
                <div class="content__card-checkbox">
                    <span></span>
                    <p>${value}</p>
                    ${time ? `<div class="time-block" data-time="${time}">${time}</div>` : ''}
                </div>
            `);
            input.val('');
        }
    }

    // Обновление значений span из InputRange
    function getInputRange() {
        $('input[type="range"].slider-progress').each(function () {
            $(this).siblings('span').text($(this).val());
        });
    }

    // Ползунок 
    function inputRange() {
        $('input[type="range"].slider-progress').each(function () {
            var range = $(this);
            range.css('--value', range.val());
            range.css('--min', range.attr('min') === '' ? '0' : range.attr('min'));
            range.css('--max', range.attr('max') === '' ? '100' : range.attr('max'));

            range.on('input', function () {
                range.siblings('span').text(range.val())
            });
        });
    }
    // Функция обработки нажатия клавиши "Enter" в поле ввода блока чекбокса
    function handleCheckboxInputKeypress(event) {
        if (event.which === 13) {
            event.preventDefault();
            const input = $(this);
            addNewCheckbox(input);
            updateEventHandlers();
        }
    }
    // Функция обработки клика на кнопке "Плюс" в блоке чекбокса
    function handleCheckboxButtonClick() {
        const input = $(this).siblings('input');
        addNewCheckbox(input);
        updateEventHandlers();
    }

    // Функция обновления обработчиков событий
    function updateEventHandlers() {
        $('.button-plus').off('click').on('click', handleCheckboxButtonClick);

        $('input[type="text"]').off('keypress').on('keypress', handleCheckboxInputKeypress);
    }


    // Открытие модального окная по клику на элемент на главной 
    $(document).on('click', '.card', function () {
        // $.ajax({
        //     url: '/index.php',
        //     method: 'post',
        //     data: {
        //         action,
        //         nonce,
        //     },
        //     success: function (response) {
        //     }
        // });
        $('.modal__block').addClass('open');
    });

    // =====================================================================================
    // Создание новой записи
    $('.header__container .green-button').click(function () {
        const currentDateInfo = getCurrentDate();
        $('.container__modal__content').empty();
        $('.container__modal__title h3').text(currentDateInfo.date);
        $('.modal__title-day').text(currentDateInfo.dayOfWeek);
        $('.container__modal__content').append(`
        <div class="content__card text-block-constant">
            <div class="content__card-title">
                Моё настроение на сегодня
            </div>
            <div class="content__card-list">
                <div class="content__card-text">
                    Благодарен жене за то, что заботиться об мне, кормить, одевает.
                </div>
            </div>
            <label class="content__card-label">
                <span class="button-plus"></span>
                <input type="text">
            </label>
        </div>
        `);
        $('.modal__block').addClass('open');
    });

    // ====================================Текст=================================================
    // Создание Текст блока
    $('#buttonText').click(function () {
        $('.container__modal__content').append(addBlockText());

        // Привязка обработчика события для кнопки плюс в новом блоке
        $('.content__card.text-block').last().find('.button-plus').click(function () {
            const input = $(this).siblings('input');
            const value = input.val().trim();
            if (value === '') {
                return;
            } else {
                const textBlock = $(this).closest('.text-block').find('.content__card-text');
                textBlock.text(value);
                input.val('');
            }
        });

        // Привязка обработчика события для ввода в новом блоке
        $('.content__card.text-block').last().find('input[type="text"]').keypress(function (event) {
            if (event.which === 13) {
                event.preventDefault();
                const input = $(this);
                const value = input.val().trim();
                if (value === '') {
                    return;
                } else {
                    const textBlock = input.closest('.text-block').find('.content__card-text');
                    textBlock.text(value);
                    input.val('');
                }
            }
        });
    });

    // ====================================Диапазон=================================================
    // Создание Диапазон блока
    getInputRange();

    $('#buttonRange').click(function () {
        $('.container__modal__content').append(addBlockRange());
        inputRange();
        getInputRange();
    });

    $('.container__modal__content').on('input', 'input[type="range"].slider-progress', function () {
        inputRange();
        getInputRange();
    });
    // ====================================Чекбокс=================================================

    // Создание Чекбокс блока
    $('#buttonCheckbox').click(function () {
        $('.container__modal__content').append(addBlockCheckbox());
        updateEventHandlers();
    });
    $('.container__modal__content').on('click', '.content__card-checkbox > span', function () {
        $(this).closest('.content__card-checkbox').toggleClass('close');
    });
    $(document).on('click', '.content__card-time div', function () {
        $('.content__card-time div').removeClass('active');
        $(this).addClass("active");
    });

    updateEventHandlers();

    // ====================================Фото=================================================
    // Добавление фото блока
    $('#photo').on('change', function (event) {
        const files = event.target.files;
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageDataUrl = event.target.result;
                $('.container__modal__content').prepend(`
                <div class="content__card photo-block">
                    <img src="${imageDataUrl}" alt="" width="330" height="140" loading="lazy">
                </div>
                `);
            };
            reader.readAsDataURL(files[0]);
        }
    });



    // ====================================Анимация Регистрации=================================================
    $(document).ready(function () {
        setTimeout(function () {
            $('.login__logo').addClass('start');
            $('.go-register').text('Регистрация').fadeIn(500);
        }, 3000);

        // Обработчик клика на кнопку авторизации
        $(document).on('click', ".button-authorization", function () {
            $('.login__logo').addClass('authorization');
            $(this).addClass('authorization_submit');
            $('.button-register').addClass('register_submit');
        })
        // Обработчик клика на ссылку "Регистрация"
        $(document).on('click', ".go-register", function () {
            $('.login__wrapper').addClass("register-block");
        })
        // Обработчик клика на ссылку "Не регистрироваться"
        $(document).on('click', ".no-register", function () {
            $('.login__wrapper').removeClass("register-block");
        })
    });



    // ====================================Ajax Регистрации и Вход=================================================
    $(document).on('click', ".register_submit, .authorization_submit", function (e) {
        e.preventDefault();
        const email = $('.login__logo__form input[type="email"]').val();
        const password = $('.login__logo__form input[type="password"]').val();
        const action = $(this).hasClass('register_submit') ? 'register' : 'authorize';
        const errorMessage = $(this).hasClass('register_submit') ? 'Ошибка' : 'Неверный логин или пароль';

        $.ajax({
            url: '/index.php',
            method: 'post',
            data: {
                action,
                nonce,
                email,
                password,
            },
            success: function (response) {
                if (response['result'] == 'error') {
                    $('.error-block').addClass('active').text(errorMessage);
                }
            }
        });
    });


    // ====================================Свайп блока вниз=================================================
    $(document).ready(function () {
        const hammertime = new Hammer($('.modal__block')[0]);

        // Устанавливаем параметры, если это необходимо
        const myOptions = {};
        hammertime.get('pan').set(myOptions);

        // Добавляем обработчик события свайпа
        hammertime.on('pan', function (ev) {
            if (ev.direction === Hammer.DIRECTION_DOWN && ev.distance > 50) {
                // $.ajax({
                //     url: '/index.php',
                //     method: 'post',
                //     data: {
                //         action,
                //         nonce,
                //     },
                //     success: function (response) {
                //     }
                // });
                $('.modal__block').removeClass('open');
            }
        });
    })

});




