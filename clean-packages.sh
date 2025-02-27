# Установка depcheck, если он еще не установлен
if ! command -v depcheck &> /dev/null
then
    echo "depcheck не установлен. Устанавливаю..."
    yarn global add depcheck
fi

# Запуск depcheck и сохранение вывода во временный файл
echo "Проверка неиспользуемых пакетов..."
depcheck --json > depcheck_output.json

# Проверка, что файл не пустой
if [ ! -s depcheck_output.json ]; then
    echo "Ошибка: depcheck не вернул результатов"
    rm depcheck_output.json
    exit 1
fi

# Извлечение неиспользуемых зависимостей из JSON-вывода
echo "Для чистки от ненужных пакетов выполните команды:"
jq -r '.dependencies[]' depcheck_output.json | while read -r package; do
    echo "yarn remove $package"
done

# Удаление временного файла
rm depcheck_output.json
