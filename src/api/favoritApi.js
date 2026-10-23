const BASE =
  process.env.REACT_APP_FAVORIT_URL ||
  "http://api.favorit-parts.ru/hs/hsprice/";
const KEY =
  process.env.REACT_APP_FAVORIT_KEY || "00000000-0000-0000-0000-0000000000001";

function buildUrl({ number, brand, analogues, info }) {
  const p = new URLSearchParams({ key: KEY, number });
  if (brand) p.set("brand", brand);
  if (analogues) p.set("analogues", "on");
  if (info) p.set("info", "on");
  return `${BASE}?${p.toString()}`;
}

async function request(params) {
  const res = await fetch(buildUrl(params));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  // Ловушка 1: ошибка приходит как {error: "..."}
  if (data.error) throw new Error(data.error);

  // Ловушка 2: пустой массив
  if (!Array.isArray(data.goods) || data.goods.length === 0) return [];

  // Ловушка 3: "пустышка" при ненайденной детали (brand:"" count:0 warehouses:[])
  return data.goods.filter((g) => g.brand && g.number);
}

// Этап 1: список производителей для артикула
export async function fetchBrands(number) {
  const goods = await request({ number });
  // Уникальные бренды (на один number API может вернуть несколько строк одного бренда)
  const seen = new Set();
  return goods
    .filter((g) => {
      if (seen.has(g.brand)) return false;
      seen.add(g.brand);
      return true;
    })
    .map((g) => ({ brand: g.brand, number: g.number, goodsID: g.goodsID }));
}

// Этап 2: аналоги выбранного бренда + нормализация предложений
export async function fetchAnalogues(number, brand) {
  const goods = await request({ number, brand, analogues: true, info: true });
  // Корневой товар — это goods[0]; аналоги — в .analogues
  const root = goods[0];
  const list = root?.analogues?.length ? root.analogues : [root];

  // Нормализуем в плоский список предложений (цена берётся ТОЛЬКО из склада)
  return list
    .flatMap((item) =>
      (item.warehouses || []).map((w) => ({
        id: `${item.goodsID}-${w.id}`,
        brand: item.brand,
        number: item.number,
        name: item.name,
        price: w.price,
        stock: w.stock,
        notRefund: w.notRefund || item.notRefund || false,
        shipmentDate: w.shipmentDate,
      })),
    )
    .filter((p) => p.stock > 0 || p.price > 0); // отсекаем нулевые заглушки
}
