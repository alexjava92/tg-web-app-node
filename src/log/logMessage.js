function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  let color = '';
  switch (level) {
    case 'info':
      color = '\x1b[32m'; // Зеленый цвет
      break;
    case 'warn':
      color = '\x1b[33m'; // Желтый цвет
      break;
    case 'error':
      color = '\x1b[31m'; // Красный цвет
      break;
    case 'success':
      color = '\x1b[32m'; // Зеленый цвет
      break;
  }

  // Получаем трассировку стека
  const err = new Error();
  const stack = err.stack;
  const stackLines = stack.split('\n');
  const callerLine = stackLines[2]; // Вторая строка содержит путь вызова

  // Разбор строки трассировки стека
  let filePath = 'unknown location';
  let lineNumber = 'unknown';
  const stackMatch =
    callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
    callerLine.match(/at\s+(.*):(\d+):(\d+)/);
  if (stackMatch) {
    filePath = stackMatch[2]; // Полный путь к файлу
    lineNumber = stackMatch[3]; // Номер строки

    // Получаем только название файла
    const pathParts = filePath.split('\\');
    filePath = pathParts[pathParts.length - 1];
  }

  console.log(
    `${color}[${timestamp}] [${level}] [${filePath}:${lineNumber}]\x1b[0m: ${message}`,
  );
}

module.exports = logMessage;
