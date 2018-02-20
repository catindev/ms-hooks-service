const animals = [
  { name: 'панда', gender: 'f' },
  { name: 'тапир', gender: 'm' },
  { name: 'собака', gender: 'f' },
  { name: 'кот', gender: 'm' },
  { name: 'зебра', gender: 'f' },
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
  { name: 'кенгуру', gender: 'm' },
  { name: 'колибри', gender: 'f' },
  { name: 'лебедь', gender: 'm' },
  { name: 'муравей', gender: 'm' },
  { name: 'сом', gender: 'm' },
  { name: 'лиса', gender: 'f' },
  { name: 'енот', gender: 'm' },
  { name: 'сова', gender: 'f' },
  { name: 'орёл', gender: 'm' },
  { name: 'карп', gender: 'm' },
  { name: 'рысь', gender: 'f' },
  { name: 'лемур', gender: 'm' },
  { name: 'тюлень', gender: 'm' },
  { name: 'носорог', gender: 'm' },
  { name: 'цапля', gender: 'f' },
  { name: 'щука', gender: 'f' },
  { name: 'пингвин', gender: 'm' },
  { name: 'крокодил', gender: 'm' },
  { name: 'коала', gender: 'f' },
  { name: 'тигр', gender: 'm' },
  { name: 'краб', gender: 'm' },
  { name: 'варан', gender: 'm' },
  { name: 'акула', gender: 'f' },
  { name: 'фламинго', gender: 'm' },
  { name: 'дельфин', gender: 'm' },
  { name: 'касатка', gender: 'f' }
]

const words = [
  { m: 'Проницательный', f: 'Проницательная' },
  { m: 'Ловкий', f: 'Ловкая' },
  { m: 'Добродушный', f: 'Добродушная' },
  { m: 'Смелый', f: 'Смелая' },
  { m: 'Спокойный', f: 'Спокойная' },
  { m: 'Откровенный', f: 'Откровенная' },
  { m: 'Воспитанный', f: 'Воспитанная' },
  { m: 'Учтивый', f: 'Учтивая' },
  { m: 'Творческий', f: 'Творческая' },
  { m: 'Независимый', f: 'Независимая' },
  { m: 'Энергичный', f: 'Энергичная' },
  { m: 'Справедливый', f: 'Справедливая' },
  { m: 'Проворный', f: 'Проворная' },
  { m: 'Щедрый', f: 'Щедрая' },
  { m: 'Амбициозный', f: 'Амбициозная' },
  { m: 'Оптимистичный', f: 'Оптимистичная' },
  { m: 'Надёжный', f: 'Надёжная' },
  { m: 'Серьёзный', f: 'Серьёзная' },
  { m: 'Добросовестный', f: 'Добросовестная' },
  { m: 'Искренний', f: 'Искренняя' },
  { f: 'Весёлая', m: 'Весёлый' },
  { m: 'Неповторимый', f: 'Неповторимая' },
  { m: 'Тактичный', f: 'Тактичная' },
]

let Words = Object.assign([], words)
let Animals = Object.assign([], animals)

function generate() {
  Words.length === 0 && (Words = Object.assign([], words))
  Animals.length === 0 && (Animals = Object.assign([], animals))

  const ai = Math.floor(Math.random() * Animals.length)
  const wi = Math.floor(Math.random() * Words.length)

  const name = `${Words[wi][Animals[ai].gender]} ${Animals[ai].name}`

  Words.splice(wi, 1)
  Animals.splice(ai, 1)

  return name
}

function printLength() {
  console.log(Words.length, Animals.length)
}

module.exports = { generate, printLength }