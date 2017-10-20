const animals = [
  { name: 'бируанг', gender: 'm' },
  { name: 'комондор', gender: 'm' },
  { name: 'панда', gender: 'f' },
  { name: 'тамарина', gender: 'f' },
  { name: 'ленивец', gender: 'm' },
  { name: 'тапир', gender: 'm' },
  { name: 'миксина', gender: 'f' },
  { name: 'звездонос', gender: 'm' },
  { name: 'плащеносец', gender: 'm' },
  { name: 'аксолотль', gender: 'm' },
  { name: 'руконожка', gender: 'f'},
  { name: 'альпака', gender: 'f' },
  { name: 'долгопят', gender: 'm' },
  { name: 'октопус', gender: 'm' },
  { name: 'нарвал', gender: 'm' },
  { name: 'присосконог', gender: 'm' },
  { name: 'игрунка', gender: 'f' },
  { name: 'утконос', gender: 'm' },
  { name: 'геккон', gender: 'm' },
  { name: 'ехидна', gender: 'f' },
  { name: 'собака', gender: 'f' },
  { name: 'кот', gender: 'm' },
  { name: 'зебра', gender: 'm' },
  { name: 'лось', gender: 'm' },
  { name: 'капибара', gender: 'f' },
  { name: 'ёж', gender: 'm' },
  { name: 'суслик', gender: 'm' },
  { name: 'сорока', gender: 'f' },
  { name: 'медведь', gender: 'm' },
  { name: 'выдра', gender: 'f' },
  { name: 'пума', gender: 'f' },
  { name: 'ягуар', gender: 'm' },
  { name: 'кобра', gender: 'f' },
  { name: 'медведка', gender: 'f' },
  { name: 'осёл', gender: 'm' },
  { name: 'гусь', gender: 'm' },
  { name: 'кенгуру', gender: 'm' },
  { name: 'жираф', gender: 'm' },
  { name: 'колибри', gender: 'f' },
  { name: 'улитка', gender: 'f' },
  { name: 'черепаха', gender: 'f' },
  { name: 'муха', gender: 'f' },
  { name: 'лебедь', gender: 'm' },
  { name: 'муравей', gender: 'm' },
  { name: 'сом', gender: 'm' },
  { name: 'лиса', gender: 'f' },
  { name: 'енот', gender: 'm' },
  { name: 'муравьед', gender: 'm' },
  { name: 'лягушка', gender: 'f' },
  { name: 'утка', gender: 'f' },
  { name: 'лань', gender: 'f' },
  { name: 'гиппопотам', gender: 'm' },
  { name: 'сова', gender: 'f' },
  { name: 'орёл', gender: 'm' },
  { name: 'карп', gender: 'm' },
  { name: 'гиена', gender: 'f' },
  { name: 'верблюд', gender: 'm' },
  { name: 'рысь', gender: 'f' },
  { name: 'белка', gender: 'f' },
  { name: 'лемур', gender: 'm' },
  { name: 'опоссум', gender: 'm' },
  { name: 'тюлень', gender: 'm' },
  { name: 'сайгак', gender: 'm' },
  { name: 'носорог', gender: 'm' },
  { name: 'цапля', gender: 'f' },
  { name: 'щука', gender: 'f' },
  { name: 'пингвин', gender: 'm' },
  { name: 'крокодил', gender: 'm' },
  { name: 'коала', gender: 'f' },
  { name: 'тигр', gender: 'm' },
  { name: 'бабочка', gender: 'f' },
  { name: 'краб', gender: 'm' },
  { name: 'варан', gender: 'm' },
  { name: 'акула', gender: 'f' },
  { name: 'лама', gender: 'f' },
  { name: 'бобёр', gender: 'm' },
  { name: 'фламинго', gender: 'm' },
  { name: 'дельфин', gender: 'm' },
  { name: 'удав', gender: 'm' },
  { name: 'касатка', gender: '' },
]

const words = [
  { f: 'Безупречная', m: 'Безупречный' },
  { f: 'Бесподобная', m: 'Бесподобный' },
  { f: 'Весёлая', m: 'Весёлый' },
  { f: 'Великолепная', m: 'Великолепная' },
  { f: 'Грациозная', m: 'Грациозный' },
  { f: 'Душевная', m: 'Душевный' },
  { m: 'Дружелюбный', f: 'Дружелюбная' },
  { m: 'Жизнерадостный', f: 'Жизнерадостная' },
  { m: 'Заботливый', f: 'Заботливая' },
  { m: 'Загадочный', f: 'Загадочная' },
  { m: 'Застенчивый', f: 'Застенчивая' },
  { m: 'Зажигательный', f: 'Зажигательная' },
  { m: 'Интригующий', f: 'Интригующая' },
  { m: 'Искренний', f: 'Искренняя' },
  { m: 'Классный', f: 'Классная' },
  { m: 'Лучезарный', f: 'Лучезарная' },
  { m: 'Лучший', f: 'Лучшая' },
  { m: 'Мечтательный', f: 'Мечтательная' },
  { m: 'Неповторимый', f: 'Неповторимая' },
  { m: 'Невообразимый', f: 'Невообразимая' },
  { m: 'Обворожительный', f: 'Обворожительная' },
  { m: 'Обаятельный', f: 'Обаятельная' },
  { m: 'Стильный', f: 'Стильная' },
  { m: 'Совершенный', f: 'Совершенная' },
  { m: 'Трогательный', f: 'Трогательная' },
  { m: 'Фантастический', f: 'Фантастическая' },
  { m: 'Целеустремлённый', f: 'Целеустремлённая' },
  { m: 'Шикарный', f: 'Шикарная' },
  { m: 'Энергичный', f: 'Энергичная' },
  { m: 'Чудной', f: 'Чудная' },
  { m: 'Утончённый', f: 'Утончённая' },
  { m: 'Тактичный', f: 'Тактичная' },
  { m: 'Ненаглядный', f: 'Ненаглядная' },
]

let Words = Object.assign([], words)
let Animals = Object.assign([], animals) 

function generate() {
  Words.length === 0 && (Words = Object.assign([], words))
  Animals.length === 0 && (Animals = Object.assign([], animals))

  const ai = Math.floor(Math.random() * Animals.length)
  const wi = Math.floor(Math.random() * Words.length)

  const name = `${ Words[wi][Animals[ai].gender] } ${ Animals[ai].name }`

  Words.splice(wi, 1)
  Animals.splice(ai, 1)

  return name
}

function printLength() {
  console.log(Words.length, Animals.length)
}

module.exports = { generate, printLength }