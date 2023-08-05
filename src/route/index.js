// Підключаємо технологію express для back-end сервера
const express = require('express')
const { futimes } = require('fs')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  // Статичне приватне поле для сберігання списку обїєктів track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) // генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  // Статичний метод для ствоення  обїекту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }
  // Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }
}

Track.create(
  'Інь Ян',
  'MONATIK і ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez і Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless ',
  'Camila Cabello ',
  'https://picsum.photos/100/100',
)

Track.create(
  '11 PM',
  'Maluma ',
  'https://picsum.photos/100/100',
)
Track.create(
  'DÁKITI',
  'BAD BUNNY і JHAY ',
  'https://picsum.photos/100/100',
)
Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  // Статичне приватне поле для сберігання списку обїєктів Playlist
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) // генеруємо випадкове id
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  // Статичний метод для створення обїєкту  Playlist і додавання його до списку #List
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }
  //  Статичний метод для отримання всього списку плейлістів
  static getList() {
    return this.#list.reverse()
  }
  static makeMix(playlist) {
    const allTracks = Track.getList()
    // цей метод отримує список всіх треків і обрізає (слайс)видає перщі три рандомні

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }
  // власний метод обїекта плейлист для фільтрування трека, який видаляємо з плейлиста
  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }
  // знайти список плейлистів по имени. Берем плейлист, переводим в строчніе букві
  // щоб знайти назву незалежно від регістру
  static findListByValue(name) {
    return this.#list.filter(
      (playlist) =>
        playlist.name
          .toLowerCase()
          .includes(name.toLowerCase()), // а це метод рядка для перевірки, чи включаэ
      // строка playlist.name, подстрокуапередали аргументом в дужках),
      // яка перетворена у нижній регістр
    )
  }
}

Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

// ================================================================
// router.get Створює нам один ендпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',

    data: {},
  })
})

// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name
  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }
  // для створення плейлиста
  const playlist = Playlist.create(name)
  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }
  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================
router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    // тут робимо конвертациію через list.map,щоб отримати новий обїект з кіл-тю треків
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        // повертаемо новий масив з полями, що містить всі властивості одного плейліста без tracks
        // та додаєм нову властивість amount
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// ================================================================
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  // тут реалізуємо динамічний пошук: ввели в стоку пошуку значення -
  // сторінка оновилась, але це значення залишилось в рядку пошуку. - зручно

  const list = Playlist.findListByValue(value)
  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
