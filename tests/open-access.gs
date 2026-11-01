/**
 * Открытие доступа по ссылке ко всем формам тестов
 * Учебное пособие «Внутреннее устройство БПЛА»
 *
 * Зачем: форма, созданная копированием, наследует доступ «только владелец».
 * При попытке открыть такую форму Google просит войти в аккаунт.
 * Скрипт находит все формы, названия которых начинаются с «Тест к уроку»,
 * и разрешает отвечать всем, у кого есть ссылка.
 *
 * Ссылки на формы при этом НЕ меняются.
 *
 * Как запустить:
 *   1. Нажать «Выполнить» на функции openAccessForAllTests
 *   2. Внизу, в журнале выполнения, появится список обработанных форм
 */

function openAccessForAllTests() {

  var query = 'title contains "Тест к уроку" and ' +
              'mimeType = "application/vnd.google-apps.form" and ' +
              'trashed = false';

  var files = DriveApp.searchFiles(query);
  var count = 0;

  while (files.hasNext()) {
    var file = files.next();

    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var form = FormApp.openById(file.getId());
    Logger.log('Открыт доступ: ' + file.getName());
    Logger.log('   ссылка: ' + form.getPublishedUrl());

    count++;
  }

  if (count === 0) {
    Logger.log('Форм с названием «Тест к уроку ...» не найдено.');
  } else {
    Logger.log('ГОТОВО. Обработано форм: ' + count);
  }
}
