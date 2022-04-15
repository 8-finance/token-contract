# Smart Contract

## Запуск режима разработчика

### Разработка кода контракта

Для начала нужно убедиться, что установлен remixd и установить, если его нет

```bash
npm i -g @remix-project/remixd
```

Далее переходим в папку connector, ставим зависимости и запускаем remixConnect

```bash
cd connector
npm i
npm run remixConnect
```

После чего можно переходить в [remix ide](https://remix.ethereum.org/) и выбрать в workspace вариант "connect to localhost". 

### Разработка коннектора

Для разработки коннектора переходим в папку connector, ставим зависимости и разрабатываем функционал. Для запуска примера использования вводим команду

```bash
npm run ex
```
