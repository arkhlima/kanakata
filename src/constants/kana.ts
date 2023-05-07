export type CharGroup = (string | null)[][]

export type Script = 'hiragana' | 'katakana' | 'kana'

export const MONOGRAPHS: CharGroup = [
   ['a', 'i', 'u', 'e', 'o'], // ∅
   ['ka', 'ki', 'ku', 'ke', 'ko'], // K
   ['sa', 'shi', 'su', 'se', 'so'], // S
   ['ta', 'chi', 'tsu', 'te', 'to'], // T
   ['na', 'ni', 'nu', 'ne', 'no'], // N
   ['ha', 'hi', 'fu', 'he', 'ho'], // H
   ['ma', 'mi', 'mu', 'me', 'mo'], // M
   ['ya', null, 'yu', null, 'yo'], // Y
   ['ra', 'ri', 'ru', 're', 'ro'], // R
   ['wa', null, null, null, 'wo'], // W
   ['n', null, null, null, null], // n
]

export const DIAGRAPHS: CharGroup = [
   ['kya', 'kyu', 'kyo'], // KY
   ['sha', 'shu', 'sho'], // SH
   ['cha', 'chu', 'cho'], // CH
   ['nya', 'nyu', 'nyo'], // NY
   ['hya', 'hyu', 'hyo'], // HY
   ['mya', 'myu', 'myo'], // MY
   ['rya', 'ryu', 'ryo'], // RY
]

export const MONOGRAPH_DIACRITICS: CharGroup = [
   ['ga', 'gi', 'gu', 'ge', 'go'], // G
   ['za', 'ji', 'zu', 'ze', 'zo'], // Z
   ['da', 'ji', 'zu', 'de', 'do'], // D
   ['ba', 'bi', 'bu', 'be', 'bo'], // B
   ['pa', 'pi', 'pu', 'pe', 'po'], // P
]

export const DIAGRAPH_DIACRITICS: CharGroup = [
   ['gya', 'gyu', 'gyo'], // KY
   ['ja', 'ju', 'jo'], // J
   ['bya', 'byu', 'byo'], // BY
   ['pya', 'pyu', 'pyo'], // PY
]
