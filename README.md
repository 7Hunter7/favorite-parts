# Favorit-Parts — поиск автозапчастей и аналогов

Двухэтапный поиск через API «Проценка».

## Стек

React 18, Redux Toolkit, Bootstrap 5.

## Запуск

```bash
npm install
npm start                    # http://localhost:3000
npm run build                # Сборка
```

## Переменные окружения

| Переменная              | Назначение                                                                |
| ----------------------- | ------------------------------------------------------------------------- |
| `REACT_APP_FAVORIT_URL` | Базовый URL API (по умолчанию `https://api.favorit-parts.ru/hs/hsprice/`) |
| `REACT_APP_FAVORIT_KEY` | Ключ покупателя.                                                          |

## Как работает

1. **Этап 1** — ввод артикула (дебаунс 500 мс) --> `GET ?key&number` --> уникальные бренды.
2. **Этап 2** — клик по бренду --> `GET ?key&number&brand&analogues=on&info=on` --> аналоги.
3. Цена берётся **только из `warehouses[].price`** (поле `price` корня устарело — так в документации).

## Ловушки API

- `{error: "..."}` --> сообщение в UI;
- пустой `goods` / «пустышка» (`brand:""`) --> «ничего не найдено»;
- `analogues[]` только при `brand + analogues=on`, иначе fallback на корень;
- гонки запросов — через `requestId` в slice;
- падение рендера — `ErrorBoundary`.
