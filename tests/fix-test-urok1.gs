/**
 * Правка теста к уроку 1: перераспределение правильных ответов по позициям
 * Учебное пособие «Внутреннее устройство БПЛА»
 *
 * Зачем: при создании теста правильный ответ почти всегда оказывался вторым
 * по счёту. Тест можно было пройти, не читая вопросы. Скрипт циклически
 * сдвигает варианты в каждом вопросе так, чтобы верные ответы равномерно
 * разошлись по всем четырём позициям.
 *
 * Форма при этом НЕ пересоздаётся: ссылка, настройки и уже собранные
 * ответы остаются прежними.
 *
 * Как запустить:
 *   1. Нажать «Выполнить» на функции fixTestUrok1
 *   2. Внизу, в журнале выполнения, появится отчёт
 */

function fixTestUrok1() {

  var FORM_ID = '15SnI265AdWEMJ_UyKpLn5q-7uaABoAoSJxDVn-beSlQ';

  var form = FormApp.openById(FORM_ID);
  var items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);

  var moved = 0;

  for (var i = 0; i < items.length; i++) {
    var mc = items[i].asMultipleChoiceItem();
    var choices = mc.getChoices();

    if (choices.length !== 4) {
      continue;
    }

    // найти текущую позицию правильного ответа
    var ok = -1;
    for (var j = 0; j < choices.length; j++) {
      if (choices[j].isCorrectAnswer()) {
        ok = j;
      }
    }
    if (ok < 0) {
      continue;
    }

    // целевая позиция: 0, 1, 2, 3, 0, 1, ...
    var pos = i % 4;
    if (pos === ok) {
      continue;
    }

    // циклический сдвиг
    var shift = ((pos - ok) % 4 + 4) % 4;
    var rotated = [];
    for (var k = 0; k < 4; k++) {
      var src = ((k - shift) % 4 + 4) % 4;
      rotated.push(mc.createChoice(choices[src].getValue(), src === ok));
    }

    mc.setChoices(rotated);
    moved++;
  }

  Logger.log('ГОТОВО. Вопросов обработано: ' + items.length);
  Logger.log('Порядок вариантов изменён в: ' + moved);
  Logger.log('Ссылка на форму: ' + form.getPublishedUrl());
}
